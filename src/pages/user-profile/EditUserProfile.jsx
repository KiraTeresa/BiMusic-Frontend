import "./user-profile-edit.scss";
import React from 'react'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import SKILL_ENUM from "../../consts/skillEnum"
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from "../../components/Loading/Loading";

const EditUserProfile = () => {
  const { storeToken, authenticateUser, user } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState(undefined);
  const [userSample, setUserSample] = useState([]);
  const [userProject, setUserProject] = useState(undefined);

  const [userAvatar, setUserAvatar] = useState(undefined);
  const [countries, setCountries] = useState(undefined);
  const [cities, setCities] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false)
  const [city, setCity] = useState(userInfo && userInfo.city);
  const [country, setCountry] = useState(userInfo && userInfo.country);
  const [name, setName] = useState(userInfo && userInfo.name);
  const [aboutMe, setAboutMe] = useState(userInfo && userInfo.aboutMe);

  const [filterSkillArr, setFilterSkillArr] = useState([])
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate()

  const handleName = (e) => setName(e.target.value.toLowerCase());
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
      .get(`/profile/${user.name}`)
      .then((response) => {
        // console.log(response.data);
        const { samples, ownProjects } = response.data
        setUserInfo(response.data)
        setUserSample(samples)
        setUserProject(ownProjects)
        setName(response.data.name)
      }).catch((err) => {
        if (err.response.status === 400) {
          navigate('/')
        } else if (err.response.status === 500) {
          navigate('/internal-server-error')
        } else {
          console.log(err)
        }
      });
  }, [user.name, navigate]);

  useEffect(() => {
    let skillEnum2 = [...SKILL_ENUM];
    let filterSkillEnum = skillEnum2.filter(item => {
      return (userInfo && !userInfo.skills.includes(item))
    })
    setFilterSkillArr(filterSkillEnum);
  }, [userInfo]);

  const handleUserProfileUpdate = async (e) => {
    try {
      e.preventDefault();
      let updatedData = { name: name.toLowerCase(), city, country, aboutMe, email: userInfo.email };
      //Updating data to database
      await apiClient.put("/profile/editinfo", updatedData).then((response) => {
        // console.log("Response token?? --> ", response.data)
        const { authToken, user: updatedUser } = response.data
        storeToken(authToken);
        authenticateUser();
        navigate(`/profile/${updatedUser.name}`)
      });
    } catch (err) {
      if (err.response.status === 500) {
        navigate('/internal-server-error')
      } else {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      }
    }
  }

  const handleAddSkills = async (e, skill) => {
    try {
      e.preventDefault();
      // console.log(skill);
      let updatedData = { skill, email: userInfo.email };
      //Updating data to database
      const response = await apiClient.put("/profile/editskill", updatedData);
      //Fetching data again
      const updatedInfo = await apiClient.get(`/profile/${response.data.name}`);
      setUserInfo(updatedInfo.data);
    } catch (err) {
      if (err.response.status === 500) {
        navigate('/internal-server-error')
      } else {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      }
    }

  }

  const handleDeleteSkills = async (e, skill) => {
    try {
      e.preventDefault();
      let updatedData = { skill, email: userInfo.email };
      //Updating data to database
      const response = await apiClient.put("/profile/deleteskill", updatedData);
      // console.log("Updated skill: ", response)
      //Fetching data again
      const updatedInfo = await apiClient.get(`/profile/${response.data.name}`);
      setUserInfo(updatedInfo.data);
    } catch (err) {
      if (err.response.status === 500) {
        navigate('/internal-server-error')
      } else {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      }
    }
  }

  const handleDeleteProject = async (e, id) => {
    try {
      e.preventDefault();
      let projectId = id;
      // console.log("Clicked.......", id);
      //Updating data to database
      await apiClient.post(`/projects/${projectId}/delete`);
      // console.log(result);
      // //Fetching data again
      // const updatedProject = await apiClient.get(`/profile/addedproject/${user._id}`);
      // setUserProject(updatedProject.data);
      navigate(`/profile/${user.name}`)
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
      await apiClient.put("/profile/uploadavatar", avatarData)
      //Fetching data again
      const updatedInfo = await apiClient.get(`/profile/${user.name}`);
      if (updatedInfo.status === 200) {
        setIsLoading(false);
        // setUserInfo(updatedInfo.data);
        navigate(`/profile/${user.name}`)
      }
    } catch (err) {
      if (err.response.status === 500) {
        navigate('/internal-server-error')
      } else {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      }
    }
  }

  //----------------------------Sample Projects--------------------------------//
  const handleDeleteSample = async (e, id) => {
    try {
      e.preventDefault();
      //Updating data to database
      await apiClient.delete(`/samples/${id}`);
      // console.log(result);
      // //Fetching data again
      // const updatedSample = await apiClient.get(`/samples/${user._id}`);
      // setUserSample(updatedSample.data);
      navigate(`/profile/${user.name}`)
    } catch (err) {
      if (err.response.status === 500) {
        navigate('/internal-server-error')
      } else {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription);
      }
    }
  }

  return (
    <div className="user-profile-edit-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {userInfo ?
        <>
          <div className="parent-proj-samp">
            <div className="container-grid">
              <h3>Upload profile picture</h3>
              {/* Upload/Update profile picture */}
              {isLoading ? <Loading /> :
                <div>
                  <img src={userInfo && userInfo.avatar} alt="avatar" width={"200px"} />
                </div>
              }
              <form onSubmit={handleAvatarUpdate}>
                <input type="file" onChange={(e) => setUserAvatar(e.target.files[0])} />
                <div className="upload-file-btn">
                  <input className="btn primary" value="Upload file" type="submit" />
                </div>
              </form>
            </div>

            <div className="container-grid">
              {/* Name Field */}
              <h3>Personal Information</h3>
              <form onSubmit={handleUserProfileUpdate}>
                <div className="row">
                  <div className="col-25">
                    <label>Name:</label>
                  </div>
                  <div className="col-75">
                    <input onChange={handleName} type="text" name="name" value={name} />
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
                    <select className="city" onChange={handleCity}>
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
                    <textarea style={{ height: "100px" }} onChange={handleAboutMe} type="text" className="country" defaultValue={userInfo.aboutMe} />
                  </div>
                </div>

                {/* Update (Name,City,Country,AboutMe) Button */}
                <button className="btn primary" type="submit">Save Changes</button>
              </form>
            </div>
          </div>


          <div className="container-skillset">
            {/* Update Current Skillset */}
            <h3>Edit skillset:</h3>
            <div className="borderFrame">
              {userInfo && userInfo.skills.map((skill, index) => (
                <div className="skills" onClick={(e) => { handleDeleteSkills(e, skill) }} key={index}>
                  <span className="currentSkill">{skill}</span>
                  <button className="cross-stand-alone" ></button>
                </div>
              ))}
            </div>
            <div className="container-newskill">
              <h3>Add new skills:</h3>
              {filterSkillArr && filterSkillArr.map((skill) => {
                return <label key={skill}>
                  <input onChange={(e) => { handleAddSkills(e, skill) }} type="checkbox" className="lookingFor" value={skill}>
                  </input>{skill}</label>
              })}
            </div>
          </div>


          <div className="parent-proj-samp">
            {/* Update created Projects */}
            <div className="container-grid">
              <h3>Created projects: </h3>
              <div className="borderFrame">
                {userProject && userProject.map((project, index) => (
                  <div key={index}>
                    <Link to={`/projects/${project._id}`}>
                      {project.title}
                    </Link>
                    <button className="cross-stand-alone" onClick={(e) => { handleDeleteProject(e, project._id) }} disabled={!userProject}></button>
                  </div>
                ))}
              </div>
            </div>
            {/* Delete Sample from Profile */}
            <div className="container-grid">
              <h3>Uploaded Samples:</h3>
              <div className="borderFrame">
                {userSample && userSample.map((sample, index) => (
                  <div key={index}>
                    <Link to={`/samples/sample/${sample._id}`}>
                      {sample.title}
                    </Link>
                    <button className="cross-stand-alone" onClick={(e) => { handleDeleteSample(e, sample._id) }} disabled={!userSample}></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
        : <div>noData</div>}
    </div>
  )
}

export default EditUserProfile