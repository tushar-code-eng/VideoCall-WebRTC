import React from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";

import "./Stream.css";

const MyStream = ({
  mystream,
  setMystream,
  video,
  setVideo,
  SwitchingOnCamera,
  headType,
  sender,
}) => {
  const handleVideoOff = async () => {
    setVideo(!video);
    const endstream = await mystream.getTracks().forEach((track) => {
      if (track.readyState === "live" && track.kind === "video") {
        track.stop();
      }
    });
    setMystream(endstream);
  };

  const endCallHandle = (e) => {
    peer.peer.removeTrack(sender);
    peer.peer.close();
  };

  return (
    <div className="videoContainer">
      <h1>{headType}</h1>
      <ReactPlayer
        muted
        className="player"
        playing
        width="500px"
        url={mystream}
      />
      <div className="buttons">
        <button
          onClick={
            video
              ? SwitchingOnCamera
              : headType === "My Stream"
              ? handleVideoOff
              : endCallHandle
          }
          className="VideoOffButton"
        >
          {headType === "My Stream"
            ? `Video ${video ? "On" : "Off"}`
            : "End Call"}
        </button>
      </div>
    </div>
  );
};

export default MyStream;
