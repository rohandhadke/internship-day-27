import Message from "./Message";

function ChatWindow({ messages, isTyping, messagesEndRef }) {
  return (
    <div className="chat-window">
      {/* Display all chat messages */}
      {messages.map((message) => (
        <Message
          key={message.id}
          sender={message.sender}
          text={message.text}
        />
      ))}

      {/* AI Typing Indicator */}
      {isTyping && (
        <div className="message ai">
          <div className="bubble typing">
            AI is typing...
          </div>
        </div>
      )}

      {/* Used for automatic scrolling */}
      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default ChatWindow;