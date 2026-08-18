import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { InfoCard, PrimaryButton, StatusPill } from "@/components/kyc-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { trpc } from "@/lib/trpc";

type EvidenceKind = "identity_document" | "selfie" | "supporting_document";

export default function ClientCaseDetailScreen() {
  const rawId = useLocalSearchParams<{ id: string }>().id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const theme = useKycTheme();
  const details = trpc.kyc.getMine.useQuery({ caseId: id });
  const utils = trpc.useUtils();
  const [uploading, setUploading] = useState<EvidenceKind | null>(null);
  const upload = trpc.kyc.uploadEvidence.useMutation({ onSuccess: () => utils.kyc.getMine.invalidate({ caseId: id }) });
  const consent = trpc.kyc.acceptConsent.useMutation({ onSuccess: () => utils.kyc.getMine.invalidate({ caseId: id }) });
  const submit = trpc.kyc.submit.useMutation({ onSuccess: () => utils.kyc.getMine.invalidate({ caseId: id }) });
  const caseData = details.data?.case;
  const evidence = details.data?.evidence ?? [];
  const has = (kind: EvidenceKind) => evidence.some((item) => item.kind === kind);

  const pickEvidence = async (kind: EvidenceKind) => {
    try {
      const picker = await DocumentPicker.getDocumentAsync({ type: kind === "supporting_document" ? ["image/*", "application/pdf"] : "image/*", copyToCacheDirectory: true, multiple: false, base64: Platform.OS === "web" });
      if (picker.canceled) return;
      const asset = picker.assets[0];
      const mimeType = asset.mimeType === "image/png" ? "image/png" : asset.mimeType === "application/pdf" ? "application/pdf" : "image/jpeg";
      const base64 = Platform.OS === "web" ? asset.base64 : await new File(asset.uri).base64();
      if (!base64) throw new Error("Lecture du fichier impossible.");
      setUploading(kind);
      await upload.mutateAsync({ caseId: id, kind, fileName: asset.name, mimeType, base64 });
    } catch (error) { Alert.alert("Chargement impossible", error instanceof Error ? error.message : "Réessayez avec une image ou un PDF de moins de 4 Mo."); } finally { setUploading(null); }
  };
  const chooseEvidence = (kind: EvidenceKind) => Alert.alert("Ajouter une preuve", "Choisissez un mode de dépôt.", [{ text: "Prendre une photo", onPress: () => router.push({ pathname: "/capture", params: { id, mode: kind === "selfie" ? "selfie" : "document", source: "client", kind } } as never) }, { text: "Choisir un fichier", onPress: () => pickEvidence(kind) }, { text: "Annuler", style: "cancel" }]);

  if (details.isLoading) return <ScreenContainer className="items-center justify-center"><Text style={{ color: theme.muted }}>Chargement du dossier sécurisé…</Text></ScreenContainer>;
  if (!caseData) return <ScreenContainer className="items-center justify-center px-6"><Text style={{ color: theme.foreground, fontSize: 17, fontWeight: "900" }}>Dossier introuvable</Text></ScreenContainer>;
  const ready = caseData.consentAccepted && has("identity_document") && has("selfie");

  return <ScreenContainer edges={["top", "bottom", "left", "right"]}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.nav}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="arrow-back" size={21} color={theme.primary} /></Pressable><Text style={[styles.navTitle, { color: theme.foreground }]}>{caseData.reference}</Text><StatusPill status={caseData.status} /></View><Text style={[styles.title, { color: theme.foreground }]}>Compléter mon dossier</Text><Text style={[styles.description, { color: theme.muted }]}>Chargez des preuves lisibles, confirmez le consentement puis transmettez votre dossier à l’équipe KYC.</Text><InfoCard icon="badge" title={caseData.documentType} description={`${caseData.fullName} · ${caseData.city}`} /><Text style={[styles.section, { color: theme.foreground }]}>Preuves requises</Text><EvidenceAction title="Pièce d’identité" description="Photo nette de la pièce, recto ou page d’identité." icon="badge" completed={has("identity_document")} loading={uploading === "identity_document"} onPress={() => chooseEvidence("identity_document")} /><EvidenceAction title="Selfie de contrôle" description="Photo récente du visage, dans une lumière suffisante." icon="face" completed={has("selfie")} loading={uploading === "selfie"} onPress={() => chooseEvidence("selfie")} /><EvidenceAction title="Document complémentaire" description="Facultatif : justificatif ou demande de l’agent KYC." icon="attach-file" completed={has("supporting_document")} loading={uploading === "supporting_document"} onPress={() => chooseEvidence("supporting_document")} /><Text style={[styles.section, { color: theme.foreground }]}>Consentement</Text><Pressable disabled={consent.isPending || caseData.consentAccepted} onPress={() => consent.mutate({ caseId: id })} style={({ pressed }) => [styles.consent, { backgroundColor: caseData.consentAccepted ? theme.positiveSurface : theme.surface, borderColor: caseData.consentAccepted ? theme.success : theme.border }, pressed && !caseData.consentAccepted && styles.pressed]}><MaterialIcons name={caseData.consentAccepted ? "check-circle" : "privacy-tip"} size={23} color={caseData.consentAccepted ? theme.success : theme.primary} /><View style={styles.consentCopy}><Text style={[styles.consentTitle, { color: theme.foreground }]}>{caseData.consentAccepted ? "Consentement enregistré" : "J’accepte le traitement de mon dossier"}</Text><Text style={[styles.consentText, { color: theme.muted }]}>Les preuves seront examinées par des utilisateurs autorisés de la plateforme.</Text></View></Pressable><View style={styles.submitArea}><PrimaryButton label={submit.isPending ? "Transmission…" : ready ? "Soumettre mon dossier" : "Compléter les éléments requis"} onPress={() => ready ? submit.mutate({ caseId: id }) : Alert.alert("Étapes requises", "Chargez la pièce, le selfie et acceptez le consentement avant de soumettre.")} disabled={submit.isPending} icon="send" /></View><View style={[styles.warning, { backgroundColor: theme.surfaceNotice }]}><MaterialIcons name="shield" size={20} color={theme.primary} /><Text style={[styles.warningText, { color: theme.isDark ? "#C4D9F2" : "#385575" }]}>La plateforme organise une revue humaine interne. Sans connecteur externe, elle ne certifie pas l’authenticité d’une CNI.</Text></View></ScrollView></ScreenContainer>;
}

