import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/kyc-ui";
import { useKycTheme } from "@/hooks/use-kyc-theme";
import { useKyc } from "@/lib/kyc-store";
import { getCameraHeaderPaddingTop, getCameraSheetPaddingBottom } from "@/shared/layout";

export default function CaptureScreen() {
  const params = useLocalSearchParams<{ id: string; mode: "document" | "selfie" }>();
  const caseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const mode = params.mode === "selfie" ? "selfie" : "document";
  const insets = useSafeAreaInsets();
  const theme = useKycTheme();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const { markEvidenceCaptured } = useKyc();
  const title = mode === "document" ? "Cadrer la pièce" : "Cadrer le visage";
  const guidance = mode === "document" ? "Placez la CNI ou le passeport dans le cadre, sans reflet et avec les quatre coins visibles." : "Centrez le visage, gardez une bonne lumière et retirez tout élément qui le masque.";

  const capture = async () => {
    if (!cameraRef.current || !isReady) return;
    try {
      await cameraRef.current.takePictureAsync({ quality: 0.65, exif: false, base64: false });
      setIsCaptured(true);
    } catch { Alert.alert("Capture indisponible", "La photo n’a pas pu être prise. Vérifiez l’accès à l’appareil photo et réessayez."); }
  };
  const confirm = () => { markEvidenceCaptured(caseId, mode); router.back(); };

  if (!permission) return <View style={[styles.permissionLoading, { backgroundColor: theme.background }]}><Text style={{ color: theme.muted }}>Préparation de l’appareil photo…</Text></View>;
  if (!permission.granted) return <View style={[styles.permissionContainer, { backgroundColor: theme.background }]}><View style={[styles.permissionIcon, { backgroundColor: theme.surfaceAccent }]}><MaterialIcons name="camera-alt" size={34} color={theme.primary} /></View><Text style={[styles.permissionTitle, { color: theme.foreground }]}>Autoriser l’appareil photo</Text><Text style={[styles.permissionText, { color: theme.muted }]}>KYC Cameroun utilise l’appareil photo pour préparer la capture de document ou de selfie. Le MVP ne transmet pas de photo à un prestataire de vérification.</Text><PrimaryButton label="Autoriser la caméra" onPress={requestPermission} icon="camera-alt" /><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}><Text style={[styles.cancelText, { color: theme.primary }]}>Annuler</Text></Pressable></View>;

  return <View style={styles.container}><CameraView ref={cameraRef} facing={mode === "selfie" ? "front" : "back"} onCameraReady={() => setIsReady(true)} style={styles.camera}><View style={styles.overlay}><View style={[styles.header, { paddingTop: getCameraHeaderPaddingTop(insets.top) }]}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.close, pressed && styles.pressed]}><MaterialIcons name="close" size={22} color="#FFFFFF" /></Pressable><Text style={styles.headerTitle}>{mode === "document" ? "Pièce d’identité" : "Selfie de contrôle"}</Text><View style={styles.headerSpacer} /></View><View style={styles.guideArea}><View style={[styles.guideFrame, mode === "selfie" && styles.selfieFrame]} /></View><View style={[styles.bottomSheet, { backgroundColor: theme.surface, paddingBottom: getCameraSheetPaddingBottom(insets.bottom) }]}><Text style={[styles.captureTitle, { color: theme.foreground }]}>{isCaptured ? "Capture préparée" : title}</Text><Text style={[styles.captureText, { color: theme.muted }]}>{isCaptured ? "Vérifiez l’image puis confirmez l’étape." : guidance}</Text>{isCaptured ? <PrimaryButton label="Confirmer l’étape" onPress={confirm} icon="check" /> : <Pressable disabled={!isReady} onPress={capture} style={({ pressed }) => [styles.captureButton, { backgroundColor: theme.hero }, !isReady && styles.captureDisabled, pressed && isReady && styles.capturePressed]}><View style={[styles.captureInner, { backgroundColor: theme.surface }]} /></Pressable>}<Text style={[styles.demoNotice, { color: theme.muted }]}>{Platform.OS === "web" ? "La caméra peut être limitée dans la prévisualisation web." : "Aucune photo n’est envoyée dans cette démonstration."}</Text></View></View></CameraView></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" }, camera: { flex: 1 }, overlay: { flex: 1, backgroundColor: "rgba(4, 15, 28, 0.38)", justifyContent: "space-between" }, header: { paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, close: { height: 42, width: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" }, headerTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", flexShrink: 1, textAlign: "center", marginHorizontal: 10 }, headerSpacer: { width: 42 }, guideArea: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }, guideFrame: { width: "100%", aspectRatio: 1.58, borderRadius: 18, borderWidth: 3, borderColor: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.05)" }, selfieFrame: { width: 236, height: 292, aspectRatio: undefined, borderRadius: 136, maxHeight: "74%" }, bottomSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 20, alignItems: "center" }, captureTitle: { color: "#162230", fontSize: 19, fontWeight: "900", textAlign: "center" }, captureText: { color: "#66758A", fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 6, marginBottom: 17, maxWidth: 320 }, captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#0B2F5B", padding: 6, alignItems: "center", justifyContent: "center" }, captureInner: { height: "100%", width: "100%", borderRadius: 32, backgroundColor: "#FFFFFF" }, captureDisabled: { opacity: 0.4 }, capturePressed: { transform: [{ scale: 0.95 }], opacity: 0.88 }, demoNotice: { color: "#7E8DA0", fontSize: 11, lineHeight: 16, marginTop: 14, textAlign: "center" }, permissionLoading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" }, permissionContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, backgroundColor: "#F8FAFC" }, permissionIcon: { height: 72, width: 72, borderRadius: 24, backgroundColor: "#EAF2FF", alignItems: "center", justifyContent: "center" }, permissionTitle: { color: "#162230", fontSize: 22, fontWeight: "900", marginTop: 18, textAlign: "center" }, permissionText: { color: "#66758A", fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 8, marginBottom: 22 }, cancel: { paddingVertical: 16 }, cancelText: { color: "#0B2F5B", fontSize: 14, fontWeight: "800" }, pressed: { opacity: 0.7 },
});
