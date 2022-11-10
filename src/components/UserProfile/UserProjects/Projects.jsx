import React from "react";
import { Link } from "react-router-dom"

const Projects = ({ projectArr, collabProjectArr }) => {

  return <div className="profile-project">
    <h3>Own Project</h3>
    {projectArr.length > 0 ?
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {projectArr.map(project => {
            return (<tr key={project._id}>
              <td> <Link to={`/projects/${project._id}`} >
                <p>
                  {project.title}
                </p>
              </Link>
              </td>
              <td>{project.startDate.slice(0, -14)}</td>
              <td>{project.endDate.slice(0, -14)}</td>
            </tr>)
          })}
        </tbody>
      </table> : <p>Add Some Project</p>
    }

    <h3>Collab Project</h3>
    {collabProjectArr.length > 0 ?
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>

          {collabProjectArr.map(project => {
            return (<tr key={project._id}>
              <td><Link to={`/projects/${project._id}`}>
                {project.title}
              </Link>
              </td>
              <td>{project.startDate.slice(0, -14)}</td>
              <td>{project.endDate.slice(0, -14)}</td>
            </tr>)
          })}
        </tbody>
      </table> : <p>Do Collaboration</p>
    }
  </div>
};

export default Projects;
