import "./RandomBookGame.css";
import { setLastPlayedBookOfTheDay } from "../Utils/BookOfTheDay";
import { useGameContext } from "./RandomBookGame"; // or wherever your context lives

const InGameOptions = () => {
  const { setGameState, gameMode, quoteCount, book, setRandomQuote, inputRef } =
    useGameContext();

  function handleButtonClick(callback: () => void) {
    callback(); // run whatever the button does
    inputRef.current?.focus(); // keep input focused
  }

  return (
    <div className="ingame-options">
      <button onClick={() => handleButtonClick(() => setRandomQuote(book))}>
        Summon new quote
      </button>
      <button
        onClick={() =>
          handleButtonClick(() => {
            if (gameMode === "bookoftheday") {
              setLastPlayedBookOfTheDay("lost", quoteCount);
            }
            setGameState("lost");
          })
        }
      >
        Give up
      </button>
    </div>
  );
};
export default InGameOptions;
