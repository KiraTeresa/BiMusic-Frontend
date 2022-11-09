import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import "./account-settings.scss";


const AccountSettings = () => {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [changePass, setChangePass] = useState({
    email: "",
    password: "",
    changePassword: ""
  })

  const handleDeleteProfile = async (e) => {
    try {
      e.preventDefault();
      console.log("E + P ", email, password)
      const res = await apiClient.post("/user", { email, password });
      if (res.status === 200) {
        localStorage.removeItem("authToken");
        navigate(0)
      }
    } catch (err) {
      if (err.response.status === 500) {
        navigate('/internal-server-error')
      } else {
        const errorDescription = err.response.data.message;
        setErrorMessage(errorDescription)
      }
    }
  }

  const handleChangePassword = async (e) => {
    setChangePass((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleChangePasswordSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await apiClient.put("/user", changePass);
      if (res.status === 200) {
        console.log("Success")
      }
    } catch (err) {
      const errorDescription = err.response.data.message;
      setErrorMessage(errorDescription)
    }
  }
  return (
    <div className="account-settings-container">
      AccountSettings


{/* Change Password */}

      <div className="parent-change-password-delete-profile">

      <div className="container-grid-change-pw-delete-account">
        
      <h2 className="title-account-settings">Change password</h2>
      <form onSubmit={handleChangePasswordSubmit}>
      <div className="row">
      <div className="col-25">
        <label className='highlight hoverSOmething'>Email:</label>
        </div>
        <div className="col-75">
        <input className="account-settings-un-input" type="email" name="email" value={changePass.email} required={true} onChange={handleChangePassword}
        />
         </div>
         </div>



         <div className="row">
          <div className="col-25">
        <label>Password:</label>
        </div>
        <div className="col-75">
        <input className="account-settings-un-input"
          type="password"
          value={changePass.password}
          name="password"
          required={true}
          onChange={handleChangePassword}
        />
        </div>
        </div>

        <div className="row">
        <div className="col-25">
        <label>New Password:</label>
        </div>
        <div className="col-75">
        <input className="account-settings-un-input"
          onChange={handleChangePassword}
          type="password"
          name="changePassword"
          value={changePass.changePassword}
          required={true}
        />
         </div>
         </div>
        <button className='account-settings-submit-button' type="submit">Change Password</button>
      </form>
      </div>

      <div className="container-grid-change-pw-delete-account">

{/* Delete Profile */}
<h2 className="title-account-settings">Delete Profile</h2>
      <form onSubmit={handleDeleteProfile}>

      <div className="row">
        <div className="col-25">
        <label>Email:</label>
        </div>
        <div className="col-75">
        <input className="account-settings-un-input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required={true} />
        </div>
        </div>


        <div className="row">
        <div className="col-25">
        <label>Password:</label>
        </div>
        <div className="col-75">
        <input className="account-settings-un-input"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
        </div>
         </div>

         <h6 class="warning_delete_user"> ⚠ By deleting your account, you will no longer be able to sign in, your activity will be removed from the Bi-Music platform and your username might be claimed by another user!</h6> 

        <button type="submit">Delete Profile</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>




      </div>
    </div>
  )
}

export default AccountSettings