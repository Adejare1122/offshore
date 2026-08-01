import { drizzle } from 'drizzle-orm/mysql2';
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from '../shared/schema';

dotenv.config();


// Configure the pool with better connection handling
export const pool = mysql.createPool({ 
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "booking-master",
});

export const db = drizzle({ connection:{uri: process.env.DATABASE_URL }, logger: true });


export const qdb = drizzle({ connection:{uri: process.env.DATABASE_URL }, schema, mode: 'default' });