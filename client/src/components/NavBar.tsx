import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "./Utils/UserContext";
import { API_URL } from "./Utils/api";

const NavBar = () => {
  const { user, setUser } = useUser();
  const handleLogin = async (res: any) => {
    if (!res.credential) {
      return;
    }
    console.log("aaaaa");
    const r = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: res.credential }),
      credentials: "include",
    });
    console.log("bbbbb");
    const data = await r.json();
    console.log("Logged in user:", data.user);
    setUser(data.user);
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    console.log("Successfully logged out!");
    setUser(null);
  };
  const handleError = () => {
    console.log("Login failedddddd");
  };
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title">Book Guessing Game</div>
      <div className="NavBar-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/game"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Game
        </NavLink>
        {user && (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>
        )}
      </div>
      <div className="NavBar-login">
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={handleError} />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
