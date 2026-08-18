import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#0B2F5B", tabBarInactiveTintColor: "#8493A6", tabBarButton: HapticTab, tabBarStyle: { paddingTop: 8, paddingBottom: bottomPadding, height: 57 + bottomPadding, backgroundColor: colors.background, borderTopColor: "#DFE7F0", borderTopWidth: 1 }, tabBarLabelStyle: { fontWeight: "700", fontSize: 11 } }}>
    <Tabs.Screen name="index" options={{ title: "Accueil", tabBarIcon: ({ color }) => <IconSymbol size={25} name="house.fill" color={color} /> }} />
    <Tabs.Screen name="reviews" options={{ title: "Revue", tabBarIcon: ({ color }) => <IconSymbol size={25} name="checklist" color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: "Réglages", tabBarIcon: ({ color }) => <IconSymbol size={25} name="gearshape.fill" color={color} /> }} />
  </Tabs>;
}
