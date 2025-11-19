// db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || "db",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  ssl: false,
});

pool
  .query("SELECT current_database() AS db, current_user AS user")
  .then((res) => console.log("✅ Connected to:", res.rows[0]))
  .catch((err) => console.error("❌ DB connection failed:", err));

export default pool;
