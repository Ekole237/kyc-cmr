import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton, StatusPill } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { SignedInGuard } from "@/components/signed-in-guard";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { trpc } from "@/lib/trpc";
import { getTabContentBottomPadding } from "@/shared/layout";

function ClientHome() {
  const theme = useKycTheme();
  const insets = useSafeAreaInsets();
  const mine = trpc.kyc.mine.useQuery();
  const cases = mine.data ?? [];

  return (
    <ScreenContainer className="px-5">
      <FlatList
        data={cases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomPadding(insets.bottom) }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={[styles.eyebrow, { color: theme.muted }]}>ESPACE CLIENT</Text>
            <Text style={[styles.title, { color: theme.foreground }]}>Mon identité</Text>
            <Text style={[styles.description, { color: theme.muted }]}>Transmettez votre dossier KYC, suivez son traitement et répondez aux demandes de complément.</Text>
            <View style={[styles.hero, { backgroundColor: theme.hero }]}>
              <MaterialIcons name="verified-user" size={30} color="#FFFFFF" />
              <View style={styles.heroCopy}>
                <Text style={styles.heroTitle}>Votre KYC, étape par étape</Text>
                <Text style={styles.heroText}>Vos preuves restent liées à votre dossier et sont consultées uniquement par les équipes autorisées.</Text>
              </View>
            </View>
            <PrimaryButton label="Commencer mon KYC" icon="add" onPress={() => router.push("/client/new" as never)} />
            <Text style={[styles.section, { color: theme.foreground }]}>Mes dossiers</Text>
          </>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: "/client/[id]", params: { id: item.id } } as never)} style={({ pressed }) => [styles.caseRow, { borderBottomColor: theme.borderSoft }, pressed && styles.pressed]}>
            <View style={[styles.caseIcon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="assignment" size={21} color={theme.primary} /></View>
            <View style={styles.caseCopy}>
              <Text style={[styles.caseTitle, { color: theme.foreground }]}>{item.reference}</Text>
              <Text style={[styles.caseMeta, { color: theme.muted }]}>{item.documentType} · {item.city}</Text>
              <StatusPill status={item.status} />
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.muted} />
          </Pressable>
        )}
        ListEmptyComponent={mine.isLoading ? <Text style={[styles.empty, { color: theme.muted }]}>Chargement de vos dossiers…</Text> : <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}><MaterialIcons name="description" size={28} color={theme.primary} /><Text style={[styles.emptyTitle, { color: theme.foreground }]}>Aucun dossier en cours</Text><Text style={[styles.emptyText, { color: theme.muted }]}>Créez votre premier dossier pour démarrer la vérification interne.</Text></View>}
      />
    </ScreenContainer>
  );
}

export default function ClientScreen() {
  return <SignedInGuard title="Accédez à votre espace KYC" description="Connectez-vous pour créer, reprendre et suivre votre propre dossier."><ClientHome /></SignedInGuard>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 36 },
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  title: { fontSize: 28, lineHeight: 35, fontWeight: "900", marginTop: 4 },
  description: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 18 },
  hero: { borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 15 },
  heroCopy: { flex: 1, minWidth: 0 },
  heroTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  heroText: { color: "#D7E5F6", fontSize: 12, lineHeight: 17, marginTop: 4 },
  section: { fontSize: 17, fontWeight: "900", marginTop: 26, marginBottom: 2 },
  caseRow: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1 },
  caseIcon: { height: 42, width: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  caseCopy: { flex: 1, minWidth: 0, gap: 3 },
  caseTitle: { fontSize: 15, fontWeight: "900" },
  caseMeta: { fontSize: 12, lineHeight: 17 },
  empty: { textAlign: "center", paddingVertical: 32 },
  emptyCard: { marginTop: 10, padding: 18, borderRadius: 18, borderWidth: 1, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "900", marginTop: 8 },
  emptyText: { fontSize: 13, lineHeight: 18, textAlign: "center", marginTop: 4 },
  pressed: { opacity: 0.72 },
});
