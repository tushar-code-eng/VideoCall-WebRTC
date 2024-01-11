import React, { useCallback, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const Lobby = () => {
  const navigate = useNavigate()

  const socket = useSocket()

  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join",{email,room})
    },
    [email, room, socket]
  )

  const handleJoinRoom = useCallback((data)=>{
    const {email,room} = data
    navigate(`/room/${room}`)
  },[])
  
  useEffect(()=>{
    socket.on("room:join",handleJoinRoom)
    return ()=>{
      socket.off("room:join",handleJoinRoom)
    }
  },[socket])

  return (
    <div>
      <h1>Lobby</h1>
      <form action="" onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};

export default Lobby;
