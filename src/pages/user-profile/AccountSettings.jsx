import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';


const AccountSettings = () => {
  let navigate = useNavigate();

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
      const res = await apiClient.post("/profile/accountsettings", { email, password });
      if (res.status === 200) {
        localStorage.removeItem("authToken");
        navigate(0)
      }
    } catch (error) {
      console.log(error)
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
      const res = await apiClient.put("/profile/accountsettings", changePass);
      if (res.status === 200) {
        console.log("Success")
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div>AccountSettings</div>

      <h2>Change password</h2>

      <form onSubmit={handleChangePasswordSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={changePass.email} required={true} onChange={handleChangePassword}
        />
        <label>Password:</label>
        <input
          type="password"
          value={changePass.password}
          name="password"
          required={true}
          onChange={handleChangePassword}
        />
        <label>Change Password:</label>
        <input
          onChange={handleChangePassword}
          type="password"
          name="changePassword"
          value={changePass.changePassword}
          required={true}
        />
        <button type="submit">Change Password</button>
      </form>

      <h2>Delete Profile</h2>
      <form onSubmit={handleDeleteProfile}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required={true} />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
        <button type="submit">Delete Profile</button>
      </form>
    </>
  )
}

export default AccountSettings