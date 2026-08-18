import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { KycProvider } from "@/lib/kyc-store";
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout() {
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><KycProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}><Stack.Screen name="(tabs)" /><Stack.Screen name="cases/new" options={{ presentation: "card" }} /><Stack.Screen name="cases/[id]" options={{ presentation: "card" }} /><Stack.Screen name="capture" options={{ presentation: "modal" }} /></Stack></KycProvider></ThemeProvider></SafeAreaProvider></GestureHandlerRootView>;
}
