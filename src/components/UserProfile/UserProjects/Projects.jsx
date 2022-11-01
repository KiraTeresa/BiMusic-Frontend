import React from "react";
import {Link} from "react-router-dom"

const Projects = ({projectArr}) => {
  return <div className="profile-project">
    <h4>
      My Projects:
    </h4>
    {projectArr && projectArr.map((project, index) => (
      <Link to={`/projects/${project._id}`} key={index}>
        <p>
          {project.title}
        </p>
      </Link>
    ))}
  </div>;
};

export default Projects;
