import "./user-profile.css";
import { useContext,useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [userInfo,setUserInfo]= useState()
  const {user} = useContext(AuthContext)//this function will give us the user info
  useEffect(() => {
    axios
      .post("http://localhost:5005/profile/",{
        email:user.email
      } )
      .then(response => {
        setUserInfo(response.data)
      })
      .catch((err)=>{
        console.log(err)
      });
  }, []);

console.log(userInfo)

  return (
    <div>
      <h2>Your profile</h2>
      {userInfo &&
<div>
        <h4>Forum Username:{userInfo.name}</h4>
      <h4>Email:{userInfo.email}</h4>
      <h5>{userInfo.city} </h5>  
      <h5>{userInfo.country} </h5>
      <h4>About me:{userInfo.aboutMe} </h4>
      <h4>Skills:{userInfo.skills} </h4>
      <h4>My Projects: </h4>
      <h4>My Samples: </h4>
      {/* <h1>collabProjects:{user? user.collabProjects:""} </h1>
    <h1>samples:</h1> */}
  </div>
  }
      <Link to='/editprofile'><button>Edit Profile</button></Link>
    </div>
  );
}

export default ProfilePage;
