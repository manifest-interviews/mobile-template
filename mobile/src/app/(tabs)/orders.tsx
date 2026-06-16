import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { tsr } from "@/api/client";
import { QueryBoundary } from "@/components/QueryBoundary";
import { colors } from "@/components/theme";

export default function OrdersScreen() {
  const router = useRouter();
  const query = tsr.orders.list.useQuery({ queryKey: ["orders"] });

  return (
    <View style={styles.container}>
      <QueryBoundary query={query}>
        {(data) => (
          <FlatList
            data={data.body}
            keyExtractor={(o) => String(o.id)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={() =>
                  router.push({ pathname: "/order/[id]", params: { id: item.id } })
                }
              >
                <View>
                  <Text style={styles.orderId}>Order #{item.id}</Text>
                  <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.status}>{item.status}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.subtle}
                  />
                </View>
              </Pressable>
            )}
          />
        )}
      </QueryBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, gap: 8 },
  empty: { color: colors.subtle, textAlign: "center", paddingVertical: 32 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  pressed: { opacity: 0.7 },
  orderId: { color: colors.text, fontSize: 16, fontWeight: "600" },
  date: { color: colors.subtle, fontSize: 13, marginTop: 3 },
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  status: {
    color: colors.muted,
    fontSize: 12,
    textTransform: "capitalize",
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
});
