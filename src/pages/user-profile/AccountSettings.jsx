import React, { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';


const AccountSettings = () => {
  let navigate=useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await apiClient.post("/profile/accountsettings", { email, password });
      if(res.status===200){
        localStorage.removeItem("authToken");
        navigate(0)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <div>AccountSettings</div>
      <form onSubmit={handleSubmit}>
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