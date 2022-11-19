import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import logouticon from '../../assets/icons/logout-white.png'
// import bimusicicon from '../../assets/icons/BIMUSIC-logo-purple.png'
import bimusicicon from '../../assets/icons/BIMUSIC-logo-turquoise.png'
import burgerIcon from '../../assets/icons/burger-menu-circle.png'
import { useEffect } from "react";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const [burgerMenu, setBurgerMenu] = useState(false)

  useEffect(() => {
    setBurgerMenu(false);
  }, [])

  function toggleBurgerMenu() {
    setBurgerMenu(!burgerMenu)
  }

  function hideBurgerMenu() {
    setBurgerMenu(false)
  }

  return (
    <nav className="shift">
      <Link to="/"><img className="bimusicicon2" src={bimusicicon} alt="musicicon" /></Link>
      <img className="menu-icon" src={burgerIcon} alt="menu icon" onClick={toggleBurgerMenu}></img>
      <ul className={burgerMenu ? "show" : "hide"}>

        {isLoggedIn && (
          <>


            <li>
              <Link to={`/profile/${user.name}`} onClick={hideBurgerMenu}>Profile</Link>
            </li>

            <li>
              <Link to="/projects" onClick={hideBurgerMenu}>Projects</Link>
            </li>


            <li>
              <Link to="/samples" onClick={hideBurgerMenu}>Samples</Link>
            </li>

            <li>
              <Link to="/chats" onClick={hideBurgerMenu}>Chat</Link>
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
