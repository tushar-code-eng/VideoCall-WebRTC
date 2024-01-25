import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";
import "./Room.css";
import { useLocation } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ChatBox from "../Components/ChatBox";
import Stream from "../Components/Stream";
import ChatIcon from '@mui/icons-material/Chat';

const Room = ({ email, setEmail, name, setName, pic, setPic }) => {
  const loc = useLocation();
  const socket = useSocket();

  const [chatbox, setChatbox] = useState(false);
  const [sender, setSender] = useState();
  const [video, setVideo] = useState(false);
  const [url, setUrl] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [mystream, setMystream] = useState();
  const [remotestream, setRemotestream] = useState();

  const handleUserJoined = useCallback(
    ({ name, email, id }) => {
      console.log(`Name ${name} joined the room`);
      setRemoteSocketId(id);
    },
    [setRemoteSocketId]
  );

  const handleCallUser = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    console.log("hit");
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMystream(stream);
      console.log(`incomming call from ${from}`, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const SendStreams = useCallback(() => {
    for (const track of mystream.getTracks()) {
      const send = peer.peer.addTrack(track, mystream);
      setSender(send);
    }
  }, [mystream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted");
      SendStreams();
    },
    [SendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const SwitchingOnCamera = async () => {
    setVideo(false);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMystream(stream);
  };

  const showLinkCopied = (text, result) => {
    if (result === true) {
      setUrl(true);
    }
    setTimeout(() => {
      setUrl(false);
    }, [1000]);
  };

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    SwitchingOnCamera();

    peer.peer.addEventListener("track", async (e) => {
      const remoteStream = e.streams;
      console.log("GOT TRACKS");
      setRemotestream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoIncomming);
    socket.on("peer:nego:final", handleNegoFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoIncomming);
      socket.off("peer:nego:final", handleNegoFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoIncomming,
    handleNegoFinal,
  ]);

  return (
    <>
      {chatbox && <ChatBox chatbox={chatbox} setChatbox={setChatbox} />}

      {url && <div className="linkCopied">Meeting Link Copied</div>}

      <div className="connectionBox">
        <div style={{marginLeft:"10px"}}>
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => {
              setChatbox(!chatbox);
            }}
          >
            {/* <ChatIcon /> */}
          </h2>
        </div>
        <div className="connectionText">
          <h2>{remoteSocketId ? `Connected` : "Not connected"}</h2>
          <button onClick={handleCallUser} className="ConnectButton">
            Connect
          </button>

          <br />
          <CopyToClipboard
            text={loc.pathname.split("/")[2]}
            onCopy={showLinkCopied}
          >
            <button className="copyLinkButton">Copy RoomId</button>
          </CopyToClipboard>
        </div>
      </div>
      <div className="roomContainer">
        <Stream
          headType="My Stream"
          mystream={mystream}
          setMystream={setMystream}
          video={video}
          SwitchingOnCamera={SwitchingOnCamera}
          setVideo={setVideo}
        />

        <div className="remoteVideo">
          {remotestream && (
            <Stream
              headType="Remote Stream"
              mystream={remotestream}
              setMystream={setRemotestream}
              video={video}
              SwitchingOnCamera={SwitchingOnCamera}
              setVideo={setVideo}
              sender={sender}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Room;
