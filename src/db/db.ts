import Database from "better-sqlite3";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

// PRODUCTION → dist/db/restaurants.db (dentro de la imagen)
// LOCAL → dist/db/restaurants.db (lo copia el build script igual)
const dbPath = path.join(__dirname, "db", "restaurants.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

export default db;