import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST || "db", // "db" from docker-compose service name
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});
pool
  .query("SELECT current_database() as db, current_user as user")
  .then((res) => console.log("✅ Connected to:", res.rows[0]))
  .catch((err) => console.error("❌ DB connection failed:", err));

export default pool;
