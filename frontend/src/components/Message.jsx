import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({ sender, text }) {
  return (
    <div className={`message ${sender}`}>
      <div className="bubble">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Message;