import "./user-profile-edit.css";
import React from 'react'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import SKILL_ENUM from "../../consts/skillEnum"
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from "../../components/Loading/Loading";

const EditUserProfile = () => {
  const { user } = useContext(AuthContext)//this function will give us the user info

  const [userInfo, setUserInfo] = useState(undefined);
  const [userProject, setUserProject] = useState(undefined);
  const [userAvatar, setUserAvatar] = useState(undefined);
  const [countries, setCountries] = useState(undefined);
  const [cities, setCities] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false)
  const [city, setCity] = useState(userInfo && userInfo.city);
  const [country, setCountry] = useState(userInfo && userInfo.country);
  const [name, setName] = useState(userInfo && userInfo.name);
  const [aboutMe, setAboutMe] = useState(userInfo && userInfo.aboutMe);
  // const [skillArr, setSkillArr] = useState([])
  const [filterSkillArr, setFilterSkillArr] = useState([])
  // const [errorMessage, setErrorMessage] = useState(undefined);

  const handleName = (e) => setName(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleAboutMe = (e) => setAboutMe(e.target.value);
  const handleCountry = (e) => {
    setCountry(e.target.value);
    const findCountry = countries.find((el) => {
      return el.country === e.target.value
    });
    if (findCountry) {
      setCities(findCountry.cities);
    }
  };

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
      console.log(response)
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
      formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      setIsLoading(true);
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, formData);
      const avatarData = { avatar: response.data.url, cloudinary_id: response.data.public_id, email: userInfo.email }
      const uploadedAvatar = await apiClient.put("/profile/uploadavatar", avatarData)
      //Fetching data again
      const updatedInfo = await apiClient.post("/profile/", { email: user.email });
      if (updatedInfo.status === 200) {
        setIsLoading(false);
        setUserInfo(updatedInfo.data);
      }
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

  //----------------------------Sample Projects--------------------------------//
  const [userSample, setUserSample] = useState([]);
  useEffect(() => {
    apiClient.get(`/samples/${user._id}`)
      .then(response => {
        console.log(response);
        setUserSample(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);
  const handleDeleteSample = async (e, id) => {
    try {
      e.preventDefault();
      //Updating data to database
      const result = await apiClient.delete(`/samples/${id}`);
      console.log(result);
      //Fetching data again
      const updatedSample = await apiClient.get(`/samples/${user._id}`);
      setUserSample(updatedSample.data);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>

      {userInfo ?
        <div>

<div className="container">
     {/* Upload/Update profile picture */}
     {isLoading ? <Loading /> :
            <div>
              <img src={userInfo && userInfo.avatar} alt="avatar" width={"200px"} />
            </div>
          }
          <form onSubmit={handleAvatarUpdate}>
            <input  type="file" onChange={(e) => setUserAvatar(e.target.files[0])} />
            <input value="Upload file" type="submit" />
          </form>
          </div>



          <div className="container">

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
            <select name="country" onChange={handleCountry}>
              <option value={userInfo.country}> -- {userInfo.country} -- </option>
              {countries ? countries.map((element, index) => {
                return <option key={index} value={element.country}>{element.country}</option>
              }) : <option >Select a country</option>}
            </select>
              </div>
              </div>

            {/* City */}
            <div className="row">
              <div className="col-25">
                <label>City:</label>
              </div>
              <div className="col-75">
                <select name="city" onChange={handleCity}>
              <option value={userInfo.city}> -- {userInfo.city} -- </option>
              {cities && cities.map((element, index) => {
                return <option key={index} value={element}>{element}</option>
              })}
            </select>
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
            <button type="submit">Save Changes</button>
          </form>
          </div>


 
          <div className="container">
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
   </div>




          {/* Update created Projects */}
          <div>
            <h2>Created projects by you: </h2>
            <div className="borderFrame">
              {userProject && userProject.map((project, index) => (
                <div key={index}>
                  <Link to={`/projects/${project._id}`}>
                    {project.title}
                  </Link>
                  <button onClick={(e) => { handleDeleteProject(e, project._id) }}>Delete</button>
                </div>
              ))}
            </div>
          </div>




          {/* Delete Sample from Profile */}
          <div>
            <h2>Uploaded Samples by you: </h2>
            <div className="borderFrame">
              {userSample && userSample.map((sample, index) => (
                <div key={index}>
                  <a href={sample.link} target="_blank">
                    {sample.title}
                  </a>
                  <button onClick={(e) => { handleDeleteSample(e, sample._id) }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
          <div />
        </div>
        : <div>noData</div>}
    </div>
  )
}

export default EditUserProfile