import React from "react";
import { Link } from "react-router-dom"

const Projects = ({ projectArr, collabProjectArr }) => {
  console.log(collabProjectArr);
  return <div className="profile-project">
    <h3>Own Project</h3>
    {projectArr.length > 0 ?
      <table>
        <tr>
          <th>Title</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
        {projectArr.map(project => {
          return (<tr>
            <td> <Link to={`/projects/${project._id}`} key={project._id}>
              <p>
                {project.title}
              </p>
            </Link>
            </td>
            <td>{project.startDate.slice(0, -14)}</td>
            <td>{project.endDate.slice(0, -14)}</td>
          </tr>)
        })}
      </table> : <p>Add Some Project</p>
    }

    <h3>Collab Project</h3>
    {collabProjectArr.length > 0 ?
      <table>
        <tr>
          <th>Title</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
        {collabProjectArr.map(project => {
          return (<tr>
            <td><Link to={`/projects/${project._id}`} key={project._id}>
              {project.title}
            </Link>
            </td>
            <td>{project.startDate.slice(0, -14)}</td>
            <td>{project.endDate.slice(0, -14)}</td>
          </tr>)
        })}
      </table> : <p>Do Collaboration</p>
    }
  </div>
};

export default Projects;
