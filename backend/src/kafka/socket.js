// src/socket.js
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { sendMessage } from "./kafka/producer.js"; // your existing producer helper
import { consumer } from "./kafka/consumer.js"; // export consumer instance from your consumer module
import { saveMessage } from "./models/messageModel.js"; // saves to postgres

let io; // exportable socket instance

export function initSocket(server) {
  io = new SocketIOServer(server, {
    cors: { origin: "*" } // tighten in production
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Optional: if client sends token in handshake query, verify and attach user
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.user = { id: payload.id, email: payload.email };
      } catch (err) {
        console.warn("Invalid JWT on socket connect:", err.message);
        // you can disconnect if required:
        // socket.disconnect(true);
      }
    }

    // Client sends chat messages via socket -> produce to Kafka
    socket.on("chat:send", async (payload) => {
      // payload: { content }
      const user = socket.data.user;
      const email = user?.email || payload.email; // fallback if not authenticated via token
      if (!email || !payload?.content) {
        return socket.emit("chat:error", { message: "Invalid payload" });
      }

      const msg = {
        email,
        content: payload.content,
        timestamp: new Date().toISOString(),
      };

      try {
        // produce to Kafka
        await sendMessage(msg);
        // optionally acknowledge sender that message is queued
        socket.emit("chat:sent", msg);
      } catch (err) {
        console.error("Failed to send to Kafka:", err);
        socket.emit("chat:error", { message: "Failed to queue message" });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, reason);
    });
  });

  // Start consumer run separately and make it broadcast on kafka message
  startConsumerBroadcast();
  return io;
}

// Broadcast messages consumed from Kafka to all connected clients
async function startConsumerBroadcast() {
  // assume your consumer has been created as in earlier steps, exported as `consumer`
  await consumer.connect();
  await consumer.subscribe({ topic: "chat-topic", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const value = message.value?.toString();
        if (!value) return;
        const data = JSON.parse(value);

        // save to DB (persist permanently)
        try {
          await saveMessage(data.email, data.content, data.timestamp);
        } catch (dbErr) {
          console.error("Failed to save message to DB:", dbErr);
        }

        // emit to all sockets (you could emit to a room for channels)
        if (io) {
          io.emit("chat:message", data);
        }
      } catch (err) {
        console.error("Error processing Kafka message:", err);
      }
    },
  });

  console.log("Kafka consumer broadcast started");
}

export { io };
