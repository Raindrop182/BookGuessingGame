import type { Book, GameMode } from "../types";
import { useOutletContext } from "react-router-dom";
import RandomBookGame from "./RandomBookGame.tsx";
import "./RandomBookGame.css";
import { useState } from "react";
import seedrandom from "seedrandom";

const getBookOfTheDay = (books: Book[]): Book => {
  const dateSeed = new Date().toDateString();

  const rng = seedrandom(dateSeed);

  const index = Math.floor(rng() * books.length);
  return books[index];
};

const GamePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  const [gamemode, setGameMode] = useState<GameMode>("lobby"); //lobby, random, bookoftheday

  if (gamemode === "lobby") {
    return (
      <div>
        <h1> Game</h1>
        <div className="lobby-buttons">
          <button onClick={() => setGameMode("random")}>Random</button>
          <button onClick={() => setGameMode("bookoftheday")}>
            Book of the Day
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {gamemode === "random" && (
        <RandomBookGame books={books} setGameMode={setGameMode} />
      )}
      {gamemode === "bookoftheday" && (
        <RandomBookGame
          books={[getBookOfTheDay(books)]}
          setGameMode={setGameMode}
        />
      )}
    </div>
  );
};
export default GamePage;
