import seedrandom from "seedrandom";

import type { Book, GameState } from "../../types";

import { useUser } from "./UserContext";
import { useUpdateUser } from "./UpdateUser";

export const BOD_LAST_PLAYED_KEY = "bookOfTheDayLastPlayed";

/**
 * Returns the book of the day based on a deterministic seed derived from the current date.
 */
export function getBookOfTheDay(books: Book[]): Book {
  const dateSeed = new Date().toDateString();

  const rng = seedrandom(dateSeed);

  const index = Math.floor(rng() * books.length);
  return books[index];
}

/**
 * Retrieves the last book of the day status from localStorage.
 */
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

/**
 Saves the current book of the day stats to local storage
 */
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
    const today = new Date().toDateString();

    if (isLoggedIn && user.bookofthedayStats?.date === today) {
      return user.bookofthedayStats;
    }

    const localEntry = getLocalBOD();
    if (localEntry?.date === today) return localEntry;

    return null; // Haven't played today
  }

  async function setStatus(status: GameState, numQuotes: number) {
    if (isLoggedIn) addBODStat(status, numQuotes);

    return setLocalBOD(status, numQuotes);
  }

  return { getStatus, setStatus };
}
