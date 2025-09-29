import pool from "../db.js";

export async function findUserByUsername(username) {
  try {
    console.log("Searching for user:", username);
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    console.log("User search result:", result.rows);
    return result.rows[0];
  } catch (err) {
    console.error("Error in findUserByUsername:", err);
    throw err;
  }
}

export async function createUser(username, passwordHash) {
  try {
    console.log("Creating user:", username);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, passwordHash]
    );
    console.log("User created successfully:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  }
}