import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./src/db/schemas",
  dialect: "mysql",
  dbCredentials: {
    host: String(Bun.env.DB_HOST),
    password: String(Bun.env.DB_PASSWORD),
    database: String(Bun.env.DB_DATABASE),
    port: Number(Bun.env.DB_PORT),
    user: String(Bun.env.DB_USERNAME),
  },
  verbose: true,
} satisfies Config;
