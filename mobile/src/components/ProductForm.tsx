import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "./Button";
import { colors } from "./theme";
import { parsePriceToCents } from "@/lib/format";

export interface ProductFormValues {
  name: string;
  sku: string;
  barcode: string | null;
  price_cents: number;
}

export function ProductForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialValues?: Partial<ProductFormValues>;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [sku, setSku] = useState(initialValues?.sku ?? "");
  const [barcode, setBarcode] = useState(initialValues?.barcode ?? "");
  const [price, setPrice] = useState(
    initialValues?.price_cents !== undefined
      ? (initialValues.price_cents / 100).toFixed(2)
      : "",
  );

  const submit = () => {
    const cents = parsePriceToCents(price);
    if (!name.trim() || !sku.trim() || isNaN(cents)) return;
    onSubmit({
      name: name.trim(),
      sku: sku.trim(),
      barcode: barcode.trim() || null,
      price_cents: cents,
    });
  };

  return (
    <View style={styles.form}>
      <Field label="Name" value={name} onChangeText={setName} />
      <Field label="SKU" value={sku} onChangeText={setSku} autoCapitalize="none" />
      <Field
        label="Barcode"
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
      />
      <Field
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />
      <View style={styles.actions}>
        <Button title={submitLabel} onPress={submit} />
        {onCancel && (
          <Button title="Cancel" variant="secondary" onPress={onCancel} />
        )}
      </View>
    </View>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.subtle}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  label: { color: colors.muted, fontSize: 13, marginBottom: 4 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actions: { flexDirection: "row", gap: 8, marginTop: 4 },
});
