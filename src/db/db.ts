import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Si estamos en producción (Docker/Railway):
const IS_PROD = process.env.NODE_ENV === "production";

const dbPath = IS_PROD
  ? "/app/data/restaurants.db"
  : path.join(__dirname, "restaurants.db");

// ⚠️ Solo crear carpetas en desarrollo
if (!IS_PROD) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

try {
  db.exec(`ALTER TABLE restaurants ADD COLUMN rating REAL DEFAULT 0;`);
} catch {}

export default db;