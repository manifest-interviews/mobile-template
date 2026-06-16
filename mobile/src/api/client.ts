// Two views of the same shared ts-rest contract, both pointed at the backend:
//
//   tsr — React Query hooks, generated from the contract. This is the main one.
//     tsr.products.list.useQuery({ queryKey: ["products"] })
//     tsr.products.create.useMutation()
//
//   api — a plain promise client for one-off imperative calls (e.g. looking up
//     a product right after the camera scans its barcode).
//     await api.products.lookupByBarcode({ params: { barcode } })
//
// The contract is imported from the backend (../src/shared) — single source of
// truth, see metro.config.js and the "@shared" path in tsconfig.json.

import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { initClient } from "@ts-rest/core";
import { contract } from "@/shared/contract";
import { API_URL } from "./config";

export const tsr = initTsrReactQuery(contract, { baseUrl: API_URL });

export const api = initClient(contract, { baseUrl: API_URL });
