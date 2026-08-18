import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Platform } from "react-native";

import {
  buildSteps,
  createCaseId,
  getRiskLevel,
  getRiskScore,
  getStatusForCase,
  type DecisionType,
  type DocumentType,
  type KycCase,
  type KycStatus,
  type RiskSignal,
} from "@/shared/kyc";

const STORAGE_KEY = "kyc-cameroon.cases.v1";
const SECURE_INDEX_KEY = "kyc-cameroon.case-index.v1";

function secureCaseKey(caseId: string) {
  return `kyc-cameroon.case.${caseId}`;
}

type DraftInput = {
  fullName: string;
  phone: string;
  city: string;
  documentType: DocumentType;
  purpose: string;
};

type KycContextValue = {
  cases: KycCase[];
  isHydrated: boolean;
  createCase: (input: DraftInput) => KycCase;
  markEvidenceCaptured: (caseId: string, type: "document" | "selfie") => void;
  setConsent: (caseId: string, accepted: boolean) => void;
  submitCase: (caseId: string) => void;
  makeDecision: (caseId: string, decision: DecisionType, note: string) => void;
  getCase: (caseId: string) => KycCase | undefined;
  reviewCount: number;
};

const initialCases: KycCase[] = [
  {
    id: "KYC-2026-A71C",
    fullName: "Aïcha Ndam",
    phone: "+237 6 77 21 09 48",
    city: "Yaoundé",
    documentType: "CNI",
    purpose: "Ouverture de compte marchand",
    status: "needs_review",
    riskLevel: "high",
    riskScore: 64,
    createdAt: "2026-08-18T07:35:00.000Z",
    updatedAt: "2026-08-18T08:15:00.000Z",
    documentCaptured: true,
    selfieCaptured: true,
    consentAccepted: true,
    steps: buildSteps({ documentCaptured: true, selfieCaptured: true, consentAccepted: true }),
    signals: [
      { id: "s1", category: "document", severity: "medium", label: "Lisibilité limitée", explanation: "La photographie de la pièce nécessite une vérification humaine." },
      { id: "s2", category: "device", severity: "high", label: "Signal appareil inhabituel", explanation: "Le dossier nécessite une confirmation avant toute décision finale." },
    ],
  },
  {
    id: "KYC-2026-F42M",
    fullName: "Jules Mbarga",
    phone: "+237 6 94 12 40 08",
    city: "Douala",
    documentType: "Passeport",
    purpose: "Activation de portefeuille professionnel",
    status: "approved",
    riskLevel: "low",
    riskScore: 14,
    createdAt: "2026-08-18T06:10:00.000Z",
    updatedAt: "2026-08-18T06:24:00.000Z",
    documentCaptured: true,
    selfieCaptured: true,
    consentAccepted: true,
    steps: buildSteps({ documentCaptured: true, selfieCaptured: true, consentAccepted: true }),
    signals: [
      { id: "s3", category: "identity", severity: "low", label: "Parcours cohérent", explanation: "Toutes les étapes requises sont complétées dans cette démonstration." },
    ],
    decision: { type: "approved", note: "Dossier complet dans le cadre de la démonstration.", actor: "Responsable KYC", createdAt: "2026-08-18T06:24:00.000Z" },
  },
  {
    id: "KYC-2026-D09P",
    fullName: "Sandrine Fonkou",
    phone: "+237 6 51 33 07 16",
    city: "Bafoussam",
    documentType: "CNI",
    purpose: "Mise à jour d'identité",
    status: "in_progress",
    riskLevel: "low",
    riskScore: 6,
    createdAt: "2026-08-18T08:05:00.000Z",
    updatedAt: "2026-08-18T08:05:00.000Z",
    documentCaptured: false,
    selfieCaptured: false,
    consentAccepted: false,
    steps: buildSteps({ documentCaptured: false, selfieCaptured: false, consentAccepted: false }),
    signals: [],
  },
];

const KycContext = createContext<KycContextValue | undefined>(undefined);

