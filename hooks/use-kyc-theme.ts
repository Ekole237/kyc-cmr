import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createKycTheme } from "@/shared/kyc-theme";

export { createKycTheme } from "@/shared/kyc-theme";

export function useKycTheme() {
  const colors = useColors();
  const scheme = useColorScheme() ?? "light";
  return createKycTheme(colors, scheme);
}

export type KycTheme = ReturnType<typeof useKycTheme>;
