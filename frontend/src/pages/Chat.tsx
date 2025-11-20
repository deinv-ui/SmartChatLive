import React, { useState, useRef, useEffect } from "react";
import { io as ioClient } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore.js";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

type Msg = {
  email: string;
  content: string;
  timestamp: string;
};

const Chat = () => {
  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const socket = ioClient(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    socket.on("chat:message", (msg: Msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chat:error", (err) => {
      console.error("Socket error:", err);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const socket = socketRef.current;

    if (socket && socket.connected) {
      socket.emit("chat:send", { content: newMessage });
      
      // Optimistic UI
      setMessages((prev) => [
        ...prev,
        {
          email: currentUser.email,
          content: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);

      setNewMessage("");
    }
  };

  if (!currentUser) return <div className="p-6 text-gray-600">Loading user...</div>;

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-6 py-4 text-xl font-semibold">
        Welcome, {currentUser.email}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, idx) => {
          const isSelf = msg.email === currentUser.email;
          return (
            <div key={idx} className={`mb-3 flex items-end ${isSelf ? "justify-end" : "justify-start"}`}>
              {!isSelf && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 bg-gray-400">
                  {msg.email[0].toUpperCase()}
                </div>
              )}

              <div
                className={`px-4 py-2 max-w-xs break-words rounded-2xl ${
                  isSelf ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                }`}
              >
                {!isSelf && <div className="text-xs text-gray-500 mb-1">{msg.email}</div>}
                {msg.content}
              </div>

              {isSelf && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ml-2 bg-blue-400">
                  {currentUser.email[0].toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-4 bg-gray-200 border-t border-gray-300">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-l-2xl border border-gray-300 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-2xl">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
