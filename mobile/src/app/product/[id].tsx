import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { tsr } from "@/api/client";
import { Button } from "@/components/Button";
import { ProductForm } from "@/components/ProductForm";
import { QueryBoundary } from "@/components/QueryBoundary";
import { colors } from "@/components/theme";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/shared/contracts/products";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const query = tsr.products.get.useQuery({
    queryKey: ["products", productId],
    queryData: { params: { id: productId } },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <QueryBoundary query={query}>
        {(data) => <ProductDetail product={data.body} productId={productId} />}
      </QueryBoundary>
    </ScrollView>
  );
}

function ProductDetail({
  product,
  productId,
}: {
  product: Product;
  productId: number;
}) {
  const [editing, setEditing] = useState(false);
  const tsrQueryClient = tsr.useQueryClient();

  const { mutate: updateProduct } = tsr.products.update.useMutation({
    onSuccess: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["products"] });
      setEditing(false);
    },
  });

  if (editing) {
    return (
      <ProductForm
        initialValues={product}
        submitLabel="Save"
        onSubmit={(body) => updateProduct({ params: { id: productId }, body })}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <View style={styles.detail}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{formatPrice(product.price_cents)}</Text>

      <View style={styles.meta}>
        <MetaRow label="SKU" value={product.sku} />
        <MetaRow label="Barcode" value={product.barcode ?? "—"} />
        <MetaRow
          label="Added"
          value={new Date(product.created_at).toLocaleDateString()}
        />
      </View>

      <Button
        title="Edit"
        variant="secondary"
        onPress={() => setEditing(true)}
      />
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16 },
  detail: { gap: 16 },
  name: { color: colors.text, fontSize: 28, fontWeight: "700" },
  price: { color: colors.muted, fontSize: 20, marginTop: -8 },
  meta: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  metaLabel: { color: colors.subtle, fontSize: 15 },
  metaValue: { color: colors.text, fontSize: 15 },
});
