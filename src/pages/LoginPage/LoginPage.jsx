import "./LoginPage.scss";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    // Send a request to the server using axios
    /* 
    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`)
      .then((response) => {})
    */

    // Or using a service
    authService
      .login(requestBody)
      .then((response) => {
        // If the POST request is successful store the authentication token,
        // after the token is stored authenticate the user
        // and at last navigate to the home page
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div id="mainwraplogin">
      <div className='gradient'></div>
      <p className="login-title" align="center">Login</p>

      <form onSubmit={handleLoginSubmit}>

        <div className="login-row">
          <div className="login-col-25">
            <label className="login-title-labels">Email:</label>
          </div>
          <input className="login-input-field" type="email" name="email" value={email} onChange={handleEmail} />
        </div>



        <div className="login-col-25">
          <label className="login-title-labels">Password:</label>
        </div>
        <input className="login-input-field"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <p><button className="btn primary" type="submit">LOGIN</button></p>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Don't have an account yet?</p>
      <Link to={"/signup"}> Sign Up here <span className="emojis">👈</span></Link>
    </div>
  );
}

export default LoginPage;

