import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton, RiskPill, SectionHeader, StatusPill } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { useKyc } from "@/lib/kyc-store";
import type { KycCase } from "@/shared/kyc";
import { getTabContentBottomPadding } from "@/shared/layout";

function CaseRow({ item }: { item: KycCase }) {
  const theme = useKycTheme();
  return <Pressable onPress={() => router.push({ pathname: "/cases/[id]", params: { id: item.id } })} style={({ pressed }) => [styles.caseRow, { borderBottomColor: theme.borderSoft }, pressed && styles.pressed]}><View style={[styles.avatar, { backgroundColor: theme.surfaceAccent }]}><Text style={[styles.avatarText, { color: theme.primary }]}>{item.fullName.split(" ").map((name) => name[0]).slice(0, 2).join("")}</Text></View><View style={styles.caseContent}><Text numberOfLines={1} style={[styles.caseName, { color: theme.foreground }]}>{item.fullName}</Text><Text numberOfLines={1} style={[styles.caseMeta, { color: theme.muted }]}>{item.city} · {item.documentType}</Text><View style={styles.casePills}><StatusPill status={item.status} /><RiskPill risk={item.riskLevel} /></View></View><MaterialIcons name="chevron-right" size={22} color={theme.muted} /></Pressable>;
}

export default function HomeScreen() {
  const { cases, reviewCount } = useKyc();
  const insets = useSafeAreaInsets();
  const theme = useKycTheme();
  const recentCases = cases.slice(0, 4);
  const completed = cases.filter((caseData) => caseData.status === "approved").length;

  return <ScreenContainer className="px-5" containerClassName="bg-background"><FlatList data={recentCases} keyExtractor={(item) => item.id} renderItem={({ item }) => <CaseRow item={item} />} contentContainerStyle={[styles.listContent, { paddingBottom: getTabContentBottomPadding(insets.bottom) }]} ListHeaderComponent={<><View style={styles.topline}><View><Text style={[styles.eyebrow, { color: theme.muted }]}>KYC CAMEROUN</Text><Text style={[styles.greeting, { color: theme.foreground }]}>Bonjour, équipe KYC</Text></View><View style={[styles.shield, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="verified-user" size={22} color={theme.primary} /></View></View><View style={[styles.hero, { backgroundColor: theme.hero }]}><View style={styles.heroCopy}><Text style={[styles.heroOverline, { color: theme.onHeroMuted }]}>PILOTAGE DU JOUR</Text><Text style={[styles.heroTitle, { color: theme.onPrimary }]}>{reviewCount > 0 ? `${reviewCount} dossier${reviewCount > 1 ? "s" : ""} à examiner` : "Aucun dossier bloqué"}</Text><Text style={[styles.heroDescription, { color: theme.onHeroMuted }]}>Priorisez les dossiers nécessitant une intervention humaine et gardez une trace de chaque décision.</Text></View><View style={[styles.heroScore, { backgroundColor: theme.heroPanel, borderColor: theme.heroBorder }]}><Text style={[styles.heroScoreNumber, { color: theme.onPrimary }]}>{cases.length}</Text><Text style={[styles.heroScoreLabel, { color: theme.onHeroMuted }]}>dossiers</Text></View></View><PrimaryButton label="Créer un dossier" icon="add" onPress={() => router.push("/cases/new")} /><View style={[styles.metrics, { backgroundColor: theme.surface, borderColor: theme.border }]}><View style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: theme.warningSurface }]}><MaterialIcons name="pending-actions" size={20} color={theme.warningText} /></View><Text style={[styles.metricValue, { color: theme.foreground }]}>{reviewCount}</Text><Text style={[styles.metricLabel, { color: theme.muted }]}>À examiner</Text></View><View style={[styles.metricDivider, { backgroundColor: theme.borderSoft }]} /><View style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: theme.positiveSurface }]}><MaterialIcons name="task-alt" size={20} color={theme.positiveText} /></View><Text style={[styles.metricValue, { color: theme.foreground }]}>{completed}</Text><Text style={[styles.metricLabel, { color: theme.muted }]}>Validés</Text></View><View style={[styles.metricDivider, { backgroundColor: theme.borderSoft }]} /><View style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="hourglass-top" size={20} color={theme.primary} /></View><Text style={[styles.metricValue, { color: theme.foreground }]}>{cases.filter((caseData) => caseData.status === "in_progress").length}</Text><Text style={[styles.metricLabel, { color: theme.muted }]}>En cours</Text></View></View><SectionHeader title="Dossiers récents" action="Voir la revue" onAction={() => router.push("/(tabs)/reviews")} /></>} ListEmptyComponent={<Text style={[styles.empty, { color: theme.muted }]}>Aucun dossier à afficher.</Text>} ListFooterComponent={<View style={[styles.notice, { backgroundColor: theme.surfaceNotice }]}><MaterialIcons name="privacy-tip" size={20} color={theme.primary} /><Text style={[styles.noticeText, { color: theme.isDark ? "#C4D9F2" : "#385575" }]}>Démonstration locale : aucun document réel ne doit être utilisé avant l’intégration d’un prestataire KYC et la validation conformité.</Text></View>} showsVerticalScrollIndicator={false} /></ScreenContainer>;
}

const styles = StyleSheet.create({
  listContent: { paddingTop: 18, paddingBottom: 36 },
  topline: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  eyebrow: { fontSize: 11, lineHeight: 16, fontWeight: "900", letterSpacing: 1.3 },
  greeting: { fontSize: 23, lineHeight: 30, fontWeight: "900", marginTop: 2 },
  shield: { height: 43, width: 43, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  hero: { borderRadius: 22, padding: 20, marginBottom: 16, flexDirection: "row", minHeight: 160, overflow: "hidden" },
  heroCopy: { flex: 1, minWidth: 0, paddingRight: 10 },
  heroOverline: { fontSize: 10, lineHeight: 14, fontWeight: "900", letterSpacing: 1.1 },
  heroTitle: { fontSize: 23, lineHeight: 29, fontWeight: "900", marginTop: 7 },
  heroDescription: { fontSize: 12.5, lineHeight: 18, marginTop: 8 },
  heroScore: { height: 78, width: 78, borderRadius: 39, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", borderWidth: 1 },
  heroScoreNumber: { fontSize: 25, lineHeight: 28, fontWeight: "900" },
  heroScoreLabel: { fontSize: 10, fontWeight: "700" },
  metrics: { borderRadius: 18, borderWidth: 1, paddingVertical: 16, paddingHorizontal: 12, marginTop: 16, flexDirection: "row", alignItems: "center" },
  metric: { flex: 1, alignItems: "center", gap: 3 },
  metricDivider: { width: 1, height: 50 },
  metricIcon: { height: 30, width: 30, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  metricValue: { fontSize: 17, lineHeight: 20, fontWeight: "900" },
  metricLabel: { fontSize: 10.5, fontWeight: "700" },
  caseRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1 },
  pressed: { opacity: 0.72 },
  avatar: { height: 44, width: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 13, fontWeight: "900" },
  caseContent: { flex: 1, minWidth: 0, gap: 2 },
  caseName: { fontSize: 15, lineHeight: 20, fontWeight: "800" },
  caseMeta: { fontSize: 12, lineHeight: 17 },
  casePills: { flexDirection: "row", gap: 6, marginTop: 4, flexWrap: "wrap" },
  notice: { marginTop: 26, borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  noticeText: { fontSize: 12, lineHeight: 17, flex: 1 },
  empty: { textAlign: "center", paddingVertical: 28 },
});
