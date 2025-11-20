import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const db = new Database("src/db/restaurants.db");
db.pragma("foreign_keys = ON");

// --- 2) AÑADIR COLUMNA
try {
  db.exec(`ALTER TABLE restaurants ADD COLUMN rating REAL DEFAULT 0;`);
  console.log("[DB] Column 'rating' added to restaurants");
} catch {
  // ya existe → no pasa nada
}

export default db;