import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCard, RiskPill, StatusPill } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { useKyc } from "@/lib/kyc-store";
import type { KycCase } from "@/shared/kyc";
import { getTabContentBottomPadding } from "@/shared/layout";

function ReviewCard({ item }: { item: KycCase }) {
  const theme = useKycTheme();
  const topSignal = item.signals[0];
  return <Pressable onPress={() => router.push({ pathname: "/cases/[id]", params: { id: item.id } })} style={({ pressed }) => [styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && styles.pressed]}><View style={styles.cardHeader}><View style={styles.cardIdentity}><Text numberOfLines={1} style={[styles.name, { color: theme.foreground }]}>{item.fullName}</Text><Text numberOfLines={1} style={[styles.meta, { color: theme.muted }]}>{item.id} · {item.city}</Text></View><RiskPill risk={item.riskLevel} /></View><View style={[styles.rule, { backgroundColor: theme.borderSoft }]} /><View style={styles.reasonRow}><MaterialIcons name="report-problem" size={19} color={theme.reviewText} /><View style={styles.reasonContent}><Text style={[styles.reasonTitle, { color: theme.foreground }]}>{topSignal?.label ?? "Dossier à contrôler"}</Text><Text style={[styles.reasonDescription, { color: theme.muted }]}>{topSignal?.explanation ?? "Une décision humaine est nécessaire."}</Text></View></View><View style={styles.cardFooter}><StatusPill status={item.status} /><View style={styles.actionText}><Text style={[styles.actionLabel, { color: theme.primary }]}>Ouvrir</Text><MaterialIcons name="chevron-right" size={16} color={theme.primary} /></View></View></Pressable>;
}

export default function ReviewsScreen() {
  const { cases } = useKyc();
  const insets = useSafeAreaInsets();
  const theme = useKycTheme();
  const reviewCases = cases.filter((caseData) => caseData.status === "needs_review" || caseData.status === "submitted");
  return <ScreenContainer className="px-5"><FlatList data={reviewCases} keyExtractor={(item) => item.id} renderItem={({ item }) => <ReviewCard item={item} />} contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomPadding(insets.bottom) }]} showsVerticalScrollIndicator={false} ListHeaderComponent={<View><Text style={[styles.eyebrow, { color: theme.muted }]}>DÉCISIONS À PRENDRE</Text><Text style={[styles.title, { color: theme.foreground }]}>File de revue</Text><Text style={[styles.description, { color: theme.muted }]}>Les dossiers affichés nécessitent une vérification ou une décision documentée.</Text><InfoCard icon="fact-check" title={`${reviewCases.length} dossier${reviewCases.length > 1 ? "s" : ""} à prioriser`} description="Consultez les signaux disponibles avant de valider, demander un complément ou clôturer un dossier." /></View>} ListEmptyComponent={<View style={styles.empty}><MaterialIcons name="task-alt" size={42} color={theme.success} /><Text style={[styles.emptyTitle, { color: theme.foreground }]}>Aucune revue en attente</Text><Text style={[styles.emptyText, { color: theme.muted }]}>Les prochains dossiers nécessitant une décision apparaîtront ici.</Text></View>} /></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 36, gap: 12 },
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.25 },
  title: { fontSize: 27, lineHeight: 34, fontWeight: "900", marginTop: 4 },
  description: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 18 },
  card: { borderRadius: 17, borderWidth: 1, padding: 15, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  cardIdentity: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, lineHeight: 21, fontWeight: "900" },
  meta: { fontSize: 12, lineHeight: 18, marginTop: 1 },
  rule: { height: 1 },
  reasonRow: { flexDirection: "row", gap: 9, alignItems: "flex-start" },
  reasonContent: { flex: 1, minWidth: 0 },
  reasonTitle: { fontSize: 13, lineHeight: 18, fontWeight: "800" },
  reasonDescription: { fontSize: 12, lineHeight: 17, marginTop: 2 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  actionText: { flexDirection: "row", alignItems: "center", gap: 2 },
  actionLabel: { fontSize: 13, fontWeight: "800" },
  pressed: { opacity: 0.7 },
  empty: { alignItems: "center", paddingVertical: 66, gap: 9 },
  emptyTitle: { fontSize: 17, fontWeight: "900", marginTop: 7 },
  emptyText: { fontSize: 13, textAlign: "center", lineHeight: 19, maxWidth: 240 },
});
