import React from 'react'
import { useContext,useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import SKILL_ENUM from "../../consts/skillEnum"
import { useNavigate } from 'react-router-dom';

const EditUserProfile = () => {
  const [userInfo,setUserInfo]= useState(undefined)
  const {user} = useContext(AuthContext)//this function will give us the user info
  
  
  useEffect(() => {
    axios
      .post("http://localhost:5005/profile/",{
        email:user.email
      } )
      .then(response => setUserInfo(response.data)).catch((err)=>{console.log(err)});
  }, []);

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [skillArr, setSkillArr] = useState([])
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();


  const handleName = (e) => setName(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleAboutMe = (e) => setAboutMe(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);

  console.log(userInfo)

let skillEnum2 = [...SKILL_ENUM]
let filterSkillEnum = skillEnum2.filter(item=>!userInfo.skills.includes(item))

  return (
<div>
      {userInfo ?
        <form>
          <label>Name:</label>
          <input onChange={handleName} type="text" name="name" defaultValue={userInfo.name}/> 

        <label>City:</label>
        <input onChange={handleCity} type="text" name="city" defaultValue={userInfo.city} />


        <label>Country:</label>
        <input onChange={handleCountry} type="text" name="country" defaultValue={userInfo.country} />

        <label>About me:</label>
        <input onChange={handleAboutMe} type="text" name="country" defaultValue={userInfo.aboutMe} />

        {/* <label>What kind of musician are you?</label>
        {filterSkillEnum.map((skill) => {
          return <label key={skill}>
            <input type="checkbox" name="lookingFor" value={skill}>
            </input>{skill}</label>
        })} */}

        <button type="submit">Sign Up</button>
      </form>
:<div>noData</div>}
</div>
  )
}

export default EditUserProfile