export type EvidenceKind = "identity_document" | "selfie" | "supporting_document";
export type InternalRiskLevel = "low" | "medium" | "high";

export function getSubmissionGaps(consentAccepted: boolean, evidenceKinds: EvidenceKind[]) {
  const kinds = new Set(evidenceKinds);
  const gaps: string[] = [];
  if (!consentAccepted) gaps.push("consentement");
  if (!kinds.has("identity_document")) gaps.push("pièce d’identité");
  if (!kinds.has("selfie")) gaps.push("selfie");
  return gaps;
}

export function getInitialInternalRisk(documentType: "CNI" | "Passeport" | "Carte de séjour", city: string): InternalRiskLevel {
  if (documentType === "Carte de séjour") return "medium";
  if (city.trim().length < 3 || city.toLowerCase() === "autre") return "medium";
  return "low";
}

export function getRiskScore(level: InternalRiskLevel) {
  return { low: 12, medium: 40, high: 72 }[level];
}
