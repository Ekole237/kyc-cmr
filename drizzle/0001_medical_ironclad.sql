CREATE TABLE `kyc_audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` varchar(64),
	`actorUserId` int,
	`action` varchar(80) NOT NULL,
	`summary` varchar(500) NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kyc_audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kyc_cases` (
	`id` varchar(64) NOT NULL,
	`reference` varchar(40) NOT NULL,
	`clientUserId` int NOT NULL,
	`assignedToUserId` int,
	`fullName` varchar(180) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`city` varchar(100) NOT NULL,
	`documentType` varchar(48) NOT NULL,
	`purpose` varchar(255) NOT NULL,
	`status` enum('draft','submitted','in_review','needs_info','approved','rejected') NOT NULL DEFAULT 'draft',
	`riskLevel` enum('low','medium','high') NOT NULL DEFAULT 'low',
	`riskScore` int NOT NULL DEFAULT 0,
	`consentAccepted` boolean NOT NULL DEFAULT false,
	`consentAt` timestamp,
	`submittedAt` timestamp,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kyc_cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `kyc_cases_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `kyc_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` varchar(64) NOT NULL,
	`decision` enum('approved','needs_info','rejected') NOT NULL,
	`rationale` text NOT NULL,
	`decidedByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kyc_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kyc_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` varchar(64) NOT NULL,
	`kind` enum('identity_document','selfie','supporting_document') NOT NULL,
	`storageKey` text NOT NULL,
	`originalName` varchar(180) NOT NULL,
	`mimeType` varchar(80) NOT NULL,
	`byteSize` int NOT NULL,
	`sha256` varchar(64) NOT NULL,
	`uploadedByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kyc_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','client','agent','compliance','admin') NOT NULL DEFAULT 'client';--> statement-breakpoint
CREATE INDEX `kyc_audit_case_idx` ON `kyc_audit_events` (`caseId`);--> statement-breakpoint
CREATE INDEX `kyc_audit_actor_idx` ON `kyc_audit_events` (`actorUserId`);--> statement-breakpoint
CREATE INDEX `kyc_cases_client_idx` ON `kyc_cases` (`clientUserId`);--> statement-breakpoint
CREATE INDEX `kyc_cases_status_idx` ON `kyc_cases` (`status`);--> statement-breakpoint
CREATE INDEX `kyc_cases_assignee_idx` ON `kyc_cases` (`assignedToUserId`);--> statement-breakpoint
CREATE INDEX `kyc_decisions_case_idx` ON `kyc_decisions` (`caseId`);--> statement-breakpoint
CREATE INDEX `kyc_evidence_case_idx` ON `kyc_evidence` (`caseId`);