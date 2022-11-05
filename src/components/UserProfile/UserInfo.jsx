import React from 'react';
import UserSkillProjectSample from './UserSkillProjectSample';

const UserInfo = ({ userInfo }) => {

  return (
    <div className="container">
      <div className="profile-header">
        <div className="profile-img">
          {userInfo.avatar ?
            <img src={userInfo.avatar} alt="avatar" width="250px" height="250px" />
            : <img src="https://i.stack.imgur.com/frlIf.png" alt="avatar" width="250px" height="250px" />}
        </div>
        <div className="profile-nav-info">
          <h3 className="user-name">{userInfo.name}</h3>
          <div className="address">
            <p id="state" className="state">{userInfo.city},</p>
            <span id="country" className="country">{userInfo.country}.</span>
          </div>
        </div>
        <div className="profile-option">
          <div className="notification">
            <i className="fa fa-bell"></i>
            <span className="alert-message">3</span>
          </div>
        </div>
      </div>
      <div className="main-bd">
        <div className="left-side">
          <div className="profile-side">
            <p className="mobile-no"><i className="fa fa-phone"></i> placeholder</p>
            <p className="user-mail"><i className="fa fa-envelope"></i> {userInfo.email}</p>
            <div className="user-bio">
              <h3> About me</h3>
              <p className="bio">
                {userInfo.aboutMe}
              </p>
            </div>
            <div className="user-rating">
              <h3 className="rating">ph</h3>
              <div className="rate">
                <div className="star-outer">
                  <div className="star-inner">
                  </div>
                </div>
                <span className="no-of-user-rate"></span><span>placeholder</span><span>&nbsp;&nbsp;placeholer</span>
              </div>
            </div>
          </div>
        </div>
        <div className="right-side">
          <UserSkillProjectSample skills={userInfo.skills} projects={userInfo.ownProjects} samples={userInfo.samples} />
        </div>
      </div>
    </div >
  )
}

export default UserInfo