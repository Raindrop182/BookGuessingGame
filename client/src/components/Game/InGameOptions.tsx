import { useGameContext } from "./RandomBookGame";
import { useBookOfTheDay } from "../Utils/BookOfTheDay";

import "./RandomBookGame.css";

const InGameOptions = () => {
  const {
    setGameState,
    gameMode,
    quoteCount,
    book,
    setRandomQuote,
    inputRef,
    setRefreshBOD,
  } = useGameContext();
  const { setStatus } = useBookOfTheDay();

  function handleButtonClick(callback: () => void) {
    callback();
    inputRef.current?.focus();
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
              setStatus("lost", quoteCount).then(() =>
                setRefreshBOD((r) => r + 1),
              );
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
