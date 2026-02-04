import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 Error: Page not found</h1>
      <p>Oops! The page you are looking for doesn’t exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default NotFound;
