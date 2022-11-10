import "./homepage.scss";
import { useLocation } from "react-router-dom";
import projectCardsScreenshot from "../../assets/icons/project-cards.png"


function HomePage() {
  const location = useLocation();
  return (
    <div className="hp-container">
      {/* <h1>Home page</h1> */}
      {location?.state?.errorMessage ? <p className="error-message">{location.state.errorMessage}</p> : ""}

      <div className="hp-element hp-1">
        <div className="buzzwords">
          <div className="buzz-1">dj</div>
          <div className="buzz-2">bassist</div>
          <div className="buzz-3">singer</div>
          <div className="buzz-4">songwriter</div>
          <div className="buzz-5">keyboarder</div>
          <div className="buzz-6">producer</div>
          <div className="buzz-7">guitarist</div>
        </div>
        <div className="join">join the BiMusic family</div>
      </div>

      <div className="hp-element hp-2">
        <div className="arrow">
          <div>post your project</div>
          <div className="curve"></div>
          <div className="point"></div>
        </div>
        <img src={projectCardsScreenshot} alt="project cards"></img>
      </div>

      <div className="hp-element hp-3">
        <div>audio</div>
        <div>video</div>
      </div>


    </div>
  );
}

export default HomePage;
