import "./homepage.scss";
import { Link, useLocation } from "react-router-dom";
import projectCardsScreenshot from "../../assets/icons/project-cards.png"
import curvedArrow from "../../assets/icons/arrow-left.png"
// import bimusicicon from '../../assets/icons/BIMUSIC-logo-purple.png'
import bimusicicon from '../../assets/icons/BIMUSIC-logo-turquoise.png'
import singerIcon from '../../assets/icons/Singer1.png';
import singerSongwriterIcon from '../../assets/icons/singerSongwriter.png';
import saxophonistIcon from '../../assets/icons/Saxophonist.png';
import pianistIcon from '../../assets/icons/Pianist.png';
import guitaristIcon from '../../assets/icons/guitarist.png';
import drummerIcon from '../../assets/icons/drummer.png';
import djIcon from '../../assets/icons/DJ.png';
import bassistIcon from '../../assets/icons/Bassist.png';
import sampleScreenshot from '../../assets/icons/sample.png';
import feedbackScreenshot from '../../assets/icons/feedback.png';


function HomePage() {
  const location = useLocation();
  return (
    <div className="hp-container">
      {/* <h1>Home page</h1> */}
      {location?.state?.errorMessage ? <p className="error-message">{location.state.errorMessage}</p> : ""}
      <div className="hp-element hp-0">
        <div className="welcome"><p>Welcome</p></div>
        <div className="logo-wrapper">
          <img src={bimusicicon} alt="bimusic logo"></img>
        </div>
      </div>

      <div className="hp-element hp-1">
        <div className='gradient'></div>
        <div className="buzzwords">
          <div className="buzz b-1">
            <img src={singerIcon} alt="musician icon"></img>
          </div>
          <div className="buzz b-2">
            <img src={singerSongwriterIcon} alt="musician icon"></img>
          </div>
          <div className="buzz b-3">
            <img src={saxophonistIcon} alt="musician icon"></img>
          </div>
          <div className="buzz b-4">
            <img src={pianistIcon} alt="musician icon"></img>
          </div>
          <div className="buzz b-5">
            <img src={guitaristIcon} alt="musician icon"></img>
          </div>
          <div className="buzz b-6">
            <img src={drummerIcon} alt="musician icon"></img>
          </div>
          <div className="buzz b-7">
            <img src={djIcon} alt="musician icon"></img>
          </div>
          <div className="buzz b-8">
            <img src={bassistIcon} alt="musician icon"></img>
          </div>
        </div>
        <div className="join">
          <div>join the BiMusic family</div>
          <Link to="/signup"><button className="btn primary">SIGN UP</button></Link>
        </div>
      </div>

      <div className="hp-element hp-2">
        <div className="arrow">
          <div>post your project</div>
          <img className="arrow-icon" src={curvedArrow} alt="curved arrow"></img>
        </div>
        <img className="proj-card-screenshot" src={projectCardsScreenshot} alt="project cards"></img>
      </div>

      <div className="hp-element hp-3">
        <div className='gradient'></div>
        <div className="sample-wrapper">
          <img className="sample-img" src={sampleScreenshot} alt="post of an audio file"></img>
          <img className="feedback-img" src={feedbackScreenshot} alt="feedback post screenshot"></img>
        </div>
        <div className="share">
          <div>share your tracks and get feedback</div>
        </div>
      </div>


    </div>
  );
}

export default HomePage;
