import React from 'react'
import { useState } from "react";
import Projects from "./UserProjects/Projects";
import Samples from "./UserSamples/Samples";

const UserSkillProjectSample = ({ projects, samples, collabProjects }) => {
  const [radioTab, setRadioTab] = useState("skills");
  return (
    <div>
      <div className="nav">
        <ul>
          <li className={radioTab === "projects" ? "user-review active" : "user-review"} onClick={(e) => { setRadioTab("projects") }}>Projects</li>
          <li className="user-setting" onClick={(e) => { setRadioTab("samples") }}>Samples</li>
        </ul>
      </div>
      <div className="profile-body"></div>
      {radioTab === "projects" &&
        <Projects projectArr={projects} collabProjectArr={collabProjects} />
      }
      {radioTab === "samples" &&
        <Samples sampleArr={samples} />
      }
    </div>
  )
}

export default UserSkillProjectSample;