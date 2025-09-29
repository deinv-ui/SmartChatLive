import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required by Render's Postgres
  },
});

// Debug connection
pool
  .query("SELECT current_database() as db, current_user as user")
  .then((res) => console.log("✅ Connected to:", res.rows[0]))
  .catch((err) => console.error("❌ DB connection failed:", err));

export default pool;
