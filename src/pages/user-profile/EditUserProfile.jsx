import "./user-profile-edit.css";
import React from 'react'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import SKILL_ENUM from "../../consts/skillEnum"
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";

const EditUserProfile = () => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [userProject, setUserProject] = useState(undefined);
  const { user } = useContext(AuthContext)//this function will give us the user info

  useEffect(() => {
    axios
      .post("http://localhost:5005/profile/", {
        email: user.email
      })
      .then(response => setUserInfo(response.data)).catch((err) => { console.log(err) });
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
    let filterSkillEnum = skillEnum2.filter(item => {
      return (userInfo && !userInfo.skills.includes(item))
    })
    setFilterSkillArr(filterSkillEnum);
  }, [userInfo]);

  useEffect(() => {
    axios
      .get(`http://localhost:5005/profile/addedproject/${user._id}`)
      .then(response => {
        setUserProject(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);

  const handleUserProfileUpdate = async (e) => {
    try {
      e.preventDefault();
      let updatedData = { name, city, country, aboutMe, email: userInfo.email };
      //Updating data to database
      const response = await axios.put("http://localhost:5005/profile/editinfo", updatedData);
      //Fetching data again
      const updatedInfo = await axios.post("http://localhost:5005/profile/", { email: user.email });
      setUserInfo(updatedInfo.data);
    } catch (err) {
      console.log(err);
    }
  }



  const handleAddSkills = async (e, skill) => {
    try {
      e.preventDefault();
      console.log(skill);
      let updatedData = { skill, email: userInfo.email };
      //Updating data to database
      const response = await axios.put("http://localhost:5005/profile/editskill", updatedData);
      //Fetching data again
      const updatedInfo = await axios.post("http://localhost:5005/profile/", { email: user.email });
      setUserInfo(updatedInfo.data);
    } catch (err) {
      console.log(err);
    }

  }

  const handleDeleteSkills = async (e, skill) => {
    try {
      e.preventDefault();
      let updatedData = { skill, email: userInfo.email };
      //Updating data to database
      const response = await axios.put("http://localhost:5005/profile/deleteskill", updatedData);
      //Fetching data again
      const updatedInfo = await axios.post("http://localhost:5005/profile/", { email: user.email });
      setUserInfo(updatedInfo.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteProject = async (e, id) => {
    try {
      e.preventDefault();
      let projectId = id;
      //Updating data to database
      await apiClient.post(`/projects/${projectId}/delete`);
      //Fetching data again
      const updatedProject = await axios.get(`http://localhost:5005/profile/addedproject/${user._id}`);
      setUserProject(updatedProject.data);
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div class="container">
      {userInfo ?
        <>
          {/* Name Field */}
          <form onSubmit={handleUserProfileUpdate}>
            <div className="row">
              <div className="col-25">
                <label>Name:</label>
              </div>
              <div className="col-75">
                <input onChange={handleName} type="text" name="name" defaultValue={userInfo.name} />
              </div>
            </div>

            {/* City */}
            <div className="row">
              <div className="col-25">
                <label>City:</label>
              </div>
              <div className="col-75">
                <input onChange={handleCity} type="text" name="city" defaultValue={userInfo.city} />
              </div>
            </div>

            {/* Country */}
            <div className="row">
              <div className="col-25">
                <label>Country:</label>
              </div>
              <div className="col-75">
                <input onChange={handleCountry} type="text" name="country" defaultValue={userInfo.country} />
              </div>
            </div>

            {/* About me */}
            <div className="row">
              <div className="col-25">
                <label>About me:</label>
              </div>
              <div className="col-75">
                <textarea style={{ height: "150px" }} onChange={handleAboutMe} type="text" name="country" defaultValue={userInfo.aboutMe} />
              </div>
            </div>

            {/* Update (Name,City,Country,AboutMe) Button */}
            <button type="submit">Update</button>
          </form>

          {/* Update Current Skillset */}
          <h2>Update your current skillset:</h2>
          <div className="borderFrame">
            {userInfo && userInfo.skills.map((skill, index) => (
              <div key={index}>
                <span className="currentSkill">{skill}</span>
                <button onClick={(e) => { handleDeleteSkills(e, skill) }}>Delete</button>
              </div>
            ))}
          </div>
          <h2>Add new skills to your profile:</h2>
          {filterSkillArr && filterSkillArr.map((skill) => {
            return <label key={skill}>
              <input onChange={(e) => { handleAddSkills(e, skill) }} type="checkbox" name="lookingFor" value={skill}>
              </input>{skill}</label>
          })}
          {/* Update created Projects */}
          <div>
            <h2>Created projects by you: </h2>
            <div className="borderFrame">
              {userProject && userProject.map((project, index) => (
                <div>
                  <Link to={`/projects/${project._id}`} key={index}>
                    {project.title}
                  </Link>
                  <button onClick={(e) => { handleDeleteProject(e, project._id) }}>Delete</button>
                </div>
              ))}
            </div>
          </div>

        </>
        : <div>noData</div>}
    </div>
  )
}

export default EditUserProfile