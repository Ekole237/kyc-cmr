import { boolean, index, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// "user" is retained only for internal legacy compatibility; application users use client, agent, compliance or admin.
export const platformRoles = ["user", "client", "agent", "compliance", "admin"] as const;
export const caseStatuses = ["draft", "submitted", "in_review", "needs_info", "approved", "rejected"] as const;
export const riskLevels = ["low", "medium", "high"] as const;
export const evidenceKinds = ["identity_document", "selfie", "supporting_document"] as const;
export const decisionTypes = ["approved", "needs_info", "rejected"] as const;

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", platformRoles).default("client").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const kycCases = mysqlTable("kyc_cases", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reference: varchar("reference", { length: 40 }).notNull().unique(),
  clientUserId: int("clientUserId").notNull(),
  assignedToUserId: int("assignedToUserId"),
  fullName: varchar("fullName", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  documentType: varchar("documentType", { length: 48 }).notNull(),
  purpose: varchar("purpose", { length: 255 }).notNull(),
  status: mysqlEnum("status", caseStatuses).default("draft").notNull(),
  riskLevel: mysqlEnum("riskLevel", riskLevels).default("low").notNull(),
  riskScore: int("riskScore").default(0).notNull(),
  consentAccepted: boolean("consentAccepted").default(false).notNull(),
  consentAt: timestamp("consentAt"),
  submittedAt: timestamp("submittedAt"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("kyc_cases_client_idx").on(table.clientUserId),
  index("kyc_cases_status_idx").on(table.status),
  index("kyc_cases_assignee_idx").on(table.assignedToUserId),
]);

export const kycEvidence = mysqlTable("kyc_evidence", {
  id: int("id").autoincrement().primaryKey(),
  caseId: varchar("caseId", { length: 64 }).notNull(),
  kind: mysqlEnum("kind", evidenceKinds).notNull(),
  storageKey: text("storageKey").notNull(),
  originalName: varchar("originalName", { length: 180 }).notNull(),
  mimeType: varchar("mimeType", { length: 80 }).notNull(),
  byteSize: int("byteSize").notNull(),
  sha256: varchar("sha256", { length: 64 }).notNull(),
  uploadedByUserId: int("uploadedByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("kyc_evidence_case_idx").on(table.caseId)]);

export const kycDecisions = mysqlTable("kyc_decisions", {
  id: int("id").autoincrement().primaryKey(),
  caseId: varchar("caseId", { length: 64 }).notNull(),
  decision: mysqlEnum("decision", decisionTypes).notNull(),
  rationale: text("rationale").notNull(),
  decidedByUserId: int("decidedByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("kyc_decisions_case_idx").on(table.caseId)]);

export const kycAuditEvents = mysqlTable("kyc_audit_events", {
  id: int("id").autoincrement().primaryKey(),
  caseId: varchar("caseId", { length: 64 }),
  actorUserId: int("actorUserId"),
  action: varchar("action", { length: 80 }).notNull(),
  summary: varchar("summary", { length: 500 }).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("kyc_audit_case_idx").on(table.caseId),
  index("kyc_audit_actor_idx").on(table.actorUserId),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type KycCase = typeof kycCases.$inferSelect;
export type KycEvidence = typeof kycEvidence.$inferSelect;
