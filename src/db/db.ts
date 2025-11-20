import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// ---------- RUTA CORRECTA PARA RAILWAY ----------
// Railway SOLO permite escritura en /data
const dbPath =
  process.env.NODE_ENV === "production"
    ? "/data/restaurants.db"
    : path.join(__dirname, "restaurants.db");

// Crear la carpeta si no existe (local o prod)
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Abrir DB
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

// Intentar añadir columna sólo si no existe
try {
  db.exec(`ALTER TABLE restaurants ADD COLUMN rating REAL DEFAULT 0;`);
} catch {}

export default db;