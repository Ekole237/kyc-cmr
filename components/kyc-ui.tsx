import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { RISK_LABELS, STATUS_LABELS, type KycStatus, type RiskLevel } from "@/shared/kyc";

const statusColors: Record<KycStatus, { background: string; text: string }> = {
  draft: { background: "#EEF2F6", text: "#52606D" },
  in_progress: { background: "#EAF2FF", text: "#1558A6" },
  submitted: { background: "#FFF3DB", text: "#9A5B00" },
  approved: { background: "#E8F7EF", text: "#137443" },
  needs_review: { background: "#FFF0E8", text: "#B54708" },
  rejected: { background: "#FCEBEB", text: "#B42318" },
};

const riskColors: Record<RiskLevel, { background: string; text: string }> = {
  low: { background: "#E8F7EF", text: "#137443" },
  medium: { background: "#FFF3DB", text: "#9A5B00" },
  high: { background: "#FCEBEB", text: "#B42318" },
};

export function StatusPill({ status }: { status: KycStatus }) {
  const tone = statusColors[status];
  return <View style={[styles.pill, { backgroundColor: tone.background }]}><Text style={[styles.pillText, { color: tone.text }]}>{STATUS_LABELS[status]}</Text></View>;
}

export function RiskPill({ risk }: { risk: RiskLevel }) {
  const tone = riskColors[risk];
  return <View style={[styles.pill, { backgroundColor: tone.background }]}><Text style={[styles.pillText, { color: tone.text }]}>Risque {RISK_LABELS[risk].toLowerCase()}</Text></View>;
}

export function PrimaryButton({ label, onPress, icon = "arrow-forward", disabled = false }: { label: string; onPress: () => void; icon?: keyof typeof MaterialIcons.glyphMap; disabled?: boolean }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, disabled && styles.disabledButton, pressed && !disabled && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text><MaterialIcons name={icon} size={19} color="#FFFFFF" />
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, icon = "arrow-forward" }: { label: string; onPress: () => void; icon?: keyof typeof MaterialIcons.glyphMap }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.outlineButton, pressed && styles.outlinePressed]}>
      <Text style={styles.outlineButtonText}>{label}</Text><MaterialIcons name={icon} size={19} color="#0B2F5B" />
    </Pressable>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action && onAction ? <Pressable onPress={onAction} style={({ pressed }) => pressed && { opacity: 0.65 }}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}</View>;
}

export function InfoCard({ icon, title, description, children }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string; children?: ReactNode }) {
  return <View style={styles.infoCard}><View style={styles.infoIcon}><MaterialIcons name={icon} size={22} color="#0B2F5B" /></View><View style={styles.infoText}><Text style={styles.infoTitle}>{title}</Text><Text style={styles.infoDescription}>{description}</Text>{children}</View></View>;
}

const styles = StyleSheet.create({
  pill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  pillText: { fontSize: 12, lineHeight: 16, fontWeight: "700" },
  primaryButton: { minHeight: 50, borderRadius: 14, paddingHorizontal: 18, backgroundColor: "#0B2F5B", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  disabledButton: { opacity: 0.45 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  outlineButton: { minHeight: 50, borderRadius: 14, paddingHorizontal: 18, borderWidth: 1, borderColor: "#B9C9DD", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#FFFFFF" },
  outlineButtonText: { color: "#0B2F5B", fontSize: 15, fontWeight: "800" },
  outlinePressed: { backgroundColor: "#F4F7FB", transform: [{ scale: 0.98 }] },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 26, marginBottom: 12 },
  sectionTitle: { color: "#162230", fontSize: 17, lineHeight: 22, fontWeight: "800" },
  sectionAction: { color: "#1558A6", fontSize: 13, fontWeight: "800" },
  infoCard: { flexDirection: "row", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E3EAF2", borderRadius: 16, padding: 14, gap: 12 },
  infoIcon: { height: 40, width: 40, borderRadius: 12, backgroundColor: "#EAF2FF", alignItems: "center", justifyContent: "center" },
  infoText: { flex: 1, gap: 3 },
  infoTitle: { color: "#162230", fontSize: 15, lineHeight: 20, fontWeight: "800" },
  infoDescription: { color: "#66758A", fontSize: 13, lineHeight: 18 },
});
