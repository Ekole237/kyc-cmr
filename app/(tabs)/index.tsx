import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton, RiskPill, SectionHeader, StatusPill } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useKyc } from "@/lib/kyc-store";
import type { KycCase } from "@/shared/kyc";

function CaseRow({ item }: { item: KycCase }) {
  return <Pressable onPress={() => router.push({ pathname: "/cases/[id]", params: { id: item.id } })} style={({ pressed }) => [styles.caseRow, pressed && styles.pressed]}>
    <View style={styles.avatar}><Text style={styles.avatarText}>{item.fullName.split(" ").map((name) => name[0]).slice(0, 2).join("")}</Text></View>
    <View style={styles.caseContent}><Text style={styles.caseName}>{item.fullName}</Text><Text style={styles.caseMeta}>{item.city} · {item.documentType}</Text><View style={styles.casePills}><StatusPill status={item.status} /><RiskPill risk={item.riskLevel} /></View></View>
    <MaterialIcons name="chevron-right" size={22} color="#8A9AAD" />
  </Pressable>;
}

export default function HomeScreen() {
  const { cases, reviewCount } = useKyc();
  const recentCases = cases.slice(0, 4);
  const completed = cases.filter((caseData) => caseData.status === "approved").length;

  return <ScreenContainer className="px-5" containerClassName="bg-background">
    <FlatList
      data={recentCases}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CaseRow item={item} />}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={<>
        <View style={styles.topline}><View><Text style={styles.eyebrow}>KYC CAMEROUN</Text><Text style={styles.greeting}>Bonjour, équipe KYC</Text></View><View style={styles.shield}><MaterialIcons name="verified-user" size={22} color="#0B2F5B" /></View></View>
        <View style={styles.hero}><View style={styles.heroCopy}><Text style={styles.heroOverline}>PILOTAGE DU JOUR</Text><Text style={styles.heroTitle}>{reviewCount > 0 ? `${reviewCount} dossier${reviewCount > 1 ? "s" : ""} à examiner` : "Aucun dossier bloqué"}</Text><Text style={styles.heroDescription}>Priorisez les dossiers nécessitant une intervention humaine et gardez une trace de chaque décision.</Text></View><View style={styles.heroScore}><Text style={styles.heroScoreNumber}>{cases.length}</Text><Text style={styles.heroScoreLabel}>dossiers</Text></View></View>
        <PrimaryButton label="Créer un dossier" icon="add" onPress={() => router.push("/cases/new")} />
        <View style={styles.metrics}><View style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: "#FFF3DB" }]}><MaterialIcons name="pending-actions" size={20} color="#9A5B00" /></View><Text style={styles.metricValue}>{reviewCount}</Text><Text style={styles.metricLabel}>À examiner</Text></View><View style={styles.metricDivider} /><View style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: "#E8F7EF" }]}><MaterialIcons name="task-alt" size={20} color="#137443" /></View><Text style={styles.metricValue}>{completed}</Text><Text style={styles.metricLabel}>Validés</Text></View><View style={styles.metricDivider} /><View style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: "#EAF2FF" }]}><MaterialIcons name="hourglass-top" size={20} color="#1558A6" /></View><Text style={styles.metricValue}>{cases.filter((caseData) => caseData.status === "in_progress").length}</Text><Text style={styles.metricLabel}>En cours</Text></View></View>
        <SectionHeader title="Dossiers récents" action="Voir la revue" onAction={() => router.push("/(tabs)/reviews")} />
      </>}
      ListEmptyComponent={<Text style={styles.empty}>Aucun dossier à afficher.</Text>}
      ListFooterComponent={<View style={styles.notice}><MaterialIcons name="privacy-tip" size={20} color="#1558A6" /><Text style={styles.noticeText}>Démonstration locale : aucun document réel ne doit être utilisé avant l’intégration d’un prestataire KYC et la validation conformité.</Text></View>}
      showsVerticalScrollIndicator={false}
    />
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  listContent: { paddingTop: 18, paddingBottom: 36 },
  topline: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  eyebrow: { color: "#58708E", fontSize: 11, lineHeight: 16, fontWeight: "900", letterSpacing: 1.3 },
  greeting: { color: "#162230", fontSize: 23, lineHeight: 30, fontWeight: "900", marginTop: 2 },
  shield: { height: 43, width: 43, backgroundColor: "#EAF2FF", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  hero: { backgroundColor: "#0B2F5B", borderRadius: 22, padding: 20, marginBottom: 16, flexDirection: "row", minHeight: 160, overflow: "hidden" },
  heroCopy: { flex: 1, paddingRight: 10 },
  heroOverline: { color: "#AFC9EB", fontSize: 10, lineHeight: 14, fontWeight: "900", letterSpacing: 1.1 },
  heroTitle: { color: "#FFFFFF", fontSize: 23, lineHeight: 29, fontWeight: "900", marginTop: 7 },
  heroDescription: { color: "#D7E5F6", fontSize: 12.5, lineHeight: 18, marginTop: 8 },
  heroScore: { height: 78, width: 78, borderRadius: 39, backgroundColor: "#174577", alignItems: "center", justifyContent: "center", alignSelf: "flex-end", borderWidth: 1, borderColor: "#326296" },
  heroScoreNumber: { color: "#FFFFFF", fontSize: 25, lineHeight: 28, fontWeight: "900" },
  heroScoreLabel: { color: "#C9DCF2", fontSize: 10, fontWeight: "700" },
  metrics: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E3EAF2", paddingVertical: 16, paddingHorizontal: 12, marginTop: 16, flexDirection: "row", alignItems: "center" },
  metric: { flex: 1, alignItems: "center", gap: 3 },
  metricDivider: { width: 1, height: 50, backgroundColor: "#E7EDF4" },
  metricIcon: { height: 30, width: 30, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  metricValue: { color: "#162230", fontSize: 17, lineHeight: 20, fontWeight: "900" },
  metricLabel: { color: "#68798E", fontSize: 10.5, fontWeight: "700" },
  caseRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#E7EDF4" },
  pressed: { opacity: 0.72 },
  avatar: { height: 44, width: 44, borderRadius: 15, backgroundColor: "#EAF2FF", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#0B2F5B", fontSize: 13, fontWeight: "900" },
  caseContent: { flex: 1, gap: 2 },
  caseName: { color: "#162230", fontSize: 15, lineHeight: 20, fontWeight: "800" },
  caseMeta: { color: "#6D7C8F", fontSize: 12, lineHeight: 17 },
  casePills: { flexDirection: "row", gap: 6, marginTop: 4, flexWrap: "wrap" },
  notice: { marginTop: 26, borderRadius: 14, padding: 14, backgroundColor: "#EAF2FF", flexDirection: "row", gap: 10, alignItems: "flex-start" },
  noticeText: { color: "#385575", fontSize: 12, lineHeight: 17, flex: 1 },
  empty: { color: "#6D7C8F", textAlign: "center", paddingVertical: 28 },
});
