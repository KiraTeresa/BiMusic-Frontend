import "./user-profile.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [userInfo,setUserInfo]= useState(null);
  const [userProject,setUserProject]= useState(null);

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

  console.log(userProject);

  useEffect(() => {
    axios
      .get(`http://localhost:5005/profile/addedproject/${user._id}`)
      .then(response => {
        setUserProject(response.data)
      })
      .catch((err)=>{
        console.log(err)
      });
  }, []);

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
      <h4>Skills:</h4>
  {userInfo.skills}
        <h4>
          My Projects:
        </h4>
        {userProject && userProject.map((project,index)=>(
          <Link to={`/projects/${project._id}`} key={index}>
           <p>
             {project.title}
            </p>
        </Link>
        ))}
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
