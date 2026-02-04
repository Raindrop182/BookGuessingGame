import { useState, useEffect } from "react";
import NavBar from "./components/NavBar.tsx";
import type { Book } from "./types";
import { Outlet } from "react-router-dom";

const App = () => {
  const [page, setPage] = useState<"main" | "profile" | "game">("main");
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
      {/* {page == "main" && <MainPage books={books} />}
      {page == "game" && <GamePage books={books} />} */}
    </div>
  );
};

export default App;
