import pkg from "pg";
const { Pool } = pkg;
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'db', // Docker service name
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  ssl: false,
});

// Debug connection
pool
  .query("SELECT current_database() as db, current_user as user")
  .then((res) => console.log("✅ Connected to:", res.rows[0]))
  .catch((err) => console.error("❌ DB connection failed:", err));

export default pool;
