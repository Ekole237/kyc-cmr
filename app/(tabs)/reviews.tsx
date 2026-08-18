import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { InfoCard, RiskPill, StatusPill } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useKyc } from "@/lib/kyc-store";
import type { KycCase } from "@/shared/kyc";

function ReviewCard({ item }: { item: KycCase }) {
  const topSignal = item.signals[0];
  return <Pressable onPress={() => router.push({ pathname: "/cases/[id]", params: { id: item.id } })} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={styles.cardHeader}><View><Text style={styles.name}>{item.fullName}</Text><Text style={styles.meta}>{item.id} · {item.city}</Text></View><RiskPill risk={item.riskLevel} /></View>
    <View style={styles.rule} />
    <View style={styles.reasonRow}><MaterialIcons name="report-problem" size={19} color="#B54708" /><View style={styles.reasonContent}><Text style={styles.reasonTitle}>{topSignal?.label ?? "Dossier à contrôler"}</Text><Text style={styles.reasonDescription}>{topSignal?.explanation ?? "Une décision humaine est nécessaire."}</Text></View></View>
    <View style={styles.cardFooter}><StatusPill status={item.status} /><Text style={styles.actionText}>Ouvrir <MaterialIcons name="chevron-right" size={16} color="#1558A6" /></Text></View>
  </Pressable>;
}

export default function ReviewsScreen() {
  const { cases } = useKyc();
  const reviewCases = cases.filter((caseData) => caseData.status === "needs_review" || caseData.status === "submitted");
  return <ScreenContainer className="px-5"><FlatList data={reviewCases} keyExtractor={(item) => item.id} renderItem={({ item }) => <ReviewCard item={item} />} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} ListHeaderComponent={<View><Text style={styles.eyebrow}>DÉCISIONS À PRENDRE</Text><Text style={styles.title}>File de revue</Text><Text style={styles.description}>Les dossiers affichés nécessitent une vérification ou une décision documentée.</Text><InfoCard icon="fact-check" title={`${reviewCases.length} dossier${reviewCases.length > 1 ? "s" : ""} à prioriser`} description="Consultez les signaux disponibles avant de valider, demander un complément ou clôturer un dossier." /></View>} ListEmptyComponent={<View style={styles.empty}><MaterialIcons name="task-alt" size={42} color="#16794A" /><Text style={styles.emptyTitle}>Aucune revue en attente</Text><Text style={styles.emptyText}>Les prochains dossiers nécessitant une décision apparaîtront ici.</Text></View>} /></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 36, gap: 12 },
  eyebrow: { color: "#58708E", fontSize: 11, fontWeight: "900", letterSpacing: 1.25 },
  title: { color: "#162230", fontSize: 27, lineHeight: 34, fontWeight: "900", marginTop: 4 },
  description: { color: "#66758A", fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 18 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 17, borderWidth: 1, borderColor: "#E3EAF2", padding: 15, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  name: { color: "#162230", fontSize: 16, lineHeight: 21, fontWeight: "900" },
  meta: { color: "#6D7C8F", fontSize: 12, lineHeight: 18, marginTop: 1 },
  rule: { height: 1, backgroundColor: "#E7EDF4" },
  reasonRow: { flexDirection: "row", gap: 9, alignItems: "flex-start" },
  reasonContent: { flex: 1 },
  reasonTitle: { color: "#38485B", fontSize: 13, lineHeight: 18, fontWeight: "800" },
  reasonDescription: { color: "#68798E", fontSize: 12, lineHeight: 17, marginTop: 2 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  actionText: { color: "#1558A6", fontSize: 13, fontWeight: "800", flexDirection: "row" },
  pressed: { opacity: 0.7 },
  empty: { alignItems: "center", paddingVertical: 66, gap: 9 },
  emptyTitle: { color: "#162230", fontSize: 17, fontWeight: "900", marginTop: 7 },
  emptyText: { color: "#68798E", fontSize: 13, textAlign: "center", lineHeight: 19, maxWidth: 240 },
});
