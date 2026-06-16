import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { tsr } from "@/api/client";
import { ProductForm } from "@/components/ProductForm";
import { QueryBoundary } from "@/components/QueryBoundary";
import { colors } from "@/components/theme";
import { formatPrice } from "@/lib/format";

export default function ProductsScreen() {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const query = tsr.products.list.useQuery({ queryKey: ["products"] });
  const tsrQueryClient = tsr.useQueryClient();

  const { mutate: createProduct } = tsr.products.create.useMutation({
    onSuccess: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["products"] });
      setAdding(false);
    },
  });

  const { mutate: deleteProduct } = tsr.products.delete.useMutation({
    onSuccess: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <View style={styles.container}>
      <QueryBoundary query={query}>
        {(data) => (
          <FlatList
            data={data.body}
            keyExtractor={(p) => String(p.id)}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={styles.headerArea}>
                {adding ? (
                  <ProductForm
                    submitLabel="Add"
                    onSubmit={(body) => createProduct({ body })}
                    onCancel={() => setAdding(false)}
                  />
                ) : (
                  <Pressable
                    style={({ pressed }) => [
                      styles.addRow,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setAdding(true)}
                  >
                    <Ionicons name="add" size={20} color={colors.muted} />
                    <Text style={styles.addText}>Add product</Text>
                  </Pressable>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Pressable
                  style={styles.rowInfo}
                  onPress={() =>
                    router.push({ pathname: "/product/[id]", params: { id: item.id } })
                  }
                >
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sku}>{item.sku}</Text>
                </Pressable>
                <Text style={styles.price}>
                  {formatPrice(item.price_cents)}
                </Text>
                <Pressable
                  hitSlop={8}
                  onPress={() => deleteProduct({ params: { id: item.id } })}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.subtle} />
                </Pressable>
              </View>
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
  headerArea: { marginBottom: 8 },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  addText: { color: colors.muted, fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  rowInfo: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: "500" },
  sku: { color: colors.subtle, fontSize: 13, marginTop: 2 },
  price: { color: colors.muted, fontSize: 14 },
  pressed: { opacity: 0.6 },
});
