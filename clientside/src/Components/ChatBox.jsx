import { React, useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

import "./ChatBox.css";

import SendIcon from "@mui/icons-material/Send";

const ChatBox = ({ chatbox, setChatbox }) => {
  const socket = useSocket();

  const name = localStorage.getItem.name;
  const [divs, setDivs] = useState([]);
  const [msg, setMsg] = useState("");
  const [text, setText] = useState([]);

  const handlemessage = () => {
    // console.log(msg.inputValue)
    socket.emit("userMessage", { msg, name });
  };

  const handlingMessage = (msg, name) => {
    const a = [...divs, []];
    setDivs(a);
  };


  // useEffect(()=>{
  //   setText(...text,msg)
  // },[setText,text,msg])


  useEffect(() => {
    socket.on("message", handlingMessage);

    return () => {
      socket.off("message", handlingMessage);
    };
  });

  return (
    <>
      <div
        onClick={() => {
          setChatbox(false);
        }}
        className="chatBoxBackground"
      ></div>
      <div className="chatBox">
        <div className="head">
          <p>In Call messages</p>
          <p
            onClick={() => {
              setChatbox(false);
            }}
            style={{ cursor: "pointer" }}
          >
            X
          </p>
        </div>
        <div className="title">
          Messages can only be seen by people in call and are deleted when the
          call ends.
        </div>
        <div className="content">
          <div className="chatspace">
            {divs.map((data, i) => {
              return (
                <div key={i} style={{ backgroundColor: "red" }}>
                  {msg.inputValue }
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "centre",
            }}
          >
            <input
              onChange={(e)=>{setMsg((inputValue)=>({
                inputValue:e.target.value
              }))}}
              type="text"
              style={{
                border: "none",
                padding: "5px",
                outlineStyle: "none",
                width: "100%",
              }}
              placeholder="Send a message"
            />
            <button onClick={handlemessage}>
              <SendIcon style={{ color: "rgb(60, 68, 220)" }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
