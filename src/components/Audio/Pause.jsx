import React from "react";

export default function Play(props) {
  const { handleClick } = props;
  
  return (
    <button className="player__button" onClick={() => handleClick()}>
      Pause
    </button>
  );
}
