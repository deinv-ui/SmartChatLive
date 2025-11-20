import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import  { initSocket } from "./src/socket.js"
import { connectProducer } from "./src/kafka/producer.js";
import { connectConsumer } from "./src/kafka/consumer.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

// Load environment variables FIRST
dotenv.config();

console.log("=== ENVIRONMENT VARIABLES ===");
console.log("BACKEND_PORT:", process.env.BACKEND_PORT);
console.log("POSTGRES_USER:", process.env.POSTGRES_USER);
console.log(
  "All env vars:",
  Object.keys(process.env).filter((key) => key.includes("PORT"))
);
console.log("=============================");

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

const server = http.createServer(app);
const io = initSocket(server);
// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend running!!" });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
