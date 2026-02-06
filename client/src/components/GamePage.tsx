import type { Book } from "../types";
import { useOutletContext } from "react-router-dom";
import RandomBookGame from "./RandomBookGame.tsx";
import { useState } from "react";

type GameMode = "random" | "bookoftheday" | "lobby";

const GamePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  const [gamemode, setGamemode] = useState<GameMode>("lobby");

  if (gamemode === "lobby") {
    return (
      <div>
        <h1> Game</h1>
        <button onClick={() => setGamemode("random")}>Random Quote Mode</button>
        <button onClick={() => setGamemode("bookoftheday")}>
          Book of the Day
        </button>
      </div>
    );
  }

  return (
    <>
      {gamemode === "random" && (
        <RandomBookGame
          books={books}
          returnToLobby={() => setGamemode("lobby")}
        />
      )}
    </>
  );
};
export default GamePage;
