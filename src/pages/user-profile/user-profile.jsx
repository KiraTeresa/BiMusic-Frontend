import "./user-profile.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import apiClient from '../../services/apiClient';
import { Link } from "react-router-dom";
import UserInfo from "../../components/UserProfile/UserInfo";

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [userProject, setUserProject] = useState(null);
  const [userSample, setUserSample] = useState([]);
  const { user } = useContext(AuthContext)//this function will give us the user info

  useEffect(() => {
    apiClient.post("/profile", {
      email: user.email
    })
      .then(response => {
        setUserInfo(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, [user.email]);

  useEffect(() => {
    apiClient
      .get(`/profile/addedproject/${user._id}`)
      .then(response => {
        setUserProject(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, [user._id]);

  useEffect(() => {
    apiClient.get(`/samples/${user._id}`)
      .then(response => {
        setUserSample(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, [user._id]);

  return (
    <div>
      {
        userInfo &&
        <UserInfo userInfo={userInfo} userProject={userProject} userSample={userSample} />
      }
      <div className="profile-btn">
        <Link to='/editprofile'><button className="chatbtn" id="chatBtn">Profile</button></Link>
        <Link to='/account-settings'><button className="createbtn" id="Create-post"> Account Settings</button></Link>
      </div>
    </div >
  );
}

export default ProfilePage;
