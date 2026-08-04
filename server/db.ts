import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from "../shared/schema";

dotenv.config();

// Most shared MySQL hosts (e.g. InterServer/DirectAdmin) do not have SSL
// configured, so SSL must be opt-in via DB_SSL=true, not opt-out.
const ssl = process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined;

// Serverless functions run many concurrent instances, each with its own pool.
// Keep per-instance pool size small so we don't exhaust the DB's max_connections.
const connectionLimit = process.env.VERCEL ? 3 : 10;

function createPoolConnection() {
  const connectionUri = process.env.DATABASE_URL;
  if (connectionUri) {
    return mysql.createPool({
      uri: connectionUri,
      ssl,
      waitForConnections: true,
      connectionLimit,
      queueLimit: 0,
    });
  }

  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "booking-master",
    port: Number(process.env.DB_PORT) || 3306,
    ssl,
    waitForConnections: true,
    connectionLimit,
    queueLimit: 0,
  });
}

export const pool = createPoolConnection();
export const db = drizzle(pool, { schema, mode: "default" });
export const qdb = db;