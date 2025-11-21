import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const isProd = process.env.NODE_ENV === "production";

const dbPath = isProd
  ? "/app/data/restaurants.db"
  : path.join(__dirname, "restaurants.db");

// En producción aseguramos que /app/data existe
if (isProd) {
  const dir = "/app/data";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

export default db;