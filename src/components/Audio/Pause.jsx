import React from "react";
import pauseIcon from "../../assets/icons/pause-icon-white.png"

export default function Play(props) {
  const { handleClick } = props;

  return (
    <button className="player__button" onClick={() => handleClick()}>
      <img src={pauseIcon} alt="pause button"></img>
    </button>
  );
}
