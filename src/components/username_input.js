import { Send } from "lucide-react";
import { useState } from "react";
const UsernameInput = ({ join }) => {
  const [name, setName] = useState("");
  return (
    <div className="video__container__input">
      <input type="text" placeholder="Enter your name to join..." onChange={e => setName(e.target.value)} />
      <button onClick={() => join(name)}>
        <Send color="#ffffff" size={18} />
        <span>Join</span>
      </button>
    </div>
  );
};

export default UsernameInput;