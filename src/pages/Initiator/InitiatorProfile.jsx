import React from 'react'
import {useParams} from "react-router-dom"

const InitiatorProfile = () => {
  let params = useParams();
  console.log(params.initiator);

// userstate

  
//   useEffect(() => {
//     apiClient.get("/initiator", {
//       email: user.email
//     })
//       .then(response => {
//         setUserInfo(response.data)
//       })
//       .catch((err) => {
//         console.log(err)
//       });
//   }, [user.email]);
  return (
    <div>InitiatorProfile</div>
  )
}

export default InitiatorProfile