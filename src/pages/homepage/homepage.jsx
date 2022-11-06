import "./homepage.scss";
import { useLocation } from "react-router-dom"


function HomePage() {
  const location = useLocation();
  return (
    <div>
      <h1>Home page</h1>
      {location?.state?.errorMessage ? <p className="error-message">{location.state.errorMessage}</p> : ""}
    </div>
  );
}

export default HomePage;
