import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const isProd = process.env.NODE_ENV === "production";

// Producción → /app/data/restaurants.db
// Local → dist/db/restaurants.db
const dbPath = isProd
  ? "/app/data/restaurants.db"
  : path.join(__dirname, "db", "restaurants.db");

// En producción aseguramos que el directorio existe
if (isProd) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

export default db;