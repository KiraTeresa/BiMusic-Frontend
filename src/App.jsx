import "./App.css";
import { Routes, Route } from "react-router-dom";

// Import Pages
import HomePage from "./pages/homepage/homepage";
import ProfilePage from "./pages/user-profile/user-profile";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Projects from "./pages/projects/projects";
import ProjectsCreate from "./pages/projects/projects-create"
import EditUserProfile from "./pages/user-profile/EditUserProfile";
import ProjectDetail from "./pages/projects/projects-detail";
import SamplesCreate from "./pages/samples/samples-create"

// Import Components
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import APP_PATHS from "./consts/app-paths";


function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/profile"
          element={
            <IsPrivate>
              <ProfilePage />
            </IsPrivate>
          }
        />

        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />

        <Route path={APP_PATHS.PROJECTS} element={<Projects />}></Route>
        <Route path={APP_PATHS.PROJECT_CREATE} element={<ProjectsCreate />}></Route>
        <Route path={APP_PATHS.PROJECT_DETAIL} element={<ProjectDetail />}></Route>
        <Route path={APP_PATHS.SAMPLES_CREATE} element={<SamplesCreate />}></Route>

        <Route
          path="/editprofile"
          element={
            <IsPrivate>
              <EditUserProfile />
            </IsPrivate>
          }
        />

      </Routes>
    </div>
  );
}

export default App;