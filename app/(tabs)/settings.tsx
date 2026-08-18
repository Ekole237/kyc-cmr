import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCard } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { useThemeContext } from "@/lib/theme-provider";
import { getTabContentBottomPadding } from "@/shared/layout";

function SettingRow({ icon, title, description, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string; onPress: () => void }) {
  const theme = useKycTheme();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: theme.borderSoft }, pressed && { backgroundColor: theme.surfaceSubtle }]}><View style={[styles.rowIcon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name={icon} size={20} color={theme.primary} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: theme.foreground }]}>{title}</Text><Text style={[styles.rowDescription, { color: theme.muted }]}>{description}</Text></View><MaterialIcons name="chevron-right" size={21} color={theme.muted} /></Pressable>;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useKycTheme();
  const { colorScheme, setColorScheme } = useThemeContext();
  const notAvailable = (feature: string) => Alert.alert("Préparation en cours", `${feature} sera configuré lors de l’intégration KYC et de la validation conformité.`);
  return <ScreenContainer className="px-5"><ScrollView contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomPadding(insets.bottom) }]} showsVerticalScrollIndicator={false}><Text style={[styles.eyebrow, { color: theme.muted }]}>SÉCURITÉ & CONFIDENTIALITÉ</Text><Text style={[styles.title, { color: theme.foreground }]}>Paramètres</Text><Text style={[styles.description, { color: theme.muted }]}>Le MVP conserve uniquement des données de démonstration sur l’appareil. Les documents et données biométriques réels ne doivent pas être utilisés ici.</Text><InfoCard icon="lock" title="Données de démonstration" description="La version actuelle simule les statuts et les signaux. Une intégration certifiée est requise pour traiter des preuves réelles." /><Text style={[styles.section, { color: theme.muted }]}>Apparence</Text><View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.surface }]}><SettingRow icon={colorScheme === "dark" ? "light-mode" : "dark-mode"} title="Thème de l’application" description={colorScheme === "dark" ? "Mode sombre actif" : "Mode clair actif"} onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")} /></View><Text style={[styles.section, { color: theme.muted }]}>Conformité</Text><View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.surface }]}><SettingRow icon="security" title="Prestataire de vérification" description="Non configuré" onPress={() => notAvailable("Le choix du prestataire KYC")} /><SettingRow icon="policy" title="Politique de conservation" description="À définir avec la conformité" onPress={() => notAvailable("La politique de conservation")} /><SettingRow icon="language" title="Langue du parcours" description="Français (CM)" onPress={() => notAvailable("Le changement de langue")} /></View><Text style={[styles.section, { color: theme.muted }]}>À propos</Text><View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.surface }]}><SettingRow icon="info-outline" title="À propos de KYC Cameroun" description="MVP local · version 0.1" onPress={() => Alert.alert("KYC Cameroun", "MVP de démonstration pour l’orchestration d’un parcours KYC au Cameroun.")} /></View></ScrollView></ScreenContainer>;
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
