import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { tsr } from "@/api/client";
import { CartProvider } from "@/state/cart";
import { colors } from "@/components/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <tsr.ReactQueryProvider>
          <CartProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.text,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="product/[id]" options={{ title: "Product" }} />
              <Stack.Screen name="order/[id]" options={{ title: "Order" }} />
              <Stack.Screen
                name="scan"
                options={{ presentation: "modal", title: "Scan barcode" }}
              />
            </Stack>
          </CartProvider>
        </tsr.ReactQueryProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
