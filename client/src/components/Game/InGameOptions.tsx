import "./RandomBookGame.css";
import { useBookOfTheDay } from "../Utils/BookOfTheDay";
import { useGameContext } from "./RandomBookGame"; // or wherever your context lives

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
