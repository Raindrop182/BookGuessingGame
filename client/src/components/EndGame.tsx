import type { Book, GameMode, GameState } from "../types";

type Props = {
  gameType: GameMode;
  gameState: GameState;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  startNewGame: () => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  num_quotes: number;
  book: Book;
};

const EndGame = ({
  gameState, //"on" "won" or "lost"
  setGameState,
  gameType, //"random" or "bookoftheday"
  setGameMode,
  startNewGame,
  num_quotes,
  book,
}: Props) => {
  return (
    <div>
      {gameState === "won" ? (
        <div>
          <p className="end-game-text">
            Correct! The book was <em>{book.title}</em>.
            <br />
            It took you {num_quotes} {num_quotes == 1 ? "quote" : "quotes"} to
            guess.
          </p>
        </div>
      ) : (
        <div>
          <p className="end-game-text">
            The book was <em>{book.title}</em>.
            <br />
            You gave up after {num_quotes}{" "}
            {num_quotes == 1 ? "quote" : "quotes"}.
          </p>
        </div>
      )}
      {gameType == "random" ? (
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
