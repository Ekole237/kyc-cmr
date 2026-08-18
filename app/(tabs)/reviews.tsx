import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCard, RiskPill, StatusPill } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { SignedInGuard } from "@/components/signed-in-guard";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { trpc } from "@/lib/trpc";
import { getTabContentBottomPadding } from "@/shared/layout";

function OperationsHome() {
  const theme = useKycTheme();
  const insets = useSafeAreaInsets();
  const role = trpc.platform.role.useQuery();
  const allowed = role.data?.role === "agent" || role.data?.role === "compliance" || role.data?.role === "admin";
  const metrics = trpc.kyc.operationsMetrics.useQuery(undefined, { enabled: allowed });
  const cases = trpc.kyc.operationsList.useQuery({ statuses: ["submitted", "in_review", "needs_info"] }, { enabled: allowed });
  if (role.isLoading) return <ScreenContainer className="items-center justify-center"><Text style={{ color: theme.muted }}>Chargement de votre espace…</Text></ScreenContainer>;
  if (!allowed) return <ScreenContainer className="px-5"><View style={styles.restricted}><View style={[styles.restrictedIcon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="lock" size={28} color={theme.primary} /></View><Text style={[styles.restrictedTitle, { color: theme.foreground }]}>Espace réservé aux opérations</Text><Text style={[styles.restrictedText, { color: theme.muted }]}>Votre rôle actuel est Client. Utilisez l’onglet Mon KYC pour soumettre et suivre votre dossier.</Text></View></ScreenContainer>;
  const data = cases.data ?? [];
  return <ScreenContainer className="px-5"><FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomPadding(insets.bottom) }]} showsVerticalScrollIndicator={false} ListHeaderComponent={<><Text style={[styles.eyebrow, { color: theme.muted }]}>OPÉRATIONS & CONFORMITÉ</Text><Text style={[styles.title, { color: theme.foreground }]}>File de revue</Text><Text style={[styles.description, { color: theme.muted }]}>Traitez les dossiers soumis, demandez un complément ou enregistrez une décision justifiée.</Text><View style={styles.metricGrid}><Metric label="À traiter" value={metrics.data?.inReview ?? 0} tone="warning" /><Metric label="Compléments" value={metrics.data?.needsInfo ?? 0} tone="primary" /><Metric label="Risque élevé" value={metrics.data?.highRisk ?? 0} tone="error" /></View><InfoCard icon="fact-check" title="Décisions traçables" description="Chaque décision est enregistrée avec son auteur, sa justification et son horodatage." /><Text style={[styles.section, { color: theme.foreground }]}>Dossiers en attente</Text></>} renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: "/operations/[id]", params: { id: item.id } } as never)} style={({ pressed }) => [styles.caseCard, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && styles.pressed]}><View style={styles.cardHeader}><View style={styles.cardCopy}><Text style={[styles.caseName, { color: theme.foreground }]}>{item.fullName}</Text><Text style={[styles.caseMeta, { color: theme.muted }]}>{item.reference} · {item.documentType}</Text></View><RiskPill risk={item.riskLevel} /></View><View style={styles.cardFooter}><StatusPill status={item.status} /><Text style={[styles.open, { color: theme.primary }]}>Examiner <MaterialIcons name="chevron-right" size={16} color={theme.primary} /></Text></View></Pressable>} ListEmptyComponent={cases.isLoading ? <Text style={[styles.empty, { color: theme.muted }]}>Chargement de la file…</Text> : <View style={styles.empty}><MaterialIcons name="task-alt" size={36} color={theme.success} /><Text style={[styles.emptyTitle, { color: theme.foreground }]}>Aucun dossier en attente</Text><Text style={[styles.emptyText, { color: theme.muted }]}>Les nouveaux dossiers soumis apparaîtront ici.</Text></View>} /></ScreenContainer>;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "warning" | "primary" | "error" }) {
  const theme = useKycTheme();
  const colors = tone === "warning" ? { surface: theme.warningSurface, text: theme.warningText } : tone === "error" ? { surface: theme.dangerSurface, text: theme.dangerText } : { surface: theme.surfaceAccent, text: theme.primary };
  return <View style={[styles.metric, { backgroundColor: colors.surface }]}><Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.text }]}>{label}</Text></View>;
}

export default function ReviewsScreen() {
  return <SignedInGuard title="Accédez à l’espace opérations" description="Connectez-vous avec un rôle Agent, Conformité ou Administrateur pour traiter les dossiers."><OperationsHome /></SignedInGuard>;
}

const styles = StyleSheet.create({ content: { paddingTop: 18, paddingBottom: 36, gap: 12 }, eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.2 }, title: { fontSize: 27, lineHeight: 34, fontWeight: "900", marginTop: 4 }, description: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 18 }, metricGrid: { flexDirection: "row", gap: 8, marginBottom: 14 }, metric: { flex: 1, minHeight: 78, borderRadius: 16, padding: 12, justifyContent: "center" }, metricValue: { fontSize: 22, fontWeight: "900" }, metricLabel: { fontSize: 11, lineHeight: 15, fontWeight: "800", marginTop: 2 }, section: { fontSize: 17, fontWeight: "900", marginTop: 22, marginBottom: 1 }, caseCard: { borderRadius: 17, borderWidth: 1, padding: 14, gap: 12 }, cardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, cardCopy: { flex: 1, minWidth: 0 }, caseName: { fontSize: 16, fontWeight: "900" }, caseMeta: { fontSize: 12, lineHeight: 17, marginTop: 2 }, cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, open: { fontSize: 12, fontWeight: "900" }, restricted: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 22 }, restrictedIcon: { height: 66, width: 66, borderRadius: 22, alignItems: "center", justifyContent: "center" }, restrictedTitle: { fontSize: 20, fontWeight: "900", textAlign: "center", marginTop: 14 }, restrictedText: { fontSize: 14, lineHeight: 20, textAlign: "center", marginTop: 7 }, empty: { alignItems: "center", paddingVertical: 42, gap: 7 }, emptyTitle: { fontSize: 16, fontWeight: "900" }, emptyText: { fontSize: 13, textAlign: "center" }, pressed: { opacity: 0.72 }, });
