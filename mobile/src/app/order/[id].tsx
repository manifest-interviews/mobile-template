import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { tsr } from "@/api/client";
import { QueryBoundary } from "@/components/QueryBoundary";
import { colors } from "@/components/theme";
import { formatPrice } from "@/lib/format";

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const query = tsr.orders.get.useQuery({
    queryKey: ["orders", orderId],
    queryData: { params: { id: orderId } },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <QueryBoundary query={query}>
        {(data) => {
          const order = data.body;
          const total = order.items.reduce(
            (sum, item) => sum + item.unit_price_cents * item.quantity,
            0,
          );

          return (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Order #{order.id}</Text>
                <Text style={styles.status}>{order.status}</Text>
              </View>
              <Text style={styles.date}>
                {new Date(order.created_at).toLocaleString()}
              </Text>

              <View style={styles.items}>
                {order.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {item.product_name}
                      <Text style={styles.itemQty}>  ×{item.quantity}</Text>
                    </Text>
                    <Text style={styles.itemPrice}>
                      {formatPrice(item.unit_price_cents * item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>
            </>
          );
        }}
      </QueryBoundary>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { color: colors.text, fontSize: 26, fontWeight: "700" },
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
  date: { color: colors.subtle, fontSize: 13, marginTop: 6, marginBottom: 20 },
  items: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemName: { color: colors.text, fontSize: 15, flex: 1 },
  itemQty: { color: colors.subtle },
  itemPrice: { color: colors.text, fontSize: 15 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  totalLabel: { color: colors.muted, fontSize: 18 },
  totalValue: { color: colors.text, fontSize: 22, fontWeight: "700" },
});
