import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { KycProvider } from "@/lib/kyc-store";
import { ThemeProvider } from "@/lib/theme-provider";
import { TrpcProvider } from "@/lib/trpc-provider";

export default function RootLayout() {
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><TrpcProvider><KycProvider><StatusBar style="auto" /><Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}><Stack.Screen name="(tabs)" /><Stack.Screen name="cases/new" options={{ presentation: "card" }} /><Stack.Screen name="cases/[id]" options={{ presentation: "card" }} /><Stack.Screen name="client/new" options={{ presentation: "card" }} /><Stack.Screen name="client/[id]" options={{ presentation: "card" }} /><Stack.Screen name="operations/[id]" options={{ presentation: "card" }} /><Stack.Screen name="admin/team" options={{ presentation: "card" }} /><Stack.Screen name="capture" options={{ presentation: "modal" }} /></Stack></KycProvider></TrpcProvider></ThemeProvider></SafeAreaProvider></GestureHandlerRootView>;
}
