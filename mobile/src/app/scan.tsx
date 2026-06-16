import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "@/api/client";
import { Button } from "@/components/Button";
import { colors } from "@/components/theme";
import { useCart } from "@/state/cart";

type Banner = { text: string; tone: "ok" | "err" };

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const [permission, requestPermission] = useCameraPermissions();

  const [banner, setBanner] = useState<Banner | null>(null);
  const [added, setAdded] = useState(0);
  // Ref (not state) so the rapid-fire scan callback always sees the latest
  // value without waiting for a re-render.
  const locked = useRef(false);

  const handleScan = useCallback(
    async ({ data }: { data: string }) => {
      if (locked.current) return;
      locked.current = true;

      try {
        const res = await api.products.lookupByBarcode({
          params: { barcode: data },
        });
        if (res.status === 200) {
          addItem(res.body.id);
          setAdded((n) => n + 1);
          setBanner({ text: `Added ${res.body.name}`, tone: "ok" });
        } else {
          setBanner({ text: `No product for ${data}`, tone: "err" });
        }
      } catch {
        setBanner({ text: "Couldn't reach the server", tone: "err" });
      }

      // Brief cooldown so one barcode isn't added repeatedly while it stays
      // in frame, then re-arm the scanner.
      setTimeout(() => {
        locked.current = false;
        setBanner(null);
      }, 1500);
    },
    [addItem],
  );

  if (!permission) {
    return <View style={styles.fill} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.fill, styles.permission]}>
        <Ionicons name="camera-outline" size={48} color={colors.muted} />
        <Text style={styles.permissionText}>
          Camera access is needed to scan barcodes.
        </Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "qr"],
        }}
        onBarcodeScanned={handleScan}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
          {banner ? (
            <View
              style={[
                styles.banner,
                banner.tone === "ok" ? styles.bannerOk : styles.bannerErr,
              ]}
            >
              <Text style={styles.bannerText}>{banner.text}</Text>
            </View>
          ) : (
            <Text style={styles.hint}>Point the camera at a barcode</Text>
          )}
        </View>

        <View style={styles.frame} />

        <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            title={added > 0 ? `Done · ${added} added` : "Done"}
            onPress={() => router.back()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#000" },
  permission: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
    backgroundColor: colors.bg,
  },
  permissionText: {
    color: colors.muted,
    fontSize: 16,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  top: { width: "100%", alignItems: "center", paddingHorizontal: 24 },
  hint: {
    color: "#fff",
    fontSize: 15,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bannerOk: { backgroundColor: colors.success },
  bannerErr: { backgroundColor: colors.danger },
  bannerText: { color: "#000", fontSize: 15, fontWeight: "600" },
  frame: {
    width: 250,
    height: 160,
    borderColor: "rgba(255,255,255,0.9)",
    borderWidth: 3,
    borderRadius: 16,
  },
  bottom: { width: "100%", paddingHorizontal: 24 },
});
