import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

type TsRestResponse = { status: number; body: unknown };
type SuccessStatus = 200 | 201 | 202 | 204;
type SuccessResponse<T extends TsRestResponse> = Extract<
  T,
  { status: SuccessStatus }
>;

/**
 * Renders loading / error states for a ts-rest React Query result, the native
 * counterpart to the web template's <Wait>.
 *
 * Handles both network errors (React Query `isError`) and non-2xx responses
 * from ts-rest, which land in `data` rather than triggering `isError`.
 *
 *   const query = tsr.products.list.useQuery({ queryKey: ["products"] });
 *
 *   <QueryBoundary query={query}>
 *     {(data) => <ProductList products={data.body} />}
 *   </QueryBoundary>
 */
export function QueryBoundary<T extends TsRestResponse>({
  query,
  children,
}: {
  query: UseQueryResult<T, any>;
  children: (data: SuccessResponse<T>) => ReactNode;
}) {
  if (query.isError) return <Message text="Something went wrong." />;
  if (query.data === undefined) return <Loading />;
  if (query.data.status < 200 || query.data.status >= 300)
    return <Message text="Something went wrong." />;
  return <>{children(query.data as SuccessResponse<T>)}</>;
}

function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.muted} />
    </View>
  );
}

function Message({ text }: { text: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.message}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: 32, alignItems: "center", justifyContent: "center" },
  message: { color: colors.danger, fontSize: 15 },
});
