// src/pages/Chat.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore.js";

const Chat = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<{ from: string; content: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  if (!currentUser) return <div className="p-6 text-gray-600">Loading user...</div>;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [...prev, { from: currentUser.email, content: newMessage }]);
    setNewMessage("");

    // TODO: send to Kafka later
  };

  // Generate a simple avatar color based on email
  const getAvatarColor = (email: string) => {
    const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["bg-red-400", "bg-green-400", "bg-blue-400", "bg-yellow-400", "bg-purple-400"];
    return colors[hash % colors.length];
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 text-xl font-semibold">
        Welcome, {currentUser.email}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, idx) => {
          const isSelf = msg.from === currentUser.email;
          return (
            <div
              key={idx}
              className={`mb-3 flex items-end ${isSelf ? "justify-end" : "justify-start"}`}
            >
              {!isSelf && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 ${getAvatarColor(msg.from)}`}
                >
                  {msg.from[0].toUpperCase()}
                </div>
              )}

              <div
                className={`px-4 py-2 max-w-xs break-words rounded-2xl shadow-md ${
                  isSelf
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {!isSelf && <div className="text-xs text-gray-500 mb-1">{msg.from}</div>}
                {msg.content}
              </div>

              {isSelf && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ml-2 ${getAvatarColor(msg.from)}`}
                >
                  {msg.from[0].toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex p-4 bg-gray-200 border-t border-gray-300">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-l-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-2xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
