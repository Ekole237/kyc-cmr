export type KycThemeBase = {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
};

export function createKycTheme(colors: KycThemeBase, scheme: "light" | "dark") {
  const isDark = scheme === "dark";
  return {
    isDark,
    background: colors.background,
    surface: colors.surface,
    foreground: colors.foreground,
    muted: colors.muted,
    border: colors.border,
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    surfaceSubtle: isDark ? "#152437" : "#F4F7FB",
    surfaceAccent: isDark ? "#173B62" : "#EAF2FF",
    surfaceNotice: isDark ? "#163452" : "#EAF2FF",
    borderSoft: isDark ? "#2B4057" : "#E7EDF4",
    hero: isDark ? "#102D4F" : "#0B2F5B",
    heroPanel: isDark ? "#1D4C7B" : "#174577",
    heroBorder: isDark ? "#3A6E9E" : "#326296",
    onPrimary: "#FFFFFF",
    onHeroMuted: isDark ? "#BFD7F0" : "#D7E5F6",
    positiveSurface: isDark ? "#153C2B" : "#E8F7EF",
    positiveText: isDark ? "#78D6A1" : "#137443",
    warningSurface: isDark ? "#3B2B12" : "#FFF3DB",
    warningText: isDark ? "#F1BD62" : "#9A5B00",
    dangerSurface: isDark ? "#442526" : "#FCEBEB",
    dangerText: isDark ? "#FF9B93" : "#B42318",
    reviewSurface: isDark ? "#412D1B" : "#FFF0E8",
    reviewText: isDark ? "#FFC183" : "#B54708",
  };
}
