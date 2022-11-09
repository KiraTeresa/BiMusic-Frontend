import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import logouticon from '../../assets/icons/shutdown.png'
import bimusicicon from '../../assets/icons/bimusiclogo2.png'

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav className="shift">
      <Link to="/"><img className="bimusicicon2" src={bimusicicon} alt="musicicon" /></Link>

      <ul>

      {isLoggedIn && (
        <>


<li>
<Link to={`/profile/${user.name}`}>Profile</Link>
          </li>

          <li>
          <Link to="/projects">Projects</Link>
          </li>

  
          <li>
          <Link to="/samples">Samples</Link>
          </li>

          <li>
          <Link to="/chats">Chat</Link>
          </li>

        <li>
          <Link onClick={logOutUser}> <img className="logouticon" src={logouticon} alt="logout icon" /></Link>
          </li>
          {/* <span>{user && user.name}</span> */}
        </>
      )}

      {!isLoggedIn && (
        <>
         <li>
          <Link to="/signup">
            {" "}Sign Up{" "}</Link>
            </li>
            <li>
          <Link to="/login">
            {" "}Login{" "}
          </Link>
          </li>
        </>
      )}
      </ul>
    </nav>
  );
}

export default Navbar;