function EvidenceAction({ title, description, icon, completed, loading, onPress }: { title: string; description: string; icon: keyof typeof MaterialIcons.glyphMap; completed: boolean; loading: boolean; onPress: () => void }) {
  const theme = useKycTheme();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.evidence, { backgroundColor: theme.surface, borderColor: completed ? theme.success : theme.border }, pressed && styles.pressed]}><View style={[styles.evidenceIcon, { backgroundColor: completed ? theme.positiveSurface : theme.surfaceAccent }]}><MaterialIcons name={completed ? "check" : icon} size={21} color={completed ? theme.success : theme.primary} /></View><View style={styles.evidenceCopy}><Text style={[styles.evidenceTitle, { color: theme.foreground }]}>{title}</Text><Text style={[styles.evidenceText, { color: theme.muted }]}>{description}</Text></View><Text style={{ color: completed ? theme.success : theme.primary, fontWeight: "900", fontSize: 12 }}>{loading ? "Envoi…" : completed ? "Ajouté" : "Ajouter"}</Text></Pressable>;
}

const styles = StyleSheet.create({ content: { padding: 20, paddingBottom: 44, gap: 10 }, nav: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }, back: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, navTitle: { flex: 1, minWidth: 0, fontSize: 15, fontWeight: "900" }, title: { fontSize: 26, fontWeight: "900", marginTop: 4 }, description: { fontSize: 14, lineHeight: 20, marginBottom: 12 }, section: { fontSize: 17, fontWeight: "900", marginTop: 18, marginBottom: 2 }, evidence: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 }, evidenceIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" }, evidenceCopy: { flex: 1, minWidth: 0 }, evidenceTitle: { fontSize: 14, fontWeight: "900" }, evidenceText: { fontSize: 12, lineHeight: 17, marginTop: 2 }, consent: { flexDirection: "row", gap: 11, alignItems: "flex-start", padding: 14, borderWidth: 1, borderRadius: 16 }, consentCopy: { flex: 1 }, consentTitle: { fontSize: 14, fontWeight: "900" }, consentText: { fontSize: 12, lineHeight: 17, marginTop: 3 }, submitArea: { marginTop: 12 }, warning: { marginTop: 12, borderRadius: 14, padding: 14, flexDirection: "row", gap: 10 }, warningText: { flex: 1, fontSize: 12, lineHeight: 17 }, pressed: { opacity: 0.72 }, });
