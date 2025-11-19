import pool from "../db.js";

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  try {
    console.log("Searching for user:", email);
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    console.log("User search result:", result.rows);
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error in findUserByEmail:", err);
    throw err;
  }
}

async function generateUniqueUsername(base) {
  let username = base;
  let exists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  while (exists.rows.length > 0) {
    username = `${base}${Math.floor(Math.random() * 10000)}`;
    exists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  }
  return username;
}

/**
 * Create a new user
 * Username is auto-generated from email
 * user_type defaults to 'user'
 */
export async function createUser(email, password, user_type = "user") {
  const baseUsername = email.split("@")[0];
  const username = await generateUniqueUsername(baseUsername);

  const result = await pool.query(
    "INSERT INTO users (username, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, password, user_type]
  );

  return result.rows[0];
}
