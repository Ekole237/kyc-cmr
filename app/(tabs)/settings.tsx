import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCard } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { useThemeContext } from "@/lib/theme-provider";
import { trpc } from "@/lib/trpc";
import { router } from "expo-router";
import { getTabContentBottomPadding } from "@/shared/layout";

function SettingRow({ icon, title, description, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string; onPress: () => void }) {
  const theme = useKycTheme();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: theme.borderSoft }, pressed && { backgroundColor: theme.surfaceSubtle }]}><View style={[styles.rowIcon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name={icon} size={20} color={theme.primary} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: theme.foreground }]}>{title}</Text><Text style={[styles.rowDescription, { color: theme.muted }]}>{description}</Text></View><MaterialIcons name="chevron-right" size={21} color={theme.muted} /></Pressable>;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useKycTheme();
  const { colorScheme, setColorScheme } = useThemeContext();
  const role = trpc.platform.role.useQuery(undefined, { retry: false });
  const notAvailable = (feature: string) => Alert.alert("Préparation en cours", `${feature} sera configuré lors de l’intégration KYC et de la validation conformité.`);
  return <ScreenContainer className="px-5"><ScrollView contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomPadding(insets.bottom) }]} showsVerticalScrollIndicator={false}><Text style={[styles.eyebrow, { color: theme.muted }]}>SÉCURITÉ & CONFIDENTIALITÉ</Text><Text style={[styles.title, { color: theme.foreground }]}>Paramètres</Text><Text style={[styles.description, { color: theme.muted }]}>Les dossiers KYC sont rattachés à un compte et accessibles uniquement selon le rôle attribué.</Text><InfoCard icon="lock" title="Accès contrôlé" description="Les rôles Client, Agent, Conformité et Administrateur limitent les actions accessibles dans la plateforme." /><Text style={[styles.section, { color: theme.muted }]}>Apparence</Text><View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.surface }]}><SettingRow icon={colorScheme === "dark" ? "light-mode" : "dark-mode"} title="Thème de l’application" description={colorScheme === "dark" ? "Mode sombre actif" : "Mode clair actif"} onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")} /></View>{role.data?.role === "admin" ? <><Text style={[styles.section, { color: theme.muted }]}>Administration</Text><View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.surface }]}><SettingRow icon="group" title="Équipe et rôles" description="Attribuer les accès Client, Agent, Conformité ou Administrateur" onPress={() => router.push("/admin/team" as never)} /></View></> : null}<Text style={[styles.section, { color: theme.muted }]}>Conformité</Text><View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.surface }]}><SettingRow icon="security" title="Vérification externe" description="Aucun fournisseur n’est connecté" onPress={() => notAvailable("Le choix d’un fournisseur KYC")} /><SettingRow icon="policy" title="Politique de conservation" description="À définir avec la conformité" onPress={() => notAvailable("La politique de conservation")} /><SettingRow icon="language" title="Langue du parcours" description="Français (CM)" onPress={() => notAvailable("Le changement de langue")} /></View><Text style={[styles.section, { color: theme.muted }]}>À propos</Text><View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.surface }]}><SettingRow icon="info-outline" title="À propos de KYC Cameroun" description="Plateforme KYC autonome · version 0.2" onPress={() => Alert.alert("KYC Cameroun", "Plateforme de collecte et de revue KYC interne, sans vérification externe active.")} /></View></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 36 },
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.25 },
  title: { fontSize: 27, lineHeight: 34, fontWeight: "900", marginTop: 4 },
  description: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 18 },
  section: { fontSize: 13, fontWeight: "900", marginTop: 28, marginBottom: 9, textTransform: "uppercase", letterSpacing: 0.65 },
  group: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderBottomWidth: 1 },
  rowIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  rowCopy: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14, fontWeight: "800", lineHeight: 19 },
  rowDescription: { fontSize: 12, lineHeight: 17, marginTop: 1 },
});
