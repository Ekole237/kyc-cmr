import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCard } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { getTabContentBottomPadding } from "@/shared/layout";

function SettingRow({ icon, title, description, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}><View style={styles.rowIcon}><MaterialIcons name={icon} size={20} color="#0B2F5B" /></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDescription}>{description}</Text></View><MaterialIcons name="chevron-right" size={21} color="#8A9AAD" /></Pressable>;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const notAvailable = (feature: string) => Alert.alert("Préparation en cours", `${feature} sera configuré lors de l’intégration KYC et de la validation conformité.`);
  return <ScreenContainer className="px-5"><ScrollView contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomPadding(insets.bottom) }]} showsVerticalScrollIndicator={false}><Text style={styles.eyebrow}>SÉCURITÉ & CONFIDENTIALITÉ</Text><Text style={styles.title}>Paramètres</Text><Text style={styles.description}>Le MVP conserve uniquement des données de démonstration sur l’appareil. Les documents et données biométriques réels ne doivent pas être utilisés ici.</Text><InfoCard icon="lock" title="Données de démonstration" description="La version actuelle simule les statuts et les signaux. Une intégration certifiée est requise pour traiter des preuves réelles." /><Text style={styles.section}>Conformité</Text><View style={styles.group}><SettingRow icon="security" title="Prestataire de vérification" description="Non configuré" onPress={() => notAvailable("Le choix du prestataire KYC")} /><SettingRow icon="policy" title="Politique de conservation" description="À définir avec la conformité" onPress={() => notAvailable("La politique de conservation")} /><SettingRow icon="language" title="Langue du parcours" description="Français (CM)" onPress={() => notAvailable("Le changement de langue")} /></View><Text style={styles.section}>À propos</Text><View style={styles.group}><SettingRow icon="info-outline" title="À propos de KYC Cameroun" description="MVP local · version 0.1" onPress={() => Alert.alert("KYC Cameroun", "MVP de démonstration pour l’orchestration d’un parcours KYC au Cameroun.")} /></View></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 36 },
  eyebrow: { color: "#58708E", fontSize: 11, fontWeight: "900", letterSpacing: 1.25 },
  title: { color: "#162230", fontSize: 27, lineHeight: 34, fontWeight: "900", marginTop: 4 },
  description: { color: "#66758A", fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 18 },
  section: { color: "#38485B", fontSize: 13, fontWeight: "900", marginTop: 28, marginBottom: 9, textTransform: "uppercase", letterSpacing: 0.65 },
  group: { borderWidth: 1, borderColor: "#E3EAF2", backgroundColor: "#FFFFFF", borderRadius: 16, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: "#E7EDF4" },
  rowIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: "#EAF2FF" },
  rowCopy: { flex: 1, minWidth: 0 },
  rowTitle: { color: "#162230", fontSize: 14, fontWeight: "800", lineHeight: 19 },
  rowDescription: { color: "#68798E", fontSize: 12, lineHeight: 17, marginTop: 1 },
  pressed: { backgroundColor: "#F5F8FC" },
});
