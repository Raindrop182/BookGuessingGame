import type { Book, GameMode, GameState } from "../../types";
import { useOutletContext } from "react-router-dom";
import RandomBookGame from "./RandomBookGame";
import "./RandomBookGame.css";
import { useState } from "react";
import {
  hasPlayedBookOfTheDay,
  getBookOfTheDay,
  getLastPlayedStatus,
} from "../Utils/BookOfTheDay";
const GamePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  const [gameMode, setGameMode] = useState<GameMode>("lobby"); //lobby, random, bookoftheday
  const [gameState, setGameState] = useState<GameState>("on"); //on, won, lost

  if (gameMode === "lobby") {
    return (
      <div>
        <h1> Game</h1>
        <div className="lobby-buttons">
          <button onClick={() => setGameMode("random")}>Random</button>
          <button
            onClick={() => {
              if (hasPlayedBookOfTheDay()) {
                setGameState(getLastPlayedStatus());
              } else {
                setGameState("on");
              }
              setGameMode("bookoftheday");
            }}
          >
            Book of the Day
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {gameMode === "random" && (
        <RandomBookGame
          books={books}
          setGameMode={setGameMode}
          gameState={gameState}
          setGameState={setGameState}
          gameMode={gameMode}
        />
      )}
      {gameMode === "bookoftheday" && (
        <RandomBookGame
          books={[getBookOfTheDay(books)]}
          setGameMode={setGameMode}
          gameState={gameState}
          setGameState={setGameState}
          gameMode={gameMode}
        />
      )}
    </div>
  );
};
export default GamePage;
