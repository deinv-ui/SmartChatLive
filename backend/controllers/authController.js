import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/userModel.js";

/**
 * Register a new user
 * Only email and password are required
 */
export async function register(req, res) {
  try {
    const { email, password, user_type } = req.body;
    console.log("Register request body:", req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser(email, hashedPassword, user_type);

    // Return user without password
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      user_type: user.user_type,
      created_at: user.created_at,
    };

    res.status(201).json({ message: "User registered successfully", user: userResponse });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

/**
 * Login a user
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Login request body:", req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
