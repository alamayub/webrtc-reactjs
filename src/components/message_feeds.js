import React from "react";
import { useSelector } from "react-redux";
import { getRandomColor } from "../utils";

const MessageFeeds = () => {
  const {currentUser, messages} = useSelector((state) => state);
  return (
    <div className="message__feeds">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div
            key={index}
            className={`message__div ${currentUser?.partnerId === message.senderId ? "right" : "left"}`}
          >
            {currentUser?.partnerId === message.senderId && (
              <div
                className="user__avatar"
                style={{ backgroundColor: getRandomColor() }}
              >
                {message.sender}
              </div>
            )}
            <div className="message__content">{message.text}</div>
          </div>
        ))
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          Send message to start conversation!
        </div>
      )}
    </div>
  );
};

export default MessageFeeds;