import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors } from "./theme";

type Variant = "primary" | "secondary" | "icon";

type ButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = "primary",
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, variant === "primary" && styles.labelPrimary]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primary: { backgroundColor: colors.text },
  secondary: { backgroundColor: colors.surfaceAlt },
  icon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: colors.surfaceAlt,
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  label: { color: colors.text, fontSize: 16, fontWeight: "600" },
  labelPrimary: { color: colors.bg },
});
