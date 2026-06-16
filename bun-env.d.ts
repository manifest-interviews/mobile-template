// Allow importing schema.sql as a string (see src/server/db.ts).

declare module "*.sql" {
  const contents: string;
  export default contents;
}
