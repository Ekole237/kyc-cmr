import { describe, expect, it } from "vitest";

import { createKycTheme } from "../shared/kyc-theme";

const darkPalette = {
  background: "#0B1624", surface: "#132235", foreground: "#F0F6FF", muted: "#AEBED1", border: "#2A4059", primary: "#8CC4FF", success: "#65D99E", warning: "#F1BD62", error: "#FF9B93",
};
const lightPalette = {
  background: "#F8FAFC", surface: "#FFFFFF", foreground: "#162230", muted: "#68798E", border: "#E3EAF2", primary: "#0B2F5B", success: "#16794A", warning: "#B76E09", error: "#B42318",
};

describe("palette KYC clair et sombre", () => {
  it("utilise une surface sombre et un texte clair en thème sombre", () => {
    const theme = createKycTheme(darkPalette, "dark");
    expect(theme.isDark).toBe(true);
    expect(theme.background).toBe("#0B1624");
    expect(theme.surface).toBe("#132235");
    expect(theme.foreground).toBe("#F0F6FF");
  });

  it("conserve des statuts lisibles avec des tons distincts en thème clair", () => {
    const theme = createKycTheme(lightPalette, "light");
    expect(theme.isDark).toBe(false);
    expect(theme.positiveSurface).not.toBe(theme.warningSurface);
    expect(theme.warningText).not.toBe(theme.dangerText);
  });
});
