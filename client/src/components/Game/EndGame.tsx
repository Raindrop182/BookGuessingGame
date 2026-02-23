import type { Book, GameMode, GameState } from "../../types";
import { useBookOfTheDay } from "../Utils/BookOfTheDay";
import { useState, useEffect } from "react";

type Props = {
  gameMode: GameMode;
  gameState: GameState;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  startNewGame: () => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  numQuotesFromGame: number;
  book: Book;
};

const EndGame = ({
  gameState, //"on" "won" or "lost"
  setGameState,
  gameMode, //"random" or "bookoftheday"
  setGameMode,
  startNewGame,
  numQuotesFromGame,
  book,
}: Props) => {
  const { getStatus } = useBookOfTheDay();
  const [quoteCount, setQuoteCount] = useState<number>(numQuotesFromGame);

  useEffect(() => {
    if (gameMode === "bookoftheday") {
      getStatus().then((status) => {
        if (status) setQuoteCount(status.numQuotes);
      });
    } else {
      setQuoteCount(numQuotesFromGame);
    }
  }, [gameMode, numQuotesFromGame]);

  return (
    <div>
      {gameState === "won" ? (
        <div>
          <p className="end-game-text">
            Correct! The book was <em>{book.title}</em>.
            <br />
            It took you {quoteCount} {quoteCount === 1 ? "quote" : "quotes"} to
            guess.
          </p>
        </div>
      ) : (
        <div>
          <p className="end-game-text">
            The book was <em>{book.title}</em>.
            <br />
            You gave up after {quoteCount}{" "}
            {quoteCount === 1 ? "quote" : "quotes"}.
          </p>
        </div>
      )}
      {gameMode === "random" ? (
        <div className="lobby-buttons">
          <button
            onClick={() => {
              startNewGame();
              setGameState("on");
            }}
          >
            Start New Game
          </button>
          <button
            onClick={() => {
              setGameMode("lobby");
              setGameState("on");
            }}
          >
            Return to Lobby
          </button>
        </div>
      ) : (
        <div className="lobby-buttons">
          <button
            onClick={() => {
              setGameMode("lobby");
              setGameState("on");
            }}
          >
            Return to Lobby
          </button>
        </div>
      )}
    </div>
  );
};
export default EndGame;