async function loadCasesFromDevice(): Promise<KycCase[] | null> {
  if (Platform.OS === "web") {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  const indexValue = await SecureStore.getItemAsync(SECURE_INDEX_KEY);
  if (!indexValue) return null;
  const ids = JSON.parse(indexValue) as string[];
  const entries = await Promise.all(ids.map((caseId) => SecureStore.getItemAsync(secureCaseKey(caseId))));
  return entries.filter((entry): entry is string => Boolean(entry)).map((entry) => JSON.parse(entry) as KycCase);
}

async function saveCasesToDevice(cases: KycCase[]) {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return;
  }

  const previousIndexValue = await SecureStore.getItemAsync(SECURE_INDEX_KEY);
  const previousIds = previousIndexValue ? (JSON.parse(previousIndexValue) as string[]) : [];
  const nextIds = cases.map((caseData) => caseData.id);
  await Promise.all(cases.map((caseData) => SecureStore.setItemAsync(secureCaseKey(caseData.id), JSON.stringify(caseData))));
  await Promise.all(previousIds.filter((caseId) => !nextIds.includes(caseId)).map((caseId) => SecureStore.deleteItemAsync(secureCaseKey(caseId))));
  await SecureStore.setItemAsync(SECURE_INDEX_KEY, JSON.stringify(nextIds));
}

function normalizeCase(caseData: KycCase): KycCase {
  const riskScore = getRiskScore(caseData.signals);
  const riskLevel = getRiskLevel(riskScore);
  const status = caseData.decision?.type ?? getStatusForCase({ ...caseData, riskLevel });
  return {
    ...caseData,
    riskScore,
    riskLevel,
    status,
    steps: buildSteps(caseData),
    updatedAt: new Date().toISOString(),
  };
}

export function KycProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<KycCase[]>(initialCases);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    loadCasesFromDevice()
      .then((stored) => {
        if (stored?.length) setCases(stored);
      })
      .catch(() => undefined)
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (isHydrated) saveCasesToDevice(cases).catch(() => undefined);
  }, [cases, isHydrated]);

  const updateCase = useCallback((caseId: string, updater: (current: KycCase) => KycCase) => {
    setCases((current) => current.map((caseData) => (caseData.id === caseId ? normalizeCase(updater(caseData)) : caseData)));
  }, []);

  const createCase = useCallback((input: DraftInput) => {
    const now = new Date().toISOString();
    const newCase: KycCase = {
      id: createCaseId(),
      ...input,
      status: "in_progress",
      riskLevel: "low",
      riskScore: 6,
      createdAt: now,
      updatedAt: now,
      documentCaptured: false,
      selfieCaptured: false,
      consentAccepted: false,
      steps: buildSteps({ documentCaptured: false, selfieCaptured: false, consentAccepted: false }),
      signals: [],
    };
    setCases((current) => [newCase, ...current]);
    return newCase;
  }, []);

  const markEvidenceCaptured = useCallback((caseId: string, type: "document" | "selfie") => {
    updateCase(caseId, (current) => ({ ...current, documentCaptured: type === "document" ? true : current.documentCaptured, selfieCaptured: type === "selfie" ? true : current.selfieCaptured }));
  }, [updateCase]);

  const setConsent = useCallback((caseId: string, accepted: boolean) => updateCase(caseId, (current) => ({ ...current, consentAccepted: accepted })), [updateCase]);

  const submitCase = useCallback((caseId: string) => {
    updateCase(caseId, (current) => {
      const signals: RiskSignal[] = current.documentType === "CNI" && current.city !== "Yaoundé" && current.city !== "Douala"
        ? [{ id: `signal-${Date.now()}`, category: "document", severity: "medium", label: "Contrôle de cohérence requis", explanation: "Le MVP propose une revue complémentaire afin de confirmer la cohérence du dossier." }]
        : [{ id: `signal-${Date.now()}`, category: "identity", severity: "low", label: "Éléments complets", explanation: "Les éléments du parcours de démonstration sont présents." }];
      return { ...current, signals };
    });
  }, [updateCase]);

  const makeDecision = useCallback((caseId: string, decision: DecisionType, note: string) => {
    updateCase(caseId, (current) => ({
      ...current,
      decision: { type: decision, note, actor: "Responsable KYC", createdAt: new Date().toISOString() },
    }));
  }, [updateCase]);

  const value = useMemo<KycContextValue>(() => ({
    cases,
    isHydrated,
    createCase,
    markEvidenceCaptured,
    setConsent,
    submitCase,
    makeDecision,
    getCase: (caseId) => cases.find((caseData) => caseData.id === caseId),
    reviewCount: cases.filter((caseData) => caseData.status === "needs_review").length,
  }), [cases, createCase, isHydrated, makeDecision, markEvidenceCaptured, setConsent, submitCase]);

  return <KycContext.Provider value={value}>{children}</KycContext.Provider>;
}

export function useKyc() {
  const context = useContext(KycContext);
  if (!context) throw new Error("useKyc doit être utilisé dans KycProvider");
  return context;
}
