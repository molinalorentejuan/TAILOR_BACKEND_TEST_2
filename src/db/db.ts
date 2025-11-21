import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// En railway usamos carpeta fija y writable
const productionPath = "/app/data/restaurants.db";

// En local usamos ./src/db/restaurants.db
const localPath = path.join(__dirname, "restaurants.db");

// Elegimos ruta según entorno
const dbPath = process.env.NODE_ENV === "production" ? productionPath : localPath;

// Si estamos en production, aseguramos que /app/data existe
if (process.env.NODE_ENV === "production") {
  const dir = path.dirname(productionPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Creamos/abrimos la DB
const db = new Database(dbPath);

// Foreign keys ON
db.pragma("foreign_keys = ON");

// Añadir rating si no existe (no crashea)
try {
  db.exec(`ALTER TABLE restaurants ADD COLUMN rating REAL DEFAULT 0;`);
} catch {}

export default db;