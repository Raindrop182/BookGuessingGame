import type { Book, GameMode, GameState } from "../../types";
import { useState, useRef, createContext, useContext } from "react";
import "./RandomBookGame.css";
import EndGame from "./EndGame";
import GuessInput from "./GuessInput";
import InGameOptions from "./InGameOptions";

type Props = {
  books: Book[];
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  gameState: GameState;
  gameMode: GameMode;
  setRefreshBOD: React.Dispatch<React.SetStateAction<number>>;
};

type GameContextType = {
  gameState: GameState;
  gameMode: GameMode;
  quoteCount: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  book: Book;
  setRandomQuote: (book: Book) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setRefreshBOD: React.Dispatch<React.SetStateAction<number>>;
};

export const GameContext = createContext<GameContextType | null>(null);
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("GameContext not found");
  return context;
};

function getRandomBook(books: Book[]): Book {
  if (books.length === 0) {
    throw new Error("No books provided");
  }
  return books[Math.floor(Math.random() * books.length)];
}

function getRandomQuote(book: Book): string {
  return book.quotes[Math.floor(Math.random() * book.quotes.length)];
}

const RandomBookGame = ({
  books,
  setGameMode,
  gameState,
  setGameState,
  gameMode,
  setRefreshBOD,
}: Props) => {
  const [book, setBook] = useState<Book>(getRandomBook(books));
  const [quote, setQuote] = useState<string>(getRandomQuote(book));
  const inputRef = useRef<HTMLInputElement>(null);
  const [quoteCount, setQuoteCount] = useState(1);

  function setRandomQuote(book: Book) {
    setQuoteCount(quoteCount + 1);
    setQuote(getRandomQuote(book));
  }

  function setRandomBook() {
    const newBook = getRandomBook(books);
    setBook(newBook);
    setRandomQuote(newBook);
  }

  function startNewGame() {
    setRandomBook();
    setQuoteCount(1);
  }

  return (
    <div>
      {gameState === "won" || gameState === "lost" ? (
        <EndGame
          startNewGame={startNewGame}
          setGameMode={setGameMode}
          setGameState={setGameState}
          gameMode={gameMode}
          numQuotesFromGame={quoteCount}
          gameState={gameState}
          book={book}
        />
      ) : (
        <div className="random-game-card">
          <p className="quote">{quote}</p>
          <GameContext.Provider
            value={{
              gameState,
              gameMode,
              quoteCount: quoteCount,
              setGameState,
              book,
              setRandomQuote,
              inputRef,
              setRefreshBOD,
            }}
          >
            <GuessInput />
            <p className="quote-counter">Number of quotes seen: {quoteCount}</p>
            <InGameOptions />
          </GameContext.Provider>
        </div>
      )}
    </div>
  );
};
export default RandomBookGame;
