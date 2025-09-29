import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";  
import { findUserByUsername, createUser } from "../models/userModel.js";

export async function register(req, res) {
  try {
    console.log("=== REGISTRATION START ===");
    const { username, password } = req.body;
    console.log("Request body:", req.body);
    console.log("Register attempt - Username:", username, "Password:", password ? "provided" : "missing");

    if (!username || !password) {
      console.log("❌ Missing username or password");
      return res.status(400).json({ error: "Username and password required" });
    }

    console.log("🔍 Checking for existing user...");
    const existingUser = await findUserByUsername(username);
    console.log("Existing user check result:", existingUser);
    
    if (existingUser) {
      console.log("❌ User already exists:", username);
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("🔐 Hashing password...");
    const hashed = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");
    
    console.log("💾 Creating user in database...");
    const user = await createUser(username, hashed);
    console.log("✅ User created in database:", user);

    // Return user without password hash for security
    const userResponse = {
      id: user.id,
      username: user.username,
      created_at: user.created_at
    };
    
    console.log("=== REGISTRATION SUCCESS ===");
    res.status(201).json({ message: "User registered successfully", user: userResponse });
  } catch (err) {
    console.error("❌ REGISTRATION ERROR:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
