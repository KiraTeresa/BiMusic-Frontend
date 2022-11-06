import "./SignupPage.scss";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import SKILL_ENUM from "../../consts/skillEnum"
import axios from "axios";
import Loading from "../../components/Loading/Loading";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [skillArr, setSkillArr] = useState([])
  const [countries, setCountries] = useState(undefined);
  const [cities, setCities] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setUserName(e.target.value.toLowerCase());
  const handleCity = (e) => setCity(e.target.value);
  const handleAboutMe = (e) => setAboutMe(e.target.value);
  const handleCountry = (e) => {
    setCountry(e.target.value);
    const findCountry = countries.find((el) => {
      return el.country === e.target.value
    });
    if (findCountry) {
      // console.log("Here", findCountry.cities);
      setCities(findCountry.cities);
    } else {
      setCities("")
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, username, city, country, aboutMe, skillArr };
    // console.log("RequestBody: ", requestBody)

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
    // console.log("handle checkbox change: ", value)
    if (checked) {
      setSkillArr((prev) => {
        return [...prev, value] //receiving the previous state value (adding skills to prev state)
      })
    }
    else {
      setSkillArr(skillArr.filter((skill) => {
        return skill !== value //unchecked skills delete from setSkillArr state
      }))
    }
  }
  // console.log("Skill array: ", skillArr)


  useEffect(() => {
    axios
      .get(`https://countriesnow.space/api/v0.1/countries`)
      .then(response => {
        const resArray = response.data.data;
        setCountries(resArray);
        setErrorMessage(undefined)
      }
      ).catch((err) => { console.log(err); }).finally(() => setIsLoading(false));
  }, [])

  if (isLoading) {
    return <Loading />
  }

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

        <label>Username:</label>
        <input type="text" name="username" value={username} onChange={handleName} placeholder="Choose a username" />




        <label>Where do you live?</label>
        <select name="country" onChange={handleCountry}>
          <option value=""> -- Select the country --</option>
          {countries.map((element, index) => {
            return <option key={index} value={element.country}>{element.country}</option>
          })}
        </select>



        <label>Pick the city closest to you</label>
        <select name="city" onChange={handleCity} disabled={!country}>
          <option value="">-- Select the city --</option>
          {cities && cities.map((element, index) => {
            return <option key={index} value={element}>{element}</option>
          })}
        </select>




        <label>Tell a little bit about yourself:</label>
        <input type="text" name="country" value={aboutMe} onChange={handleAboutMe} placeholder="What inspires you? What drives you?..." />

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
