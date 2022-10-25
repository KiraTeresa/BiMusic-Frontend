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
  const [userAvatar, setUserAvatar] = useState(undefined);
  const [countries, setCountries] = useState(undefined);
  const [cities, setCities] = useState(undefined);
  const { user } = useContext(AuthContext)//this function will give us the user info

  const [city, setCity] = useState(userInfo && userInfo.city);
  const [country, setCountry] = useState(userInfo && userInfo.country);
  const [name, setName] = useState(userInfo && userInfo.name);
  const [aboutMe, setAboutMe] = useState(userInfo && userInfo.aboutMe);
  const [skillArr, setSkillArr] = useState([])
  const [filterSkillArr, setFilterSkillArr] = useState([])
  const [errorMessage, setErrorMessage] = useState(undefined);

  const handleName = (e) => setName(e.target.value);

  const handleCity = (e) => {
    console.log(e.target.value);
    setCity(e.target.value)
  };

  const handleAboutMe = (e) => setAboutMe(e.target.value);

  const handleCountry = (e) => {
    setCountry(e.target.value);
    const findCountry = countries.find((el) => {
      return el.country === e.target.value
    });
    if (findCountry) {
      console.log(findCountry.cities);
      setCities(findCountry.cities);
    }
  };
  console.log(cities);

  useEffect(() => {
    let skillEnum2 = [...SKILL_ENUM];
    let filterSkillEnum = skillEnum2.filter(item => {
      return (userInfo && !userInfo.skills.includes(item))
    })
    setFilterSkillArr(filterSkillEnum);
  }, [userInfo]);

  useEffect(() => {
    apiClient
      .get(`/profile/addedproject/${user._id}`)
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
      const response = await apiClient.put("/profile/editinfo", updatedData);
      //Fetching data again
      const updatedInfo = await apiClient.post("/profile/", { email: user.email });
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
      const response = await apiClient.put("/profile/editskill", updatedData);
      //Fetching data again
      const updatedInfo = await apiClient.post("/profile/", { email: user.email });
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
      const response = await apiClient.put("/profile/deleteskill", updatedData);
      //Fetching data again
      const updatedInfo = await apiClient.post("/profile/", { email: user.email });
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
      const updatedProject = await apiClient.get(`/profile/addedproject/${user._id}`);
      setUserProject(updatedProject.data);
    } catch (error) {
      console.log(error)
    }
  }

  const handleAvatarUpdate = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", userAvatar);
      formData.append("upload_preset", "BiMusic")
      const response = await axios.post(`https://api.cloudinary.com/v1_1/da02iubhb/image/upload`, formData);
      const avatarData = { avatar: response.data.url, cloudinary_id: response.data.public_id, email: userInfo.email }
      const uploadedAvatar = await apiClient.put("/profile/uploadavatar", avatarData)
      //Fetching data again
      const updatedInfo = await apiClient.post("/profile/", { email: user.email });
      setUserInfo(updatedInfo.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    axios
      .get(`https://countriesnow.space/api/v0.1/countries`)
      .then(response => {
        const resArray = response.data.data;
        setCountries(resArray);
      }
      ).catch((err) => { console.log(err); })
  }, [])

  useEffect(() => {
    apiClient
      .post("/profile/", {
        email: user.email
      })
      .then(response => setUserInfo(response.data)).catch((err) => { console.log(err) });
  }, []);

  return (
    <div className="container">
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

            {/* Country */}
            <div className="row">
              <div className="col-25">
                <label>Country:</label>
              </div>
              <div className="col-75">
                {/* <input onChange={handleCountry} type="text" name="country" defaultValue={userInfo.country} /> */}
              </div>
            </div>

            <label>-- Select the country --</label>
            <select name="country" onChange={handleCountry}>
              <option value={userInfo.country}> -- {userInfo.country} -- </option>
              {countries ? countries.map((element, index) => {
                return <option key={index} value={element.country}>{element.country}</option>
              }) : <option >Select a country</option>}
            </select>

            {/* City */}
            <div className="row">
              <div className="col-25">
                <label>City:</label>
              </div>
              <div className="col-75">
                {/* <input onChange={handleCity} type="text" name="city" defaultValue={userInfo.city} /> */}
              </div>
            </div>

            <label>-- Select the city --</label>
            <select name="city" onChange={handleCity}>
              <option value={userInfo.city}> -- {userInfo.city} -- </option>
              {cities && cities.map((element, index) => {
                return <option key={index} value={element}>{element}</option>
              })}
            </select>

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
          <div>
            <img src={userInfo && userInfo.avatar} alt="avatar" width={"300px"} />
          </div>
          <form onSubmit={handleAvatarUpdate}>
            <input type="file" onChange={(e) => setUserAvatar(e.target.files[0])} />
            <input type="submit" />
          </form>

        </>
        : <div>noData</div>}
    </div>
  )
}

export default EditUserProfile