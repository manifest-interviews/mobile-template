// Root contract — aggregates all resource contracts into one object.
// Both the server (for handler validation) and client (for React Query hooks)
// import from here. To add a new resource, register its contract below.

import { initContract } from "@ts-rest/core";
import { productsContract } from "./contracts/products";
import { ordersContract } from "./contracts/orders";

const c = initContract();

export const contract = c.router({
  // Register new contracts here:
  products: productsContract,
  orders: ordersContract,
});