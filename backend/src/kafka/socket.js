// src/socket.js
import { Server as IOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { sendMessage as produceMessage, producer } from "./kafka/producer.js"; // ensure producer exports these
import { consumer } from "./kafka/consumer.js"; // ensure consumer instance is exported
import { saveMessage } from "./models/messageModel.js";

let io = null;
let consumerStarted = false;

/**
 * Initialize Socket.IO and start the Kafka consumer -> broadcast loop.
 * Call this once during server startup and await it.
 */
export async function initSocket(server) {
  if (io) return io; // already initialized

  io = new IOServer(server, {
    cors: { origin: process.env.SOCKET_ORIGIN || "*" }, // restrict in prod
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.user = { id: payload.id, email: payload.email };
      } catch (err) {
        console.warn("Invalid JWT on socket connect:", err.message);
        // optional: socket.disconnect(true)
      }
    }

    socket.on("chat:send", async (payload) => {
      try {
        const user = socket.data.user;
        const email = user?.email || payload?.email;
        const content = (payload && payload.content) ? String(payload.content).trim() : "";

        if (!email || !content) {
          return socket.emit("chat:error", { message: "Invalid payload" });
        }

        // Basic rate/length validation (tunable)
        if (content.length > 2000) {
          return socket.emit("chat:error", { message: "Message too long" });
        }

        const msg = {
          email,
          content,
          timestamp: new Date().toISOString(),
        };

        // produce to Kafka (producer should be connected on server startup)
        await produceMessage(process.env.KAFKA_TOPIC || "chat-topic", msg);

        // optimistic ack to sender
        socket.emit("chat:sent", msg);
      } catch (err) {
        console.error("Failed to produce message to Kafka:", err);
        socket.emit("chat:error", { message: "Failed to queue message" });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, reason);
    });
  });

  // Start the Kafka consumer that listens for messages and broadcasts them
  await startConsumerBroadcast();
  return io;
}

/** Start Kafka consumer (only once) and broadcast consumed messages via io.emit */
async function startConsumerBroadcast() {
  if (consumerStarted) {
    console.log("Kafka consumer broadcast already started");
    return;
  }

  const topic = process.env.KAFKA_TOPIC || "chat-topic";

  try {
    // connect and subscribe if not connected
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const value = message.value?.toString();
          if (!value) return;
          const data = JSON.parse(value);

          // persist in DB (consumer is the correct place to persist)
          try {
            await saveMessage(data.email, data.content, data.timestamp);
          } catch (dbErr) {
            console.error("Failed to save message to DB:", dbErr);
          }

          // broadcast to sockets (optionally implement rooms)
          if (io) {
            io.emit("chat:message", data);
          }
        } catch (err) {
          console.error("Error handling Kafka message:", err);
        }
      },
    });

    consumerStarted = true;
    console.log("Kafka consumer broadcast started on topic:", topic);
  } catch (err) {
    console.error("Failed to start Kafka consumer broadcast:", err);
    throw err;
  }
}

/** Graceful shutdown helpers */
export async function shutdownSocketsAndKafka() {
  try {
    if (io) {
      io.close(); // stops accepting new connections and closes sockets
      io = null;
    }
    if (consumer) {
      try { await consumer.disconnect(); } catch (e) { console.warn("consumer disconnect error", e); }
    }
    if (producer) {
      try { await producer.disconnect(); } catch (e) { console.warn("producer disconnect error", e); }
    }
    console.log("Socket.IO and Kafka disconnected gracefully");
  } catch (err) {
    console.error("Error during shutdown:", err);
  }
}

export { io };
