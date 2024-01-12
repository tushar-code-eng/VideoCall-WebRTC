import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [mystream, setMystream] = useState();
  const [remotestream, setRemotestream] = useState();

  const handleUserJoined = useCallback(({ name,email, id }) => {
    console.log(`Name ${name} joined the room`);
    setRemoteSocketId(id);
  });

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMystream(stream);
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
      peer.peer.addTrack(track, mystream);
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
    async({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (e) => {
      const remoteStream = e.streams;
      console.log('GOT TRACKS')
      setRemotestream(remoteStream[0]);
    });
  });

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
    <div>
      <h1>Room</h1>
      <h4>{remoteSocketId ? `Connected` : "Not connected"}</h4>
      {mystream && <button>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {mystream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="300px"
            width="500px"
            url={mystream}
          />
        </>
      )}
      {remotestream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="300px"
            width="500px"
            url={remotestream}
          />
        </>
      )}
    </div>
  );
};

export default Room;
