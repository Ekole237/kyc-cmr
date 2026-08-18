export type KycStatus = "draft" | "in_progress" | "submitted" | "approved" | "needs_review" | "rejected";
export type RiskLevel = "low" | "medium" | "high";
export type DocumentType = "CNI" | "Passeport" | "Carte de séjour";
export type DecisionType = "approved" | "needs_review" | "rejected";

export type KycStepKey = "profile" | "document" | "selfie" | "consent";

export interface KycStep {
  key: KycStepKey;
  title: string;
  description: string;
  completed: boolean;
}

export interface RiskSignal {
  id: string;
  category: "document" | "identity" | "device" | "consent";
  severity: RiskLevel;
  label: string;
  explanation: string;
}

export interface KycDecision {
  type: DecisionType;
  note: string;
  createdAt: string;
  actor: string;
}

export interface KycCase {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  documentType: DocumentType;
  purpose: string;
  status: KycStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  steps: KycStep[];
  signals: RiskSignal[];
  decision?: KycDecision;
  documentCaptured?: boolean;
  selfieCaptured?: boolean;
  consentAccepted?: boolean;
}

export const STATUS_LABELS: Record<KycStatus, string> = {
  draft: "Brouillon",
  in_progress: "En cours",
  submitted: "À analyser",
  approved: "Validé",
  needs_review: "Revue requise",
  rejected: "Non retenu",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Faible",
  medium: "Modéré",
  high: "Élevé",
};

export function getStatusForCase(input: Pick<KycCase, "riskLevel" | "documentCaptured" | "selfieCaptured" | "consentAccepted">): KycStatus {
  if (!input.documentCaptured || !input.selfieCaptured || !input.consentAccepted) return "in_progress";
  if (input.riskLevel === "high") return "needs_review";
  if (input.riskLevel === "medium") return "submitted";
  return "approved";
}

export function getRiskScore(signals: RiskSignal[]): number {
  const weights: Record<RiskLevel, number> = { low: 8, medium: 22, high: 42 };
  return Math.min(99, signals.reduce((score, signal) => score + weights[signal.severity], 6));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 58) return "high";
  if (score >= 28) return "medium";
  return "low";
}

export function buildSteps(caseData: Pick<KycCase, "documentCaptured" | "selfieCaptured" | "consentAccepted">): KycStep[] {
  return [
    { key: "profile", title: "Profil client", description: "Informations de base enregistrées", completed: true },
    { key: "document", title: "Pièce d'identité", description: "CNI, passeport ou titre de séjour", completed: Boolean(caseData.documentCaptured) },
    { key: "selfie", title: "Selfie de contrôle", description: "Photo destinée à la vérification biométrique", completed: Boolean(caseData.selfieCaptured) },
    { key: "consent", title: "Consentement", description: "Information et accord de la personne", completed: Boolean(caseData.consentAccepted) },
  ];
}

export function createCaseId() {
  return `KYC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
