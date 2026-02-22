import { useState, useRef, useEffect } from "react";
import "./RandomBookGame.css";
import { setLastPlayedBookOfTheDay } from "../Utils/BookOfTheDay";
import { useGameContext } from "./RandomBookGame"; // or wherever your context lives

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const GuessInput = () => {
  const { setGameState, gameMode, quoteCount, book, setRandomQuote, inputRef } =
    useGameContext();
  const [feedback, setFeedback] = useState("");
  const [guess, setGuess] = useState<string>("");
  const feedbackTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const correct = normalize(guess) === normalize(book.title);

    if (correct) {
      setGameState("won");
      setFeedback("");
      if (gameMode == "bookoftheday") {
        setLastPlayedBookOfTheDay("won", quoteCount);
      }
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

  return (
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
  );
};
export default GuessInput;
