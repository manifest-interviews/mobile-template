import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  sku: z.string(),
  // The barcode printed on the item, scanned by the mobile camera. Null for
  // items without one (e.g. made-to-order drinks).
  barcode: z.string().nullable(),
  price_cents: z.number(),
  created_at: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const productsContract = c.router({
  list: {
    method: "GET",
    path: "/api/products",
    responses: {
      200: z.array(ProductSchema),
    },
  },
  // Look up a single product by its scanned barcode. The mobile app calls this
  // after the camera reads a code. Registered before `get` so the extra path
  // segment never collides with `/api/products/:id`.
  lookupByBarcode: {
    method: "GET",
    path: "/api/products/by-barcode/:barcode",
    pathParams: z.object({
      barcode: z.string(),
    }),
    responses: {
      200: ProductSchema,
      404: z.object({ message: z.string() }),
    },
  },
  get: {
    method: "GET",
    path: "/api/products/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      200: ProductSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: "POST",
    path: "/api/products",
    body: z.object({
      name: z.string(),
      sku: z.string(),
      barcode: z.string().nullable().optional(),
      price_cents: z.number(),
    }),
    responses: {
      201: ProductSchema,
    },
  },
  update: {
    method: "PATCH",
    path: "/api/products/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    body: z.object({
      name: z.string().optional(),
      sku: z.string().optional(),
      barcode: z.string().nullable().optional(),
      price_cents: z.number().optional(),
    }),
    responses: {
      200: ProductSchema,
      404: z.object({ message: z.string() }),
    },
  },
  delete: {
    method: "DELETE",
    path: "/api/products/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});
