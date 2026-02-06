import "./NavBar.css";
import { NavLink } from "react-router-dom";

const NavBar = () => {
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
      </div>
    </nav>
  );
};

export default NavBar;
