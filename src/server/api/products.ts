import { tsr } from "@ts-rest/serverless/fetch";
import { productsContract } from "../../shared/contracts/products";
import type { Product } from "../../shared/contracts/products";
import { sql } from "../db";

export const productsRouter = tsr.router(productsContract, {
  list: async () => {
    const products = await sql<Product[]>`
      SELECT * FROM products ORDER BY name
    `;

    return { status: 200, body: products };
  },

  lookupByBarcode: async ({ params }) => {
    const [product] = await sql<Product[]>`
      SELECT * FROM products WHERE barcode = ${params.barcode}
    `;

    if (!product)
      return {
        status: 404,
        body: { message: "No product with that barcode" },
      };

    return { status: 200, body: product };
  },

  get: async ({ params }) => {
    const [product] = await sql<Product[]>`
      SELECT * FROM products WHERE id = ${params.id}
    `;

    if (!product)
      return { status: 404, body: { message: "Product not found" } };

    return { status: 200, body: product };
  },

  create: async ({ body }) => {
    const [product] = await sql<Product[]>`
      INSERT INTO products (name, sku, barcode, price_cents)
      VALUES (${body.name}, ${body.sku}, ${body.barcode ?? null}, ${body.price_cents})
      RETURNING *
    `;

    return { status: 201, body: product! };
  },

  update: async ({ params, body }) => {
    const [existing] = await sql<Product[]>`
      SELECT * FROM products WHERE id = ${params.id}
    `;

    if (!existing)
      return { status: 404, body: { message: "Product not found" } };

    const [product] = await sql<Product[]>`
      UPDATE products SET
        name = ${body.name ?? existing.name},
        sku = ${body.sku ?? existing.sku},
        barcode = ${body.barcode === undefined ? existing.barcode : body.barcode},
        price_cents = ${body.price_cents ?? existing.price_cents}
      WHERE id = ${params.id}
      RETURNING *
    `;

    return { status: 200, body: product! };
  },

  delete: async ({ params }) => {
    await sql`DELETE FROM products WHERE id = ${params.id}`;

    return { status: 204, body: undefined };
  },
});
