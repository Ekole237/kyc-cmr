import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useKycTheme, type KycTheme } from "@/hooks/use-kyc-theme";
import { RISK_LABELS, STATUS_LABELS, type KycStatus, type RiskLevel } from "@/shared/kyc";

function getStatusTone(theme: KycTheme, status: KycStatus) {
  const tones: Record<KycStatus, { background: string; text: string }> = {
    draft: { background: theme.surfaceSubtle, text: theme.muted },
    in_progress: { background: theme.surfaceAccent, text: theme.primary },
    submitted: { background: theme.warningSurface, text: theme.warningText },
    in_review: { background: theme.reviewSurface, text: theme.reviewText },
    needs_info: { background: theme.warningSurface, text: theme.warningText },
    approved: { background: theme.positiveSurface, text: theme.positiveText },
    needs_review: { background: theme.reviewSurface, text: theme.reviewText },
    rejected: { background: theme.dangerSurface, text: theme.dangerText },
  };
  return tones[status];
}

function getRiskTone(theme: KycTheme, risk: RiskLevel) {
  const tones: Record<RiskLevel, { background: string; text: string }> = {
    low: { background: theme.positiveSurface, text: theme.positiveText },
    medium: { background: theme.warningSurface, text: theme.warningText },
    high: { background: theme.dangerSurface, text: theme.dangerText },
  };
  return tones[risk];
}

export function StatusPill({ status }: { status: KycStatus }) {
  const theme = useKycTheme();
  const tone = getStatusTone(theme, status);
  return <View style={[styles.pill, { backgroundColor: tone.background }]}><Text style={[styles.pillText, { color: tone.text }]}>{STATUS_LABELS[status]}</Text></View>;
}

export function RiskPill({ risk }: { risk: RiskLevel }) {
  const theme = useKycTheme();
  const tone = getRiskTone(theme, risk);
  return <View style={[styles.pill, { backgroundColor: tone.background }]}><Text style={[styles.pillText, { color: tone.text }]}>Risque {RISK_LABELS[risk].toLowerCase()}</Text></View>;
}

export function PrimaryButton({ label, onPress, icon = "arrow-forward", disabled = false }: { label: string; onPress: () => void; icon?: keyof typeof MaterialIcons.glyphMap; disabled?: boolean }) {
  const theme = useKycTheme();
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.hero }, disabled && styles.disabledButton, pressed && !disabled && styles.pressed]}><Text style={[styles.primaryButtonText, { color: theme.onPrimary }]}>{label}</Text><MaterialIcons name={icon} size={19} color={theme.onPrimary} /></Pressable>;
}

export function OutlineButton({ label, onPress, icon = "arrow-forward" }: { label: string; onPress: () => void; icon?: keyof typeof MaterialIcons.glyphMap }) {
  const theme = useKycTheme();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.outlineButton, { borderColor: theme.border, backgroundColor: theme.surface }, pressed && { backgroundColor: theme.surfaceSubtle, transform: [{ scale: 0.98 }] }]}><Text style={[styles.outlineButtonText, { color: theme.primary }]}>{label}</Text><MaterialIcons name={icon} size={19} color={theme.primary} /></Pressable>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const theme = useKycTheme();
  return <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: theme.foreground }]}>{title}</Text>{action && onAction ? <Pressable onPress={onAction} style={({ pressed }) => pressed && { opacity: 0.65 }}><Text style={[styles.sectionAction, { color: theme.primary }]}>{action}</Text></Pressable> : null}</View>;
}

export function InfoCard({ icon, title, description, children }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string; children?: ReactNode }) {
  const theme = useKycTheme();
  return <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}><View style={[styles.infoIcon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name={icon} size={22} color={theme.primary} /></View><View style={styles.infoText}><Text style={[styles.infoTitle, { color: theme.foreground }]}>{title}</Text><Text style={[styles.infoDescription, { color: theme.muted }]}>{description}</Text>{children}</View></View>;
}

const styles = StyleSheet.create({
  pill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  pillText: { fontSize: 12, lineHeight: 16, fontWeight: "700" },
  primaryButton: { width: "100%", minHeight: 50, borderRadius: 14, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  primaryButtonText: { fontSize: 15, fontWeight: "800", flexShrink: 1, textAlign: "center" },
  disabledButton: { opacity: 0.45 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  outlineButton: { width: "100%", minHeight: 50, borderRadius: 14, paddingHorizontal: 18, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  outlineButtonText: { fontSize: 15, fontWeight: "800" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 26, marginBottom: 12 },
  sectionTitle: { fontSize: 17, lineHeight: 22, fontWeight: "800" },
  sectionAction: { fontSize: 13, fontWeight: "800" },
  infoCard: { flexDirection: "row", alignItems: "flex-start", borderWidth: 1, borderRadius: 16, padding: 14, gap: 12 },
  infoIcon: { height: 40, width: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  infoText: { flex: 1, minWidth: 0, gap: 3 },
  infoTitle: { fontSize: 15, lineHeight: 20, fontWeight: "800" },
  infoDescription: { fontSize: 13, lineHeight: 18 },
});
