import React from 'react';
import UserSkillProjectSample from './UserSkillProjectSample';

const UserInfo = ({ userInfo, userProject, userSample }) => {
  return (
    <div class="container">
      <div class="profile-header">
        <div class="profile-img">
          {userInfo.avatar ?
            <img src={userInfo.avatar} alt="avatar" width="250px" height="250px" />
            : <img src="https://i.stack.imgur.com/frlIf.png" alt="avatar" width="250px" height="250px" />}
        </div>
        <div class="profile-nav-info">
          <h3 class="user-name">{userInfo.name}</h3>
          <div class="address">
            <p id="state" class="state">{userInfo.city},</p>
            <span id="country" class="country">{userInfo.country}.</span>
          </div>
        </div>
        <div class="profile-option">
          <div class="notification">
            <i class="fa fa-bell"></i>
            <span class="alert-message">3</span>
          </div>
        </div>
      </div>
      <div class="main-bd">
        <div class="left-side">
          <div class="profile-side">
            <p class="mobile-no"><i class="fa fa-phone"></i> placeholder</p>
            <p class="user-mail"><i class="fa fa-envelope"></i> {userInfo.email}</p>
            <div class="user-bio">
              <h3> About me</h3>
              <p class="bio">
                {userInfo.aboutMe}
              </p>
            </div>
            <div class="user-rating">
              <h3 class="rating">ph</h3>
              <div class="rate">
                <div class="star-outer">
                  <div class="star-inner">
                  </div>
                </div>
                <span class="no-of-user-rate"></span><span>placeholder</span><span>&nbsp;&nbsp;placeholer</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-side">
          <UserSkillProjectSample skills={userInfo.skills} projects={userProject} samples={userSample} />
        </div>
      </div>
    </div >
  )
}

export default UserInfo