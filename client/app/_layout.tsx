


// =======================
// Imports
// =======================
import { Slot, Stack, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { authStore } from "@/stores/authStore";
import "../global.css";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toastConfig from "../toastConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// =======================
// Query Client
// =======================
export const queryClient = new QueryClient();

// =======================
// Loading Fallback Component
// =======================
const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

// =======================
// Root Layout Component
// =======================
export default function RootLayout() {
  const router = useRouter();
  const {
    authUser,
    isCheckingAuth,
    checkHealth,
    socketConnect,
    disconnectSocket,
    onlineUsers,
  } = authStore();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    ...FontAwesome.font,
...MaterialIcons.font,
...Ionicons.font,
...FontAwesome6.font,
...FontAwesome6.font,
...MaterialCommunityIcons.font,
  });

  console.log("onlineUsers", onlineUsers);
  console.log("authUser", authUser?._id);

  // =======================
  // Effects
  // =======================
  useEffect(() => {
    checkHealth();
    socketConnect();
    return () => {
      disconnectSocket();
    };
  }, [checkHealth, socketConnect, disconnectSocket]);

  useEffect(() => {
    if (!isCheckingAuth && fontsLoaded) {
      if (authUser) {
        router.replace("/main");
      } else {
        router.replace("/");
      }
    }
  }, [authUser, fontsLoaded]);

  // =======================
  // Conditional Rendering
  // =======================
  if (isCheckingAuth || !fontsLoaded) {
    return <LoadingFallback />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Slot />
        </Stack>
      </SafeAreaView>
      <Toast  />
    </QueryClientProvider>
  );
}