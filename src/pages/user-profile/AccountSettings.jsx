import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';


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
      const errorDescription = err.response.data.message;
      setErrorMessage(errorDescription)
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  )
}

export default AccountSettings