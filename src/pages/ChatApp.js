import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function ChatApp() {
  const [username, setUsername] = useState("");
  const [partnerUsername, setPartnerUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [paired, setPaired] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const videoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    socket.on("paired", ({ partnerUsername }) => {
      console.log("paired ", partnerUsername);
      setPartnerUsername(partnerUsername);
      setPaired(true);
    });

    socket.on("message", (message) => {
      console.log("messae ", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on("typing", (username) => {
      console.log("typing ", username);
      setTyping(username + " is typing...");
      setTimeout(() => setTyping(false), 2000);
    });

    socket.on("partnerDisconnected", () => {
      console.log("disconnected partner");
      setPartnerUsername("");
      setMessages([]);
      setPaired(false);
      alert("Your partner has disconnected.");
    });

    socket.on("offer", async (offer) => {
      peerConnection.current = new RTCPeerConnection();
      peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", (answer) => {
      peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("candidate", (candidate) => {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    socket.emit("message", input);
    setInput("");
  };

  const startCall = async () => {
    peerConnection.current = new RTCPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  return (
    <div className="chat-container">
      {!username ? (
        <div>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => socket.emit("setUserName", e.target.value)}
            className="input-field"
          />
          <button onClick={() => socket.emit("setUserName", username)} className="btn btn-primary">
            Join Chat
          </button>
        </div>
      ) : paired ? (
        <div>
          <h2>Chatting with: {partnerUsername}</h2>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={msg.senderId === socket.id ? "message-right" : "message-left"}>
                <p><strong>{msg.sender}:</strong> {msg.text}</p>
              </div>
            ))}
            {typing && <p>{typing}</p>}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={() => socket.emit("typing")}
            className="input-field"
          />
          <button onClick={sendMessage} className="btn btn-success">Send</button>
          <button onClick={startCall} className="btn btn-purple">Start Video Call</button>
          <button onClick={() => { socket.emit("leaveChat"); setPartnerUsername(""); setMessages([]); setPaired(false); }} className="btn btn-danger">Leave</button>
          <video ref={videoRef} autoPlay className="video" />
          <video ref={partnerVideoRef} autoPlay className="video" />
        </div>
      ) : (
        <p>Waiting for a partner...</p>
      )}
    </div>
  );
}

export default ChatApp;
