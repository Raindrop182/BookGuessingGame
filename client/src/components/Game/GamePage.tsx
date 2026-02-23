import type { Book, GameMode, GameState } from "../../types";
import { useOutletContext } from "react-router-dom";
import RandomBookGame from "./RandomBookGame";
import "./RandomBookGame.css";
import { useState, useEffect } from "react";
import { useBookOfTheDay, getBookOfTheDay } from "../Utils/BookOfTheDay";
import { useUser } from "../Utils/UserContext";

const GamePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  const [gameMode, setGameMode] = useState<GameMode>("lobby"); //lobby, random, bookoftheday
  const [gameState, setGameState] = useState<GameState>("on"); //on, won, lost
  const { getStatus } = useBookOfTheDay();
  const [playedBOD, setPlayedBOD] = useState(false);
  const { user } = useUser();
  const [refreshBOD, setRefreshBOD] = useState(0);

  useEffect(() => {
    getStatus().then((status) => {
      console.log("status");
      setPlayedBOD(status?.date === new Date().toDateString());
    });
  }, [user, refreshBOD]);

  if (gameMode === "lobby") {
    return (
      <div>
        <h1> Game</h1>
        <div className="lobby-buttons">
          <div className="lobby-button-wrapper">
            <button onClick={() => setGameMode("random")}>Random</button>
            <div className="lobby-buttons-explanations">
              Get quotes from a random book and try to guess which one it’s
              from. Keep getting quotes until you guess correctly or give up.
              Each game is a new book.
            </div>
          </div>
          <div className="lobby-button-wrapper">
            <button
              onClick={async () => {
                if (playedBOD) {
                  console.log(playedBOD);
                  const lastStatus = await getStatus(); // await the async status
                  setGameState(lastStatus?.status || "won"); // fallback if null
                } else {
                  setGameState("on");
                }
                setGameMode("bookoftheday");
              }}
            >
              Book of the Day
            </button>
            <div className="lobby-buttons-explanations">
              Guess quotes from the daily featured book. You can get as many
              quotes as you need until you guess it or give up. Each player can
              play this once per day.
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
          setRefreshBOD={setRefreshBOD}
        />
      )}
      {gameMode === "bookoftheday" && (
        <RandomBookGame
          books={[getBookOfTheDay(books)]}
          setGameMode={setGameMode}
          gameState={gameState}
          setGameState={setGameState}
          gameMode={gameMode}
          setRefreshBOD={setRefreshBOD}
        />
      )}
    </div>
  );
};
export default GamePage;
