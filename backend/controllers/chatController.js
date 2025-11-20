import { sendMessageToKafka } from "../kafka/producer.js";
import { getAllMessages } from "../models/messageModel.js";

export async function sendChat(req, res) {
  try {
    const { email, content } = req.body;
    if (!email || !content) return res.status(400).json({ error: "email & content required" });

    const message = { email, content, timestamp: new Date().toISOString() };
    // produce to Kafka
    await sendMessageToKafka(process.env.KAFKA_TOPIC || "chat-topic", message);
    return res.json({ success: true, queued: true });
  } catch (err) {
    console.error("sendChat err", err);
    res.status(500).json({ error: "failed" });
  }
}

export async function fetchChats(req, res) {
  const rows = await getAllMessages();
  res.json({ messages: rows });
}
