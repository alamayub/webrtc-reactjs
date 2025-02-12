import { Expand, MicOff, PhoneOff, Settings, Video } from "lucide-react";
import { useRef } from "react";
import { toggleFullScreen } from "../utils";

const VideoContainer = () => {
  const ref = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  return (
    <div className="video__container" ref={ref}>
      <div className="video__calling">
        <video ref={remoteVideoRef} autoPlay></video>
        <div className="video__calling__options">
          <button onClick={() => toggleFullScreen(ref)}>
            <Expand />
          </button>
          <button>
            <MicOff />
          </button>
          <button style={{ backgroundColor: "#fe5d5c", padding: "21px" }}>
            <PhoneOff />
          </button>
          <button>
            <Video />
          </button>
          <button>
            <Settings />
          </button>
        </div>
      </div>
      <div className="current__user__video__container">
        <video ref={localVideoRef} autoPlay muted></video>
      </div>
      <div className="video__timer">
        <div>
          <div></div>
        </div>
        <span>03:15</span>
      </div>
    </div>
  );
};

export default VideoContainer;