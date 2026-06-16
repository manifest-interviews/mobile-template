import { SQL } from "bun";
// Imported as text so `bun --watch` restarts the server when schema.sql changes.
import schema from "./schema.sql" with { type: "text" };

/**
 * SQLite database connection using Bun's built-in SQL client.
 * Use as a tagged template literal:
 * ```
 * await sql<Row[]>`SELECT * FROM ...`
 * ```
 * @see https://bun.com/docs/runtime/sql
 */
export const sql = new SQL("sqlite://data.db");

await sql`PRAGMA journal_mode = WAL`;
await sql`PRAGMA foreign_keys = ON`;

// Auto-recreate tables when the schema changes (for development convenience).
// Edit schema.sql and the server will drop and rebuild tables on restart.
const hash = new Bun.CryptoHasher("md5").update(schema).digest("hex");

await sql`CREATE TABLE IF NOT EXISTS _meta (key TEXT PRIMARY KEY, value TEXT)`;
const [prev] = await sql`SELECT value FROM _meta WHERE key = 'schema_hash'`;

if (prev?.value !== hash) {
  // Drop all user tables and recreate
  await sql`PRAGMA foreign_keys = OFF`;
  const tables =
    await sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_meta' AND name NOT LIKE 'sqlite_%'`;
  for (const { name } of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS "${name}"`);
  }
  // Strip `--` comments before executing. Bun's multi-statement splitter treats
  // apostrophes inside comments (e.g. "isn't", 'pending') as string delimiters
  // and silently drops every statement after them. We still hash the raw file
  // above for change detection — only execution uses the comment-free version.
  await sql.unsafe(schema.replace(/--[^\n]*/g, ""));
  await sql`PRAGMA foreign_keys = ON`;
  await sql`INSERT OR REPLACE INTO _meta (key, value) VALUES ('schema_hash', ${hash})`;
  console.log("Schema changed — recreated and seeded database.");
}
