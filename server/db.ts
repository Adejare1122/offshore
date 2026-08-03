import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from "../shared/schema";

dotenv.config();

function createPoolConnection() {
  const connectionUri = process.env.DATABASE_URL;
  if (connectionUri) {
    return mysql.createPool({
      uri: connectionUri,
      ssl: process.env.DB_SSL === "false" ? undefined : { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "booking-master",
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export const pool = createPoolConnection();
export const db = drizzle(pool, { schema, mode: "default" });
export const qdb = db;