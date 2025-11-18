import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schemas";

const poolConnection = mysql.createPool({
  host: Bun.env.DB_HOST,
  port: Bun.env.DB_PORT,
  user: Bun.env.DB_USERNAME,
  password: Bun.env.DB_PASSWORD,
  database: Bun.env.DB_DATABASE,
});

export const db = drizzle({
  schema,
  client: poolConnection,
  mode: "default",
  // logger: true,
});
