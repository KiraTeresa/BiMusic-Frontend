import React from "react";
// import bimusicicon from '../../assets/icons/bimusiclogo2.png'


export default function Play(props) {
  const { handleClick } = props;

  return (
    <button className="player__button" onClick={() => handleClick()}>
        Play
      {/* <img className="bimusicicon2" src={bimusicicon} alt="musicicon" /> */}
    </button>
  );
}
