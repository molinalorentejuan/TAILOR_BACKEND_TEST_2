import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Ruta real en producción (dist/db/restaurants.db)
const dbPath = path.join(__dirname, "restaurants.db");

// Si no existe la carpeta dist/db en producción, la creamos
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Abrimos la base de datos *en dist*
const db = new Database(dbPath);

// Foreign keys ON
db.pragma("foreign_keys = ON");

// Intentamos añadir rating si no existe
try {
  db.exec(`ALTER TABLE restaurants ADD COLUMN rating REAL DEFAULT 0;`);
} catch {}

export default db;