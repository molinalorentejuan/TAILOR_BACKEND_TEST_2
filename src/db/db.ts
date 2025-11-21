import Database from "better-sqlite3";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

// Railway → DB en /app/data/restaurants.db (la copia Docker)
// Local → dist/db/restaurants.db (la copia el script del build)
const dbPath = isProd
  ? "/app/data/restaurants.db"
  : path.join(__dirname, "restaurants.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

export default db;