import { useState, useRef, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Backend URL - use environment variable or fallback to localhost for dev
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/chat";

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Send Message
  const handleSend = async () => {
    const text = input.trim();

    if (!text) return;

    // Add User Message
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Clear Input
    setInput("");

    // Show Typing
    setIsTyping(true);

    try {
      // Call FastAPI
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      // Add AI Response
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      // Error Message
      const errorMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: "⚠️ Unable to connect to the AI server.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <Header />

        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

export default App;