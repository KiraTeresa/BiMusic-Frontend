import React from "react";
import { Link } from "react-router-dom";

const Samples = ({ sampleArr }) => {
  console.log(sampleArr)
  return (
    <div>
      {sampleArr.length > 0 ?
        <table>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Obligation Year</th>
          </tr>
          {sampleArr && sampleArr.map(samp => {
            return (<tr>
              <td><Link to={`/samples/${samp._id}`}>
                {samp.title}
              </Link>
              </td>
              <td>{samp.genre}</td>
              <td>{samp.year}</td>
            </tr>)
          })}
        </table> : <p>Add Some Sample</p>
      }
    </div>
  )
};

export default Samples;
