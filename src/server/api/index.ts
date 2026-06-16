// Root router — wires each resource's handlers to the contract.
// To add a new resource, import its router and register it below.

import { tsr } from "@ts-rest/serverless/fetch";
import { contract } from "../../shared/contract";
import { productsRouter } from "./products";
import { ordersRouter } from "./orders";

export const router = tsr.router(contract, {
  // Register additional routers here:
  products: productsRouter,
  orders: ordersRouter,
});
