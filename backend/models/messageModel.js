import pool from "../db.js";

export async function saveMessage(email, content, timestamp = null) {
  const res = await pool.query(
    `INSERT INTO message (sender_email, content, created_at) VALUE ($1,$2,$3) RETURNING *`,
    [email, content, timestamp || new Date()]
  );
  return res.rows[0];
}

export async function getAllMessages() {
  const res = pool.query(`SELECT * FROM messages ORDER BY created_at ASC`);
  return res.rows[0];
}
