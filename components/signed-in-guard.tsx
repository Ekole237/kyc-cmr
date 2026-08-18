import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useKycTheme } from "@/hooks/use-kyc-theme";
import { useAuth } from "@/hooks/use-auth";
import { startOAuthLogin } from "@/constants/oauth";

export function SignedInGuard({ children, title = "Connectez-vous pour continuer", description = "Votre dossier KYC et vos preuves sont associés à votre compte sécurisé." }: { children: ReactNode; title?: string; description?: string }) {
  const { loading, isAuthenticated } = useAuth();
  const theme = useKycTheme();
  if (loading) return <View style={[styles.center, { backgroundColor: theme.background }]}><ActivityIndicator color={theme.primary} /><Text style={[styles.loading, { color: theme.muted }]}>Vérification de votre session…</Text></View>;
  if (isAuthenticated) return <>{children}</>;
  return <View style={[styles.center, { backgroundColor: theme.background }]}><View style={[styles.icon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="verified-user" size={31} color={theme.primary} /></View><Text style={[styles.title, { color: theme.foreground }]}>{title}</Text><Text style={[styles.description, { color: theme.muted }]}>{description}</Text><Pressable onPress={() => startOAuthLogin()} style={({ pressed }) => [styles.button, { backgroundColor: theme.hero }, pressed && styles.pressed]}><Text style={styles.buttonText}>Se connecter</Text><MaterialIcons name="login" size={19} color="#FFFFFF" /></Pressable></View>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  icon: { height: 72, width: 72, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, lineHeight: 29, fontWeight: "900", marginTop: 18, textAlign: "center" },
  description: { fontSize: 14, lineHeight: 20, textAlign: "center", marginTop: 8, maxWidth: 310 },
  button: { width: "100%", maxWidth: 330, minHeight: 52, borderRadius: 14, marginTop: 24, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  loading: { marginTop: 12, fontSize: 14 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
});
