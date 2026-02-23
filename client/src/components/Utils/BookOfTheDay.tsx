import seedrandom from "seedrandom";
import type { Book, GameState, BookOfTheDayRecord } from "../../types";
import { useUser } from "./UserContext";
import { useUpdateUser } from "../Utils/UpdateUser";

export const BOD_LAST_PLAYED_KEY = "bookOfTheDayLastPlayed";

export function getBookOfTheDay(books: Book[]): Book {
  const dateSeed = new Date().toDateString();

  const rng = seedrandom(dateSeed);

  const index = Math.floor(rng() * books.length);
  return books[index];
}

function getLocalBOD() {
  const str = localStorage.getItem(BOD_LAST_PLAYED_KEY);
  if (!str) return null;
  try {
    console.log(JSON.parse(str));
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function setLocalBOD(status: GameState, numQuotes: number) {
  localStorage.setItem(
    BOD_LAST_PLAYED_KEY,
    JSON.stringify({ status, numQuotes, date: new Date().toDateString() }),
  );
}

export function useBookOfTheDay() {
  const { user } = useUser();
  const { addBODStat } = useUpdateUser();

  const isLoggedIn = !!user;

  async function getStatus() {
    if (isLoggedIn) {
      return user.bookofthedayStats;
    } else {
      console.log("not logged in status retrieval");
      return getLocalBOD();
    }
  }

  async function setStatus(status: GameState, numQuotes: number) {
    if (isLoggedIn) return addBODStat(status, numQuotes);
    else {
      console.log("not logged in status set");
      return setLocalBOD(status, numQuotes);
    }
  }

  return { getStatus, setStatus };
}
