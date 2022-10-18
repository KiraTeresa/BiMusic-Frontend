import "./user-profile.css";
import { useContext,useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";

function ProfilePage() {
const [userInfo,setUserInfo]= useState(undefined)
  useEffect(() => {
    axios
      .post("http://localhost:5005/profile",{
        email:user.email
      } )
      .then(response => setUserInfo(response.data));
  }, []);
const {user} = useContext(AuthContext)//this function will give us the user
console.log(userInfo)
  return (
    <div>
      <h1>useremail,name</h1>
      <h1>name:{user? user.name :""}</h1>
      <h1>email:{user? user.email :""} </h1>
      <h1>about me:{user? user.aboutMe :""} </h1>
      <h1>city:{user? user.city :""} </h1>  
      <h1>country:{user? user.country:""} </h1>
      {/* <h1>collabProjects:{user? user.collabProjects:""} </h1>
      <h1>samples:</h1> */}
      <button>Edit Profile</button>
      
    </div>
  );
}

export default ProfilePage;
