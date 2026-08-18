import { and, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

import { InsertUser, kycAuditEvents, kycCases, kycDecisions, kycEvidence, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  (["name", "email", "loginMethod"] as const).forEach((field) => { if (user[field] !== undefined) { values[field] = user[field]; updateSet[field] = user[field] ?? null; } });
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn));
}

export async function createCase(data: typeof kycCases.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(kycCases).values(data);
  return data;
}

export async function getCaseForClient(caseId: string, clientUserId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(kycCases).where(and(eq(kycCases.id, caseId), eq(kycCases.clientUserId, clientUserId))).limit(1);
  return result[0];
}

export async function getCaseById(caseId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(kycCases).where(eq(kycCases.id, caseId)).limit(1);
  return result[0];
}

export async function listClientCases(clientUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(kycCases).where(eq(kycCases.clientUserId, clientUserId)).orderBy(desc(kycCases.updatedAt));
}

export async function listOperationsCases(statuses?: Array<typeof kycCases.status.enumValues[number]>) {
  const db = await getDb();
  if (!db) return [];
  return statuses?.length ? db.select().from(kycCases).where(inArray(kycCases.status, statuses)).orderBy(desc(kycCases.updatedAt)) : db.select().from(kycCases).orderBy(desc(kycCases.updatedAt));
}

export async function updateCase(caseId: string, data: Partial<typeof kycCases.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(kycCases).set(data).where(eq(kycCases.id, caseId));
}

export async function addEvidence(data: typeof kycEvidence.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(kycEvidence).values(data);
  return Number(result[0].insertId);
}

export async function listEvidence(caseId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(kycEvidence).where(eq(kycEvidence.caseId, caseId)).orderBy(desc(kycEvidence.createdAt));
}

export async function addDecision(data: typeof kycDecisions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(kycDecisions).values(data);
  return Number(result[0].insertId);
}

export async function writeAudit(data: typeof kycAuditEvents.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(kycAuditEvents).values(data);
}

export async function listAudit(caseId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(kycAuditEvents).where(eq(kycAuditEvents.caseId, caseId)).orderBy(desc(kycAuditEvents.createdAt));
}

export async function getOperationsMetrics() {
  const rows = await listOperationsCases();
  return { total: rows.length, inReview: rows.filter((item) => item.status === "submitted" || item.status === "in_review").length, needsInfo: rows.filter((item) => item.status === "needs_info").length, approved: rows.filter((item) => item.status === "approved").length, highRisk: rows.filter((item) => item.riskLevel === "high").length };
}
