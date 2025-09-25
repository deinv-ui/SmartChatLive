# 💬 SmartChat Live

SmartChat Live is a **real-time group chat app** built with **Node.js + Socket.IO**, enhanced with an **AI assistant** that can join conversations, answer questions, and summarize discussions.

---

## 🚀 Features

- 🔗 Real-time group chat with multiple users  
- 👤 User join/leave notifications  
- 🤖 AI Assistant bot (powered by OpenAI or Hugging Face APIs)  
- ✍️ Typing indicators  
- 💾 Optional chat history persistence (SQLite/Postgres/MongoDB)  
- 📱 Works across web and mobile clients  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Socket.IO  
- **Frontend**: React
- **AI Integration**: OpenAI API (ChatGPT) / Hugging Face Inference API  
- **Database (optional)**: Postgres

---

## 📂 Project Structure
smartchatlive/
│
├── server/ # Node.js + Socket.IO backend
│ ├── index.js # Express + Socket.IO setup
│ ├── ai.js # AI API integration logic
│ └── package.json
│
├── client/ # Frontend (simple HTML/JS or Vue/React app)
│ ├── index.html
│ ├── main.js
│ └── styles.css
│
└── README.md


---

## ⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/smartchatlive.git
   cd smartchatlive/server
   ```
   2. Install dependencies
```bash
   npm install
```
3. Set up environment variables
Create a .env file inside /server:
```bash
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```
4. Run the server
```bash
npm run start
```
The server will start at http://localhost:3000
5. Run the client
If using Vue/React: cd client && npm install && npm run dev

## How It Works

Users connect to the server via Socket.IO.

Messages are broadcast to all users in the same room.

Special messages sent with @ai trigger the AI assistant. Example:
```bash
@ai summarize the last 5 messages

```
The server calls the AI API and sends the AI’s reply back to all users.
## 🔮 Roadmap

 Add private 1:1 chat

 Add authentication (JWT)

 Persist chat history in a database

 Support multiple AI personas (funny bot, teacher bot, debate bot)

 Deploy on free hosting (Render / Railway / Vercel + Docker)
