import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import type { Book, GameMode, GameState } from "../../types";

import RandomBookGame from "./RandomBookGame";
import { useBookOfTheDay, getBookOfTheDay } from "../Utils/BookOfTheDay";

import "./RandomBookGame.css";

const GamePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  const [gameMode, setGameMode] = useState<GameMode>("lobby"); //lobby, random, bookoftheday
  const [gameState, setGameState] = useState<GameState>("on"); //on, won, lost

  const { getStatus } = useBookOfTheDay(); // Hook to get the Book of the Day status

  if (books.length == 0) return <div>Loading books...</div>;

  if (gameMode === "lobby") {
    return (
      <div>
        <div className="game-header">
          <h1> Guess the Book!</h1>
        </div>
        <div className="lobby-buttons">
          <div className="lobby-button-wrapper">
            <button onClick={() => setGameMode("random")}>Random</button>
            <div className="lobby-buttons-explanations">
              Get random quotes and guess which book they're from. Keep going
              until you guess the book correctly or give up.
            </div>
          </div>
          <div className="lobby-button-wrapper">
            <button
              onClick={async () => {
                const lastStatus = await getStatus();
                if (lastStatus?.date === new Date().toDateString()) {
                  setGameState(lastStatus?.status || "won");
                } else {
                  setGameState("on");
                }
                setGameMode("bookoftheday");
              }}
            >
              Book of the Day
            </button>
            <div className="lobby-buttons-explanations">
              Guess the daily featured book from quotes.
            </div>
          </div>
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
