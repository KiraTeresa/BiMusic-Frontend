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
  <div className="mainwrap-signup">
   <p className="signup-title" align="center">Sign up</p>

      <form onSubmit={handleSignupSubmit}>
      <div className="signup-row">
        <div className="sign-col-25">
        <label>Email:</label>
        </div>
        <input className="signup-input-field" type="email" name="email" value={email} onChange={handleEmail} />
        </div>


        <div className="signup-row">
        <div className="sign-col-25">
        <label>Choose Password:</label>
        </div>
        <input
        className="signup-input-field"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
         </div>

        <div className="signup-row">
        <div className="sign-col-25">
        <label>Username:</label>
        </div>
        <input className="signup-input-field" type="text" name="username" value={username} onChange={handleName} placeholder="Choose a username" />
        </div>


        <div className="signup-row">
        <div className="sign-col-25">
        <label>Where do you live?</label>
        </div>
        <select className="signup-input-field" name="country" onChange={handleCountry}>
          <option value=""> Select the country</option>
          {countries.map((element, index) => {
            return <option key={index} value={element.country}>{element.country}</option>
          })}
        </select>
        </div>

        <div className="signup-row">
        <div className="sign-col-25">
        <label>Pick the city closest to you</label>
        </div>
        <select className="signup-input-field" name="city" onChange={handleCity} disabled={!country}>
          <option value="">Select the city</option>
          {cities && cities.map((element, index) => {
            return <option key={index} value={element}>{element}</option>
          })}
        </select>
        </div>



        <div className="signup-row">
        <div className="sign-col-25">
        <label>Tell a little bit about yourself:</label>
        </div>
        <textarea className="signup-input-field" type="text" name="country" value={aboutMe} onChange={handleAboutMe} placeholder="What inspires you? What drives you?..." />
        </div>

        <div className="signup-row">
        <div className="sign-col-25">
        <label className="label-title">What kind of musician are you?</label>
        </div>
        <div className="signup-checkbox-genres-wrapper">
        {SKILL_ENUM.map((skill) => {
          return <label key={skill}><input id="checkbox-rect1" onChange={handleCheckboxChange} type="checkbox" name="lookingFor" value={skill}></input>{skill}</label>
        })}
         </div>
         </div>
    


        <button className="loginbtn" type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Log in here <span className="emojis">👈</span></Link>
    </div>
  );
}

export default SignupPage;
