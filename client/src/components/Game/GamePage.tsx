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
          <button onClick={() => setGameMode("random")}>Random</button>
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
