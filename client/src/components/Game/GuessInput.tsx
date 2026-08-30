import { useEffect, useRef, useState } from "react";

import { useGameContext } from "./RandomBookGame";
import { useBookOfTheDay } from "../Utils/BookOfTheDay";
import { useUpdateUser } from "../Utils/UpdateUser";

import "./RandomBookGame.css";

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const GuessInput = () => {
  const {
    setGameState,
    gameMode,
    quoteCount,
    book,
    setRandomQuote,
    inputRef,
  } = useGameContext();
  const [feedback, setFeedback] = useState("");
  const [guess, setGuess] = useState<string>("");
  const feedbackTimeout = useRef<number | null>(null);
  const { addBookGuess } = useUpdateUser();
  const { setStatus } = useBookOfTheDay();

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
        setStatus("won", quoteCount);
      } else if (gameMode == "random") {
        addBookGuess(book.id, quoteCount);
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
      </div>
      {feedback && <span className="feedback-inline">{feedback}</span>}
    </form>
  );
};
export default GuessInput;
