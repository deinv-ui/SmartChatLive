import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka producer connected");
};

export const sendMessage = async (message: any) => {
  await producer.send({
    topic: "chat-topic",
    messages: [{ value: JSON.stringify(message) }],
  });
};
