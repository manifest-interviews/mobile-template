import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tsr } from "@/api/client";
import { Button } from "@/components/Button";
import { QueryBoundary } from "@/components/QueryBoundary";
import { colors } from "@/components/theme";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/state/cart";
import type { Product } from "@/shared/contracts/products";

export default function NewOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const query = tsr.products.list.useQuery({ queryKey: ["products"] });
  const { cart, addItem, removeItem, clear, totalItems } = useCart();
  const tsrQueryClient = tsr.useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: createOrder, isPending } = tsr.orders.create.useMutation({
    onSuccess: (data) => {
      if (data.status === 201) {
        clear();
        setError(null);
        tsrQueryClient.invalidateQueries({ queryKey: ["orders"] });
        router.push({ pathname: "/order/[id]", params: { id: data.body.id } });
      } else {
        setError("Something went wrong placing the order.");
      }
    },
    onError: () => setError("Server error."),
  });

  return (
    <View style={styles.container}>
      <QueryBoundary query={query}>
        {(data) => {
          const products = new Map(data.body.map((p) => [p.id, p]));
          const total = [...cart.entries()].reduce((sum, [id, qty]) => {
            const p = products.get(id);
            return sum + (p ? p.price_cents * qty : 0);
          }, 0);

          return (
            <>
              <FlatList
                data={data.body}
                keyExtractor={(p) => String(p.id)}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                  <Pressable
                    style={({ pressed }) => [
                      styles.scanButton,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => router.push("/scan")}
                  >
                    <Ionicons
                      name="barcode-outline"
                      size={22}
                      color={colors.text}
                    />
                    <Text style={styles.scanText}>Scan barcode</Text>
                  </Pressable>
                }
                renderItem={({ item }) => (
                  <ProductRow
                    product={item}
                    qty={cart.get(item.id) ?? 0}
                    onAdd={() => addItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                )}
              />

              {totalItems > 0 && (
                <View
                  style={[
                    styles.cartBar,
                    { paddingBottom: insets.bottom + 12 },
                  ]}
                >
                  <View style={styles.cartTotals}>
                    <Text style={styles.cartCount}>
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </Text>
                    <Text style={styles.cartTotal}>{formatPrice(total)}</Text>
                  </View>
                  {error && <Text style={styles.error}>{error}</Text>}
                  <Button
                    title={isPending ? "Placing…" : "Place Order"}
                    disabled={isPending}
                    onPress={() =>
                      createOrder({
                        body: {
                          items: [...cart.entries()].map(
                            ([productId, quantity]) => ({
                              productId,
                              quantity,
                            }),
                          ),
                        },
                      })
                    }
                  />
                </View>
              )}
            </>
          );
        }}
      </QueryBoundary>
    </View>
  );
}

function ProductRow({
  product,
  qty,
  onAdd,
  onRemove,
}: {
  product: Product;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price_cents)}</Text>
      </View>
      <View style={styles.stepper}>
        {qty > 0 && (
          <>
            <StepperButton icon="remove" onPress={onRemove} />
            <Text style={styles.qty}>{qty}</Text>
          </>
        )}
        <StepperButton icon="add" onPress={onAdd} />
      </View>
    </View>
  );
}

function StepperButton({
  icon,
  onPress,
}: {
  icon: "add" | "remove";
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}
      hitSlop={6}
    >
      <Ionicons name={icon} size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, gap: 8 },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 8,
  },
  scanText: { color: colors.text, fontSize: 16, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  rowInfo: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: "500" },
  price: { color: colors.muted, fontSize: 14, marginTop: 2 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: { color: colors.text, fontSize: 16, minWidth: 22, textAlign: "center" },
  pressed: { opacity: 0.6 },
  cartBar: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  cartTotals: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartCount: { color: colors.muted, fontSize: 14 },
  cartTotal: { color: colors.text, fontSize: 20, fontWeight: "700" },
  error: { color: colors.danger, fontSize: 14 },
});
