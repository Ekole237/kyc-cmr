import { createHash, randomUUID } from "node:crypto";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { caseStatuses, decisionTypes, evidenceKinds, platformRoles, riskLevels } from "../drizzle/schema";
import { COOKIE_NAME } from "../shared/const";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storageGetSignedUrl, storagePut } from "./storage";
import { getInitialInternalRisk, getRiskScore, getSubmissionGaps } from "../shared/kyc-policy";

const operationsRoles = new Set(["agent", "compliance", "admin"]);

function requireOperationsRole(role: string) {
  if (!operationsRoles.has(role)) throw new TRPCError({ code: "FORBIDDEN", message: "Cette action est réservée aux équipes KYC." });
}

function requireAdminRole(role: string) {
  if (role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Cette action est réservée à l’administrateur." });
}

function makeReference() {
  return `KYC-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

const caseInput = z.object({
  fullName: z.string().trim().min(3).max(180),
  phone: z.string().trim().regex(/^\+237\s?[23689]\d{7,8}$/, "Utilisez un numéro camerounais au format +237."),
  city: z.string().trim().min(2).max(100),
  documentType: z.enum(["CNI", "Passeport", "Carte de séjour"]),
  purpose: z.string().trim().min(3).max(255),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  platform: router({
    role: protectedProcedure.query(({ ctx }) => ({ role: ctx.user.role, name: ctx.user.name, email: ctx.user.email })),
    listUsers: protectedProcedure.query(async ({ ctx }) => { requireAdminRole(ctx.user.role); return db.listUsers(); }),
    setRole: protectedProcedure.input(z.object({ userId: z.number().int().positive(), role: z.enum(["client", "agent", "compliance", "admin"]) })).mutation(async ({ ctx, input }) => {
      requireAdminRole(ctx.user.role);
      const target = await db.getDb();
      if (!target) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      const { users } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      await target.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      await db.writeAudit({ actorUserId: ctx.user.id, action: "user.role_changed", summary: `Rôle mis à jour vers ${input.role}.`, metadata: { targetUserId: input.userId, role: input.role } });
      return { success: true };
    }),
  }),
  kyc: router({
    create: protectedProcedure.input(caseInput).mutation(async ({ ctx, input }) => {
      const id = randomUUID();
      const created = await db.createCase({ id, reference: makeReference(), clientUserId: ctx.user.id, ...input, status: "draft", riskLevel: "low", riskScore: 0, consentAccepted: false });
      await db.writeAudit({ caseId: id, actorUserId: ctx.user.id, action: "case.created", summary: "Dossier KYC créé par le client.", metadata: { source: "client" } });
      return created;
    }),
    mine: protectedProcedure.query(({ ctx }) => db.listClientCases(ctx.user.id)),
    getMine: protectedProcedure.input(z.object({ caseId: z.string().uuid() })).query(async ({ ctx, input }) => {
      const caseData = await db.getCaseForClient(input.caseId, ctx.user.id);
      if (!caseData) throw new TRPCError({ code: "NOT_FOUND", message: "Dossier introuvable." });
      const evidence = await db.listEvidence(caseData.id);
      return { case: caseData, evidence: evidence.map(({ storageKey: _storageKey, ...item }) => item) };
    }),
    acceptConsent: protectedProcedure.input(z.object({ caseId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const caseData = await db.getCaseForClient(input.caseId, ctx.user.id);
      if (!caseData) throw new TRPCError({ code: "NOT_FOUND" });
      await db.updateCase(caseData.id, { consentAccepted: true, consentAt: new Date() });
      await db.writeAudit({ caseId: caseData.id, actorUserId: ctx.user.id, action: "case.consent_accepted", summary: "Consentement client enregistré." });
      return { success: true };
    }),
    uploadEvidence: protectedProcedure.input(z.object({ caseId: z.string().uuid(), kind: z.enum(evidenceKinds), fileName: z.string().trim().min(1).max(180), mimeType: z.enum(["image/jpeg", "image/png", "application/pdf"]), base64: z.string().min(32).max(5_600_000) })).mutation(async ({ ctx, input }) => {
      const caseData = await db.getCaseForClient(input.caseId, ctx.user.id);
      if (!caseData) throw new TRPCError({ code: "NOT_FOUND" });
      const bytes = Buffer.from(input.base64, "base64");
      if (!bytes.length || bytes.length > 4 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "La preuve doit faire au plus 4 Mo." });
      const suffix = input.mimeType === "application/pdf" ? "pdf" : input.mimeType === "image/png" ? "png" : "jpg";
      const result = await storagePut(`kyc/${caseData.id}/${input.kind}.${suffix}`, bytes, input.mimeType);
      await db.addEvidence({ caseId: caseData.id, kind: input.kind, storageKey: result.key, originalName: input.fileName, mimeType: input.mimeType, byteSize: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), uploadedByUserId: ctx.user.id });
      await db.writeAudit({ caseId: caseData.id, actorUserId: ctx.user.id, action: "evidence.uploaded", summary: `Preuve ${input.kind} chargée.`, metadata: { kind: input.kind, byteSize: bytes.length } });
      return { success: true };
    }),
    submit: protectedProcedure.input(z.object({ caseId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const caseData = await db.getCaseForClient(input.caseId, ctx.user.id);
      if (!caseData) throw new TRPCError({ code: "NOT_FOUND" });
      const evidence = await db.listEvidence(caseData.id);
      const gaps = getSubmissionGaps(caseData.consentAccepted, evidence.map((item) => item.kind));
      if (gaps.length) throw new TRPCError({ code: "BAD_REQUEST", message: `Éléments requis : ${gaps.join(", ")}.` });
      const riskLevel = getInitialInternalRisk(caseData.documentType as "CNI" | "Passeport" | "Carte de séjour", caseData.city);
      await db.updateCase(caseData.id, { status: "submitted", riskLevel, riskScore: getRiskScore(riskLevel), submittedAt: new Date() });
      await db.writeAudit({ caseId: caseData.id, actorUserId: ctx.user.id, action: "case.submitted", summary: "Dossier transmis à la file de revue.", metadata: { riskLevel } });
      return { status: "submitted", riskLevel };
    }),
    operationsList: protectedProcedure.input(z.object({ statuses: z.array(z.enum(caseStatuses)).optional() }).optional()).query(async ({ ctx, input }) => { requireOperationsRole(ctx.user.role); return db.listOperationsCases(input?.statuses); }),
    operationsMetrics: protectedProcedure.query(async ({ ctx }) => { requireOperationsRole(ctx.user.role); return db.getOperationsMetrics(); }),
    getForReview: protectedProcedure.input(z.object({ caseId: z.string().uuid() })).query(async ({ ctx, input }) => {
      requireOperationsRole(ctx.user.role);
      const caseData = await db.getCaseById(input.caseId);
      if (!caseData) throw new TRPCError({ code: "NOT_FOUND" });
      const evidence = await db.listEvidence(caseData.id);
      const audit = await db.listAudit(caseData.id);
      const visibleEvidence = await Promise.all(evidence.map(async (item) => ({ ...item, downloadUrl: await storageGetSignedUrl(item.storageKey) })));
      return { case: caseData, evidence: visibleEvidence, audit };
    }),
    decide: protectedProcedure.input(z.object({ caseId: z.string().uuid(), decision: z.enum(decisionTypes), rationale: z.string().trim().min(8).max(2_000), riskLevel: z.enum(riskLevels) })).mutation(async ({ ctx, input }) => {
      requireOperationsRole(ctx.user.role);
      const caseData = await db.getCaseById(input.caseId);
      if (!caseData) throw new TRPCError({ code: "NOT_FOUND" });
      const status = input.decision === "approved" ? "approved" : input.decision === "needs_info" ? "needs_info" : "rejected";
      await db.addDecision({ caseId: caseData.id, decision: input.decision, rationale: input.rationale, decidedByUserId: ctx.user.id });
      await db.updateCase(caseData.id, { status, riskLevel: input.riskLevel, riskScore: getRiskScore(input.riskLevel), assignedToUserId: ctx.user.id, reviewedAt: new Date() });
      await db.writeAudit({ caseId: caseData.id, actorUserId: ctx.user.id, action: "case.decision_recorded", summary: `Décision ${input.decision} enregistrée.`, metadata: { riskLevel: input.riskLevel, rationale: input.rationale } });
      return { status };
    }),
  }),
});

export type AppRouter = typeof appRouter;
