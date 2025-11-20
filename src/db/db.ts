import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "restaurants.db");

const db = new Database(dbPath); //  script del build copia el archivo aquí: dist/db/restaurants.db

db.pragma("foreign_keys = ON");

try {
  db.exec(`ALTER TABLE restaurants ADD COLUMN rating REAL DEFAULT 0;`);
} catch {}

export default db;