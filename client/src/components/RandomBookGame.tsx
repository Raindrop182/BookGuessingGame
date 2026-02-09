import type { Book } from "../types";
import { useState } from "react";
import { useRef } from "react";
import "./RandomBookGame.css";

type Props = {
  books: Book[];
  returnToLobby: () => void;
};

const RandomBookGame = ({ books, returnToLobby }: Props) => {
  const [guess, setGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState(false);
  const [book, setBook] = useState<Book>(
    books[Math.floor(Math.random() * books.length)],
  );
  const [quote, setQuote] = useState<string>(
    book.quotes[Math.floor(Math.random() * book.quotes.length)],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const correct = guess.trim().toLowerCase() === book.title.toLowerCase();

    if (correct) {
      setGameOver(true);
    } else {
      setRandomQuote(book);
      alert("Try again!");
    }
    setGuess("");

    alert;
  }

  const quoteCallCount = useRef(0);
  function setRandomQuote(book: Book) {
    quoteCallCount.current += 1;
    setQuote(book.quotes[Math.floor(Math.random() * book.quotes.length)]);
  }

  function setRandomBook() {
    const newBook = books[Math.floor(Math.random() * books.length)];
    setBook(newBook);
    setRandomQuote(newBook);
  }

  return (
    <div>
      {gameOver ? (
        <div>
          <p> Correct! The book was "{book.title}"</p>
          <button
            className="lobby-buttons"
            onClick={() => {
              setRandomBook();
              quoteCallCount.current = 0;
              setGameOver(false);
            }}
          >
            Start New Game
          </button>
          <button
            className="lobby-buttons"
            onClick={() => {
              returnToLobby();
            }}
          >
            Return to Lobby
          </button>
        </div>
      ) : (
        <div className="random-game-card">
          <p className="quote">{quote}</p>
          <form className="guess-form" onSubmit={handleSubmit}>
            <div className="guess-row">
              <input
                className="guess-input"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Guess the book"
              />
              <button className="submit-button" disabled={!guess.trim()}>
                Submit
              </button>
            </div>
            <p className="quote-counter">
              Number of quotes seen: {quoteCallCount.current}
            </p>
            <div className="ingame-options">
              <button onClick={() => setRandomQuote(book)}>
                Summon new quote
              </button>
              <button onClick={() => setGameOver(true)}>Give up</button>
            </div>
            <p>{book.title}</p>
          </form>
        </div>
      )}
    </div>
  );
};
export default RandomBookGame;
