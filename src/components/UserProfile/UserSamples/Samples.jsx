import React from "react";

const Samples = ({ sampleArr }) => {
  console.log(sampleArr)
  return (
    <div>
      {sampleArr.length > 0 ?
        <div>{sampleArr.map((sample, index) => {
          if (sample.linkType === "upload") {
            return <div key={index}>
              {sample.title}
              <audio controls >
                <source src={sample.uploadedLink} />
              </audio>
            </div>
          } else {
            return <a href={sample.link} target="_blank" style={{ display: "block" }} key={index} rel="noreferrer"> Link: {sample.title}</a>
          }
        })
        }</div> :
        <p>No Samples Added</p>}
    </div>
  )
};

export default Samples;
