import "./user-profile.css";
import { useContext,useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { Link } from "react-router-dom";



function ProfilePage() {
const [userInfo,setUserInfo]= useState(undefined)
  useEffect(() => {
    axios
      .post("http://localhost:5005/profile",{
        email:user.email
      } )
      .then(response => setUserInfo(response.data));
  }, []);
const {user} = useContext(AuthContext)//this function will give us the user info
console.log(userInfo)
  return (
    <div>
      <h2>Your profile</h2>
      <h4>Forum Username:{user? user.name :""}</h4>
      <h4>Email:{user? user.email :""}</h4>
      <h4>Address:</h4>
      <h5>{user? user.city :""} </h5>  
      <h5>{user? user.country:""} </h5>
      <h4>About me:{user? user.aboutMe :""} </h4>
      <h4>Skills:{user? user.skills :""} </h4>
      <h4>My Projects: </h4>
      <h4>My Samples: </h4>
      {/* <h1>collabProjects:{user? user.collabProjects:""} </h1>
      <h1>samples:</h1> */}
      <Link to='/editprofile'><button>Edit Profile</button></Link>
      
    </div>
  );
}

export default ProfilePage;
