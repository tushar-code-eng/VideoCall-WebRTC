import React, { useCallback, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import './Lobby.css'
import wrong from '../GIFS/wrong.gif'
import hello from '../GIFS/hi.gif'

const Lobby = () => {
  const navigate = useNavigate()

  const socket = useSocket()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join",{name,email,room})
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
    <div className="mainContainer">
      <h1>Lobby</h1>
      <form action="" onSubmit={handleSubmitForm}>
        <label htmlFor="name">Name</label>
        <input
          type="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
