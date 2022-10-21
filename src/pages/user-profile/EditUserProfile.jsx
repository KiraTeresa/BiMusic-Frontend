import React from 'react'
import { useContext,useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import SKILL_ENUM from "../../consts/skillEnum"

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

  const [city, setCity] = useState(userInfo && userInfo.city);
  const [country, setCountry] = useState(userInfo && userInfo.country);
  const [name, setName] = useState(userInfo && userInfo.name);
  const [aboutMe, setAboutMe] = useState(userInfo && userInfo.aboutMe);
  const [skillArr, setSkillArr] = useState([])
  const [filterSkillArr, setFilterSkillArr] = useState([])
  const [errorMessage, setErrorMessage] = useState(undefined);
  const handleName = (e) => setName(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleAboutMe = (e) => setAboutMe(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);
  
  useEffect(() => {
  let skillEnum2 = [...SKILL_ENUM];
  let filterSkillEnum = skillEnum2.filter(item=>{
    return (userInfo && !userInfo.skills.includes(item))
  })
  setFilterSkillArr(filterSkillEnum);
  }, [userInfo])

const handleUserProfileUpdate =async(e)=> {
  try{
    e.preventDefault();
    let updatedData={name,city,country,aboutMe,email:userInfo.email};
    //Updating data to database
    const response= await axios.put("http://localhost:5005/profile/editinfo",updatedData);
    //Fetching data again
    const updatedInfo=await axios.post("http://localhost:5005/profile/",{email:user.email});
    setUserInfo(updatedInfo.data);
  }catch(err){
    console.log(err);
  }
}
  return (
<div>
      {userInfo ?
      <>
        <form onSubmit={handleUserProfileUpdate}>
          <label>Name:</label>
          <input onChange={handleName} type="text" name="name" defaultValue={userInfo.name}/> 

        <label>City:</label>
        <input onChange={handleCity} type="text" name="city" defaultValue={userInfo.city} />


        <label>Country:</label>
        <input onChange={handleCountry} type="text" name="country" defaultValue={userInfo.country} />

        <label>About me:</label>
        <input onChange={handleAboutMe} type="text" name="country" defaultValue={userInfo.aboutMe} />
        <button type="submit">Update</button>
        </form>

        <label>What kind of musician are you?</label>
        <div> <h2>Render skill already selected: {userInfo.skills.map((skill)=>(
        <div>
        <p>{skill}</p>
        <button>Delete</button>
        </div>
        ))}
        </h2>
        </div>
        {filterSkillArr && filterSkillArr.map((skill) => {
          return <label key={skill}>
            <input type="checkbox" name="lookingFor" value={skill}>
            </input>{skill}</label>
        })}
      </>
:<div>noData</div>}
</div>
  )
}

export default EditUserProfile