import io from "socket.io-client";
import UsernameInput from "../components/username_input";
import VideoContainer from "../components/video_container";
import MessageHeader from "../components/message_header";
import MessageFeeds from "../components/message_feeds";
import MessageInput from "../components/message_input";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setCurrentUser, setLocalStream, setPartnerUser, setPeerConnection, setRemoteStream, setTyping } from "../store/store";

const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"],
  forceNew: true,
  reconnectionAttempts: 5,
  timeout: 5000,
});

const App = () => {
  const dispatch = useDispatch();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { peerConnection } = useSelector((state) => state);

  useEffect(() => {
    socket.on("paired", (user) => {
      console.log('PAIRED ', user)
      if(user != null) {
        if(user.partnerId !== socket.id) {
          dispatch(setPartnerUser(user));
        } else {
          dispatch(setCurrentUser(user));
        }
      }
    });

    socket.on("message", (data) => {
      console.log("MESSAGE ", data);
      dispatch(addMessage(data));
    });

    socket.on("partnerDisconnected", () => {
      console.log("DISCONNECTED");
      dispatch(setPartnerUser(null));
    });

    socket.on("typing", (data) => {
      console.log("TYPING", data);
      dispatch(setTyping(data))
    });

    return () => socket.disconnect();
  }, []);

  const joinChat = (name) => {
    console.log("Name ", name)
    if (name) socket.emit("setUserName", name);
  };

  const sendMessage = (message) => {
    if (message.trim()) {
      socket.emit("message", message);
    }
  };

  const startCall = async () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    dispatch(setLocalStream(stream));
    localVideoRef.current.srcObject = stream;

    peer.ontrack = (event) => {
      dispatch(setRemoteStream(event.streams[0]));
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) socket.emit("candidate", event.candidate);
    };

    dispatch(setPeerConnection(peer));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  useEffect(() => {
    socket.on("offer", async (offer) => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.ontrack = (event) => {
        dispatch(setRemoteStream(event.streams[0]));
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) socket.emit("candidate", event.candidate);
      };

      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", answer);

      dispatch(setPeerConnection(peer));
    });

    socket.on("answer", async (answer) => {
      await peerConnection?.setRemoteDescription(answer);
    });

    socket.on("candidate", async (candidate) => {
      await peerConnection?.addIceCandidate(candidate);
    });
  }, [dispatch, peerConnection]);

  return (
    <section>
      <div className="ui__container">
        <div className="video__section">
          <UsernameInput join={joinChat} />
          <VideoContainer />
        </div>
        <div className="chat__messages">
          <MessageHeader />
          <MessageFeeds />
          <MessageInput sendMessage={sendMessage} />
        </div>
      </div>
    </section>
  );
};

export default App;

/*import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { 
  setCurrentUser, 
  setPartnerUser, 
  clearPartner, 
  addMessage, 
  setTyping, 
  setLocalStream, 
  setRemoteStream, 
  setPeerConnection 
} from "../store/store";

const socket = io("http://localhost:4000", {
  transports: ["polling"],
});

const App = () => {
  const dispatch = useDispatch();
  const { name, partner, messages, typing, localStream, remoteStream, peerConnection } = useSelector((state) => state);

  const [message, setMessage] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    socket.on("paired", (data) => {
      console.log('PAIRED ', data)
      dispatch(setPartnerUser(data.partnerUsername));
    });

    socket.on("message", (data) => {
      console.log("MESSAGE ", data);
      dispatch(addMessage(data));
    });

    socket.on("partnerDisconnected", () => {
      console.log("DISCONNECTED");
      dispatch(setPartnerUser(null));
    });

    socket.on("typing", () => {
      console.log("TYPING");
      dispatch(setTyping(true));
      setTimeout(() => dispatch(setTyping(false)), 1000);
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const joinChat = () => {
    if (name) socket.emit("setUserName", name);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing");
  };

  const startCall = async () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    dispatch(setLocalStream(stream));
    localVideoRef.current.srcObject = stream;

    peer.ontrack = (event) => {
      dispatch(setRemoteStream(event.streams[0]));
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) socket.emit("candidate", event.candidate);
    };

    dispatch(setPeerConnection(peer));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  useEffect(() => {
    socket.on("offer", async (offer) => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.ontrack = (event) => {
        dispatch(setRemoteStream(event.streams[0]));
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) socket.emit("candidate", event.candidate);
      };

      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", answer);

      dispatch(setPeerConnection(peer));
    });

    socket.on("answer", async (answer) => {
      await peerConnection?.setRemoteDescription(answer);
    });

    socket.on("candidate", async (candidate) => {
      await peerConnection?.addIceCandidate(candidate);
    });
  }, [dispatch, peerConnection]);

  return (
    <div style={{ padding: 20 }}>
      <h2>WebRTC Chat</h2>
      {!partner ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => dispatch(setCurrentUser(e.target.value))}
          />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <>
          <h3>Connected with {partner}</h3>
          <div>
            <video ref={localVideoRef} autoPlay muted></video>
            <video ref={remoteVideoRef} autoPlay></video>
          </div>
          <button onClick={startCall}>Start Call</button>
        </>
      )}
    </div>
  );
};

export default App;*/

