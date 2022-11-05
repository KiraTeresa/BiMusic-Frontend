import "./App.scss";
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
import AccountSettings from "./pages/user-profile/AccountSettings";
import Chat from "./pages/chat/chat";
import ChatRoom from "./pages/chat/chatRoom"
import InitiatorProfile from "./pages/Initiator/InitiatorProfile";
import Samples from "./pages/samples/samples";
import SamplesDetail from "./pages/samples/samples-details";

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
        <Route path={APP_PATHS.PROJECT_CREATE} element={<IsPrivate><ProjectsCreate /></IsPrivate>}></Route>
        <Route path={APP_PATHS.PROJECT_DETAIL} element={<IsPrivate><ProjectDetail /></IsPrivate>}></Route>
        <Route path={APP_PATHS.SAMPLES_CREATE} element={<IsPrivate><SamplesCreate /></IsPrivate>}></Route>
        <Route path={APP_PATHS.CHAT} element={<IsPrivate><Chat /></IsPrivate>}></Route>
        <Route path={APP_PATHS.CHAT_ROOM} element={<IsPrivate><ChatRoom /></IsPrivate>}></Route>

        <Route path={APP_PATHS.SAMPLES} element={<IsPrivate><Samples /></IsPrivate>} />

        <Route path="/samples/:username" element={<IsPrivate><SamplesDetail /></IsPrivate>} />


        <Route
          path="/editprofile"
          element={
            <IsPrivate>
              <EditUserProfile />
            </IsPrivate>
          }
        />
        <Route
          path="/account-settings"
          element={
            <IsPrivate>
              <AccountSettings />
            </IsPrivate>
          }
        />

        <Route
          path="/profile/:initiator"
          element={
            <IsPrivate>
              <InitiatorProfile />
            </IsPrivate>
          }
        />

      </Routes>
    </div>
  );
}

export default App;