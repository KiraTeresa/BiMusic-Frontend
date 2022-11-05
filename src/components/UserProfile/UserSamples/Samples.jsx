import React from "react";
import { Link } from "react-router-dom";

const Samples = ({ sampleArr }) => {
  console.log(sampleArr)
  return (
    <div>
      {sampleArr.length > 0 ?
        <table>
          <thead>

            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Obligation Year</th>
            </tr>
          </thead>
          <tbody>

            {sampleArr && sampleArr.map(samp => {
              return (<tr key={samp._id}>
                <td><Link to={`/samples/sample/${samp._id}`}>
                  {samp.title}
                </Link>
                </td>
                <td>{samp.genre}</td>
                <td>{samp.year}</td>
              </tr>)
            })}
          </tbody>
        </table> : <p>Add Some Sample</p>
      }
    </div>
  )
};

export default Samples;
