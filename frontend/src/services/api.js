// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchMessage() {
  const res = await fetch(`${API_URL}/`);
  return res.json();
}
