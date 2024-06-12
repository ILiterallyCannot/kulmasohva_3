import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth-service";
import IUser from "./types/user-type";

import Login from "./components/login-component";
import Register from "./components/register-component";
import Home from "./components/home-component";
import ProfileComponent from "./components/profile-component";
import UserComponent from "./components/user-component";
import ModeratorComponent from "./components/moderator-component";
import AdminComponent from "./components/admin-component";

import EventBus from "./common/EventBus";

const App: React.FC = () => {
  const [moderatorBoard, showModeratorBoard] = useState<boolean>(false);
  const [adminBoard, showAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      showModeratorBoard(
        user.roles.includes("ROLE_MODERATOR") ||
          user.roles.includes("ROLE_ADMIN")
      );
      showAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
    EventBus.on("logout", logOut);
  }, []);

  const logOut = () => {
    AuthService.logout();
    showModeratorBoard(false);
    showAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/home"} className="navbar-brand">
          Kulmasohva 3.0
        </Link>
        <div className="navbar-nav mr-auto">
          {adminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {moderatorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                Dashboard
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username} profile
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Log out
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileComponent />} />
          <Route path="/user/*" element={<UserComponent />} />
          <Route path="/mod/*" element={<ModeratorComponent />} />
          <Route path="/admin/*" element={<AdminComponent />} />
        </Routes>
      </div>

      {/*<AuthVerify logOut={this.logOut}/> */}
    </div>
  );
};

export default App;
