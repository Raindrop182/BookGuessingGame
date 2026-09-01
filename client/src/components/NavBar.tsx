import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { useUser } from "./Utils/UserContext";
import { API_URL } from "./Utils/api";

import "./NavBar.css";

const NavBar = () => {
  const { user, setUser } = useUser();
  const handleLogin = async (res: any) => {
    if (!res.credential) {
      return;
    }
    const r = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: res.credential }),
      credentials: "include",
    });
    const data = await r.json();
    console.log("Logged in user:", data.user);
    setUser(data.user);

    // Check if they played Book of the Day while logged out
    // If so, update their profile with the local Book of the Day stats
    const BOD_KEY = "bookOfTheDayLastPlayed";
    const localBOD = localStorage.getItem(BOD_KEY);
    if (localBOD) {
      try {
        const parsedBOD = JSON.parse(localBOD);
        const today = new Date().toDateString();
        // If they played today while logged out but NOT while logged in, save it to their profile
        if (parsedBOD.date === today && data.user.bookofthedayStats?.date !== today) {
          await fetch(`${API_URL}/api/user`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookofthedayStats: parsedBOD,
            }),
            credentials: "include",
          })
            .then((res) => res.json())
            .then((updatedUser) => {
              setUser(updatedUser);
            });
        }
      } catch (err) {
        console.error("Failed to migrate Book of the Day stats:", err);
      }
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    console.log("Successfully logged out!");
    setUser(null);
    navigate("/", { replace: true });
  };
  const handleError = () => {
    console.log("Login failed");
  };
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title">Guess the Book</div>
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
