import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { v4 as uuid } from "uuid";
import "./Lobby.css";


import Slider1 from "../photos/Slider1.svg";
import Slider2 from "../photos/Slider2.svg";
import Slider3 from "../photos/Slider3.svg";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Lobby = ({ email, setEmail, name, setName, pic, setPic }) => {
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  // };

  const room = uuid();
  const navigate = useNavigate();

  const socket = useSocket();

  const [existroom,setExistroom] = useState("")

  const handleStartMeeting = useCallback(
    (e) => {
      e.preventDefault();
      console.log(room);
      socket.emit("room:join", { name, email, room });
    },
    [email, room, socket]
  )

  const handleFormSubmit = useCallback(
    async(e) => {
      e.preventDefault();
      socket.emit("room:join", { name, email, room:existroom });
    },
    [email, existroom, socket]
  )

  const handleJoinRoom = useCallback((data) => {
    const { email, room } = data;
    navigate(`/room/${room}`);
  }, []);

  useEffect(()=>{
    if(!email){
      navigate(`/home`)
    }
  })

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket]);

  return (
    <div className="lobbyContainer">
      <div className="lobbyText">
        <p className="heading">
          Premium video meetings. <br /> Now free for everyone.
        </p>
        <p className="para">
          We re-engineered the service we built for secure buisness meetings,
          MeetUp to make it free and available for all
        </p>
        <button className="lobbyMeetingButton" onClick={handleStartMeeting}>
          New Meeting
        </button>
        <form action="" onSubmit={handleFormSubmit} className="lobbyForm">
          <input placeholder="Enter a code link" type="text" value={existroom} onChange={(e)=>setExistroom(e.target.value)} className="formInput" />
          <button className="formButton">Join</button>
        </form>
      </div>
      <div className="lobbySlider">
        {/* <Slider {...settings}> */}
        <div className="sliderDiv">
          <img src={Slider1} alt="" className="sliderImg" />
          <div className="sliderText">
            <p className="sliderTextHeading">Get a link you can share</p>
            <p className="sliderTextPara">
              Click <b>New meeting</b> to get a link you can send to people you
              want to meet with
            </p>
          </div>
        </div>
        {/* <div className="sliderDiv">
            <img src={Slider2} alt="" className="sliderImg" />
            <div className="sliderText">
              <p className="sliderTextHeading">Plan ahead</p>
              <p className="sliderTextPara">Click <b>New meeting</b> to schedule meetings</p>
            </div>
          </div>
          <div className="sliderDiv">
            <img src={Slider3} alt="" className="sliderImg" />
            <div className="sliderText">
              <p className="sliderTextHeading">Your meeting is safe</p>
              <p className="sliderTextPara">No one can join a meeting unless invited or admitted by the host</p>
            </div>
          </div> */}
        {/* </Slider> */}
      </div>
    </div>
  );
};

export default Lobby;
