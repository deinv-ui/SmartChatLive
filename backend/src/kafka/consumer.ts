import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "chat-app",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "chat-group"});
export const connectConsumer = async(onMessage: (msg: any) => void) => {
    await consumer.connect();
    await consumer.subscribe({ topic: "chat-topic", fromBeginning: true});

    await consumer.run({
        eachMessage: async( {message }) => {
            const value = message.value?.toString();
            if(value){
                onMessage(JSON.parse(value));
            }
        }
    })
    console.log("Kafka consumer connected!")
}