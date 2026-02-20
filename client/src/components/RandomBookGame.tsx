import type { Book, GameMode, GameState } from "../types";
import { useState, useRef, useEffect } from "react";
import "./RandomBookGame.css";
import EndGame from "./EndGame.tsx";

type Props = {
  books: Book[];
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
};

const RandomBookGame = ({ books, setGameMode }: Props) => {
  const [guess, setGuess] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>("on"); //on, won, lost
  const [book, setBook] = useState<Book>(getRandomBook(books));
  const [quote, setQuote] = useState<string>(getRandomQuote(book));
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const feedbackTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }
    };
  }, []);

  function handleButtonClick(callback: () => void) {
    callback(); // run whatever the button does
    inputRef.current?.focus(); // keep input focused
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const correct = guess.trim().toLowerCase() === book.title.toLowerCase();

    if (correct) {
      setGameState("won");
      setFeedback("");
    } else {
      setRandomQuote(book);
      setFeedback("Incorrect, try again!");
      // Clear any previous timeout
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }

      feedbackTimeout.current = setTimeout(() => {
        setFeedback("");
      }, 3000);
    }
    setGuess("");
  }

  function getRandomBook(books: Book[]): Book {
    return books[Math.floor(Math.random() * books.length)];
  }

  function getRandomQuote(book: Book): string {
    return book.quotes[Math.floor(Math.random() * book.quotes.length)];
  }

  const quoteCallCount = useRef(1);
  function setRandomQuote(book: Book) {
    quoteCallCount.current += 1;
    setQuote(getRandomQuote(book));
  }

  function setRandomBook() {
    const newBook = getRandomBook(books);
    setBook(newBook);
    setRandomQuote(newBook);
  }

  function startNewGame() {
    setRandomBook();
    quoteCallCount.current = 1;
  }

  return (
    <div>
      {gameState === "won" || gameState === "lost" ? (
        <EndGame
          startNewGame={startNewGame}
          setGameMode={setGameMode}
          setGameState={setGameState}
          gameMode={books.length === 1 ? "bookoftheday" : "random"}
          num_quotes={quoteCallCount.current}
          gameState={gameState}
          book={book}
        />
      ) : (
        <div className="random-game-card">
          <p className="quote">{quote}</p>
          <form className="guess-form" onSubmit={handleSubmit}>
            <div className="guess-row">
              <input
                ref={inputRef}
                className="guess-input"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Guess the book"
              />
              <button className="submit-button" disabled={!guess.trim()}>
                Submit
              </button>
              {feedback && <span className="feedback-inline">{feedback}</span>}
            </div>
          </form>
          <p className="quote-counter">
            Number of quotes seen: {quoteCallCount.current}
          </p>
          <div className="ingame-options">
            <button
              onClick={() => handleButtonClick(() => setRandomQuote(book))}
            >
              Summon new quote
            </button>
            <button
              onClick={() => handleButtonClick(() => setGameState("lost"))}
            >
              Give up
            </button>
          </div>
          <p>{book.title}</p>
        </div>
      )}
    </div>
  );
};
export default RandomBookGame;
