import { describe, expect, it } from "vitest";

import { getRiskLevel, getRiskScore, getStatusForCase } from "../shared/kyc";

describe("moteur de risque KYC", () => {
  it("classe une combinaison de signaux modérés et élevés comme un risque élevé", () => {
    const score = getRiskScore([
      { id: "one", category: "document", severity: "medium", label: "test", explanation: "test" },
      { id: "two", category: "device", severity: "high", label: "test", explanation: "test" },
    ]);
    expect(score).toBe(70);
    expect(getRiskLevel(score)).toBe("high");
  });

  it("conserve un dossier incomplet en cours quel que soit son niveau de risque", () => {
    expect(getStatusForCase({ riskLevel: "high", documentCaptured: true, selfieCaptured: false, consentAccepted: true })).toBe("in_progress");
  });

  it("oriente un dossier complet à risque élevé vers la revue humaine", () => {
    expect(getStatusForCase({ riskLevel: "high", documentCaptured: true, selfieCaptured: true, consentAccepted: true })).toBe("needs_review");
  });
});
