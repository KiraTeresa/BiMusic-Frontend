import React from 'react'
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skills from './UserSkills/Skills';
import Projects from "./UserProjects/Projects";
import Samples from "./UserSamples/Samples";

const UserSkillProjectSample = ({ skills, projects, samples }) => {
  const [radioTab, setRadioTab] = useState("skills");
  return (
    <div>
      <div className="nav">
        <ul>
          <li className={radioTab === "skills" ? "user-post active" : "user-post"} onClick={(e) => { setRadioTab("skills") }}>Skills</li>
          <li className={radioTab === "projects" ? "user-review active" : "user-review"} onClick={(e) => { setRadioTab("projects") }}>Projects</li>
          <li className="user-setting" onClick={(e) => { setRadioTab("samples") }}>Samples</li>
        </ul>
      </div>
      <div className="profile-body"></div>
      {radioTab === "skills" &&
        <Skills skillArr={skills} />
      }
      {radioTab === "projects" &&
        <Projects projectArr={projects} />
      }
      {radioTab === "samples" &&
        <Samples sampleArr={samples} />
      }
    </div>
  )
}

export default UserSkillProjectSample;