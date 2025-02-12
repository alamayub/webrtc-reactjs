import { PhoneOff } from "lucide-react";
import { useSelector } from "react-redux";

const MessageHeader = () => {
  const companion = useSelector((state) => state.partnerUser);
  return (
    <div className="message__header">
      <div>
        <div>{companion !== null ? companion.username : "---------"}</div>
        <span>
          {companion !== null ? companion.date : "21 Nov 2025, 03:45AM"}
        </span>
      </div>
      <button style={{ backgroundColor: "#fe5d5c" }}>
        <PhoneOff />
      </button>
    </div>
  );
};

export default MessageHeader;