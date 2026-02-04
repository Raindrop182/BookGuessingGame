import "./NavBar.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title">Catbook</div>
      <div className="NavBar-links">
        <Link to="/">Home</Link>
        <Link to="/game">Game</Link>
      </div>
    </nav>
  );
};

export default NavBar;
