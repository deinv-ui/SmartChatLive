import { sendMessage } from "../src/kafka/producer";
export const sendChat = async(req, res) => {
    try {
        const { email, content } = req.body;
        if(!email || !content){
            return res.status(400).json({ error: "Email and messages are required!"})
        }
        const message = {
            email, 
            content,
            timestamp: new Date().toString(),

        }
        await sendMessage(message);
        return res.json({
            success: true,
            message: "Sent to Kafka",
            data: message,
        })
    } catch (error) {
    };

}

