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
                if (playedBOD) {
                  console.log(playedBOD);
                  const lastStatus = await getStatus();
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
