function ChatInput({ input, setInput, handleSend, disabled }) {
  // Send message when Enter key is pressed
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!disabled) {
        handleSend();
      }
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      <button
        onClick={handleSend}
        disabled={disabled}
      >
        {disabled ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;