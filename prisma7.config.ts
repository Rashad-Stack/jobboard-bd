import { defineConfig } from "prisma/config";

const migrationUrl = new URL(process.env.DATABASE_URL ?? "postgresql://localhost:5432/postgres");
migrationUrl.port = "5432";
migrationUrl.searchParams.delete("pgbouncer");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    // Supabase's transaction pooler (port 6543) can block Prisma migration
    // locks. Use the same credentials through the direct port for CLI operations.
    url: migrationUrl.toString(),
  },
});
