import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import SKILL_ENUM from "../../consts/skillEnum"

function SignupPage() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [skillArr, setSkillArr] = useState([])
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleAboutMe = (e) => setAboutMe(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name, city, country, aboutMe, skillArr };
    console.log(requestBody)

    // Send a request to the server using axios

    // const authToken = localStorage.getItem("authToken");
    // axios.post(
    //   `${process.env.REACT_APP_SERVER_URL}/auth/signup`, 
    //   requestBody, 
    //   { headers: { Authorization: `Bearer ${authToken}` },
    // })
    // .then((response) => {})


    // Or using a service
      authService
        .signup(requestBody)
        .then((response) => {
          // If the POST request is successful redirect to the login page
          navigate("/login");
        })
        .catch((error) => {
          // If the request resolves with an error, set the error message in the state
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        });
  };


  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    console.log(value)
    if (checked) {
      setSkillArr((prev) => {
        return [...prev,value] //receiving the previous state value (adding skills to prev state)
      })
    }
    else {
      setSkillArr(skillArr.filter((skill) => { 
        return skill !== value //unchecked skills delete from setSkillArr state
      }))
    }
  }
  console.log(skillArr)



  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={handleEmail} />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={handleName} />

        <label>City:</label>
        <input type="text" name="city" value={city} onChange={handleCity} />


        <label>Country:</label>
        <input type="text" name="country" value={country} onChange={handleCountry} />

        <label>About me:</label>
        <input type="text" name="country" value={aboutMe} onChange={handleAboutMe} />

        <label>What kind of musician are you?</label>
        {SKILL_ENUM.map((skill) => {
          return <label key={skill}><input onChange={handleCheckboxChange} type="checkbox" name="lookingFor" value={skill}></input>{skill}</label>
        })}

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
}

export default SignupPage;
