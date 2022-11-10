import { React, useState, useEffect, useContext } from 'react';
import UserSkillProjectSample from './UserSkillProjectSample';
import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate } from 'react-router-dom';
import apiClient from "../../services/apiClient";

const UserInfo = ({ userInfo }) => {
  const { user } = useContext(AuthContext)
  const [allUnreadMessages, setAllUnreadMessages] = useState([])
  const isOwnProfile = (userInfo.name === user.name)
  const navigate = useNavigate();

  // get num of all unread messages for this user
  useEffect(() => {
    apiClient.get('/message/unread').then((result) => {
      setAllUnreadMessages(result.data)
    }).catch((err) => {
      if (err.response.status === 500) {
        navigate('/internal-server-error')
      } else {
        console.log(err)
      }
    })
  }, [])

  return (
    <div className="container">
      <div className="profile-header">
        <div className="profile-img">
          <img src={userInfo.avatar} alt="avatar" width="250px" height="250px" />
        </div>
        <div className="profile-nav-info">
          <h3 className="user-name">{userInfo.name}</h3>
          <div className="address">
            <p id="state" className="state">{userInfo.city},</p>
            <span id="country" className="country">{userInfo.country}.</span>
          </div>
        </div>
        {
          isOwnProfile ?
            <Link to="/chats" className="profile-option">
              <div className="notification">
                <i className="fa fa-bell"></i>
                <span className="alert-message">{allUnreadMessages.length}</span>
              </div>
            </Link> : ""
        }
      </div>
      <div className="main-bd">
        <div className="left-side">
          <div className="profile-side">
            {/* <p className="mobile-no"><i className="fa fa-phone"></i> placeholder</p> */}
            {/* <p className="user-mail"><i className="fa fa-envelope"></i> {userInfo.email}</p> */}
            <div className="user-bio">
              <h3> About me</h3>
              <p className="bio">
                {userInfo.aboutMe}
              </p>
            </div>

            <div className="user-rating">
              <h3 className="rating">My skills</h3>
              <div className="rate">
                {/* <div className="star-outer">
                  <div className="star-inner">
                  </div>
                </div> */}
                <span className="no-of-user-rate"></span>
                {userInfo.skills.map((skill) => {
                  return <li>{skill}</li>
                })}
                {/* <span>placeholder</span>
                <span>&nbsp;&nbsp;placeholer</span> */}
              </div>
            </div>

            {
              isOwnProfile ?
                <div className="profile-btn">
                  <Link to='/profile/edit'><button className="btn primary" id="chatBtn">Edit profile</button></Link>
                  <Link to='/account-settings'>
                    <p>Account Settings</p>
                  </Link>
                </div> : ""
            }

          </div>
        </div>
        <div className="right-side">
          <UserSkillProjectSample projects={userInfo.ownProjects} samples={userInfo.samples} collabProjects={userInfo.collabProjects} />
        </div>
      </div>
    </div >
  )
}

export default UserInfo