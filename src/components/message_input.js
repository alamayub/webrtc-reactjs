import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = ({ sendMessage }) => {
  const [text, setText] = useState("");
  return (
    <div className="message__input">
      <input 
        type="text" 
        placeholder="Write your message..." 
        onChange={ e => setText(e.target.value)} 
        onFocus={() => console.log("Typing...")}
        onBlur={() => console.log("Leaving...")}
      />
      <button onClick={() => sendMessage(text)}>
        <Send />
      </button>
    </div>
  );
};

export default MessageInput;  