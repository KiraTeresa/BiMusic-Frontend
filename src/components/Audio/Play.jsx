import React from "react";
// import bimusicicon from '../../assets/icons/bimusiclogo2.png'
import playIcon from "../../assets/icons/play-icon-white.png"


export default function Play(props) {
  const { handleClick } = props;

  return (
    <button className="player__button" onClick={() => handleClick()}>
      {/* Play */}
      <img src={playIcon} alt="play button"></img>
      {/* <img className="bimusicicon2" src={bimusicicon} alt="musicicon" /> */}
    </button>
  );
}
