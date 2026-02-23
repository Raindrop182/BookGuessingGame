import { useState, useEffect } from "react";
import NavBar from "./components/NavBar.tsx";
import type { Book } from "./types";
import { Outlet } from "react-router-dom";
import { useUser } from "./components/Utils/UserContext";

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Failed to fetch books: ", err));
  }, []);

  return (
    <div>
      <NavBar />
      <div className="App-container">
        <Outlet context={{ books }} />
      </div>
    </div>
  );
};

export default App;
