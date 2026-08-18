import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { SignedInGuard } from "@/components/signed-in-guard";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { trpc } from "@/lib/trpc";

const assignableRoles = ["client", "agent", "compliance", "admin"] as const;
const labels = { client: "Client", agent: "Agent KYC", compliance: "Conformité", admin: "Administrateur" };

function TeamContent() {
  const theme = useKycTheme();
  const role = trpc.platform.role.useQuery();
  const users = trpc.platform.listUsers.useQuery(undefined, { enabled: role.data?.role === "admin" });
  const utils = trpc.useUtils();
  const change = trpc.platform.setRole.useMutation({ onSuccess: () => utils.platform.listUsers.invalidate() });
  if (role.data?.role !== "admin") return <ScreenContainer className="items-center justify-center px-6"><MaterialIcons name="lock" size={38} color={theme.primary} /><Text style={[styles.restrictedTitle, { color: theme.foreground }]}>Accès administrateur requis</Text><Text style={[styles.restrictedText, { color: theme.muted }]}>Seul un administrateur peut attribuer les rôles de la plateforme.</Text></ScreenContainer>;
  const assign = (userId: number, current: keyof typeof labels) => Alert.alert("Attribuer un rôle", "Choisissez le niveau d’accès adapté au collaborateur.", [...assignableRoles.filter((item) => item !== current).map((item) => ({ text: labels[item], onPress: () => change.mutate({ userId, role: item }) })), { text: "Annuler", style: "cancel" as const }]);
  return <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-5"><FlatList data={users.data ?? []} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.content} ListHeaderComponent={<><View style={styles.nav}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="arrow-back" size={21} color={theme.primary} /></Pressable><Text style={[styles.navTitle, { color: theme.foreground }]}>Équipe & rôles</Text><View style={styles.back} /></View><Text style={[styles.description, { color: theme.muted }]}>Attribuez le moindre niveau d’accès nécessaire. Les rôles déterminent l’accès aux dossiers, preuves et décisions.</Text></>} renderItem={({ item }) => { const normalized = item.role === "user" ? "client" : item.role; return <Pressable onPress={() => assign(item.id, normalized as keyof typeof labels)} style={({ pressed }) => [styles.row, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && styles.pressed]}><View style={[styles.avatar, { backgroundColor: theme.surfaceAccent }]}><Text style={{ color: theme.primary, fontWeight: "900" }}>{(item.name ?? item.email ?? "U").slice(0, 1).toUpperCase()}</Text></View><View style={styles.rowCopy}><Text style={[styles.name, { color: theme.foreground }]}>{item.name ?? "Utilisateur"}</Text><Text style={[styles.email, { color: theme.muted }]}>{item.email ?? "Adresse non renseignée"}</Text><Text style={[styles.role, { color: theme.primary }]}>{labels[normalized as keyof typeof labels]}</Text></View><MaterialIcons name="swap-horiz" size={20} color={theme.primary} /></Pressable>; }} ListEmptyComponent={<Text style={{ color: theme.muted, textAlign: "center", paddingVertical: 30 }}>Chargement des utilisateurs…</Text>} /></ScreenContainer>;
}

export default function TeamScreen() { return <SignedInGuard title="Connectez-vous pour gérer l’équipe" description="La gestion des rôles est réservée aux administrateurs."><TeamContent /></SignedInGuard>; }

const styles = StyleSheet.create({ content: { paddingTop: 18, paddingBottom: 38, gap: 10 }, nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }, back: { height: 42, width: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, navTitle: { fontSize: 16, fontWeight: "900" }, description: { fontSize: 13, lineHeight: 19, marginBottom: 8 }, row: { minHeight: 74, borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: "row", alignItems: "center", gap: 12 }, avatar: { height: 42, width: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, rowCopy: { flex: 1, minWidth: 0 }, name: { fontSize: 14, fontWeight: "900" }, email: { fontSize: 12, marginTop: 1 }, role: { fontSize: 12, fontWeight: "800", marginTop: 3 }, restrictedTitle: { fontSize: 19, fontWeight: "900", marginTop: 12 }, restrictedText: { textAlign: "center", fontSize: 13, lineHeight: 19, marginTop: 5 }, pressed: { opacity: 0.72 }, });
