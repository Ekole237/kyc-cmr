import { describe, expect, it } from "vitest";

import { getInitialInternalRisk, getRiskScore, getSubmissionGaps } from "../shared/kyc-policy";

describe("règles KYC autonomes", () => {
  it("exige consentement, pièce et selfie avant soumission", () => {
    expect(getSubmissionGaps(false, ["identity_document"])).toEqual(["consentement", "selfie"]);
    expect(getSubmissionGaps(true, ["identity_document", "selfie"])).toEqual([]);
  });

  it("oriente un titre de séjour ou une ville non déterminée vers une revue modérée", () => {
    expect(getInitialInternalRisk("Carte de séjour", "Douala")).toBe("medium");
    expect(getInitialInternalRisk("CNI", "Autre")).toBe("medium");
    expect(getRiskScore("medium")).toBe(40);
  });
});
