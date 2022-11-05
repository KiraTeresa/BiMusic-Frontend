import "./user-profile.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import apiClient from '../../services/apiClient';
import { Link, useParams } from "react-router-dom";
import UserInfo from "../../components/UserProfile/UserInfo";

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useContext(AuthContext)//this function will give us the user info
  const { username } = useParams()
  const isOwnProfile = (username === user.name)
  console.log("Boolean: ", isOwnProfile)

  useEffect(() => {
    apiClient.get(`/profile/${username}`)
      .then(response => {
        console.log("RES: ", response)
        setUserInfo(response.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, [username]);

  return (
    <div>
      {
        userInfo &&
        // <UserInfo userInfo={userInfo} userProject={userProject} userSample={userSample} userCollabProject={userCollabProject}/>
        <UserInfo userInfo={userInfo} />
      }
      {
        isOwnProfile ?
          <div className="profile-btn">
            <Link to='/profile/edit'><button className="chatbtn" id="chatBtn">Profile</button></Link>
            <Link to='/account-settings'><button className="createbtn" id="Create-post"> Account Settings</button></Link>
          </div> : ""
      }
    </div >
  );
}

export default ProfilePage;
