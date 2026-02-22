import seedrandom from "seedrandom";
import type { Book, GameState, BookOfTheDayRecord } from "../../types";

export const BOD_LAST_PLAYED_KEY = "bookOfTheDayLastPlayed";

export function hasPlayedBookOfTheDay(): boolean {
  const lastPlayedStr = localStorage.getItem(BOD_LAST_PLAYED_KEY);
  if (!lastPlayedStr) return false;
  try {
    const lastPlayed: BookOfTheDayRecord = JSON.parse(lastPlayedStr);
    return lastPlayed.date === new Date().toDateString();
  } catch {
    return false;
  }
}

export function setLastPlayedBookOfTheDay(
  status: GameState,
  quote_count: number,
): void {
  localStorage.setItem(
    BOD_LAST_PLAYED_KEY,
    JSON.stringify({ status, date: new Date().toDateString(), quote_count }),
  );
}

export function getLastPlayedStatus(): GameState {
  const lastPlayedStr = localStorage.getItem(BOD_LAST_PLAYED_KEY);
  if (lastPlayedStr) {
    const lastPlayed: BookOfTheDayRecord = JSON.parse(lastPlayedStr);
    return lastPlayed.status;
  }
  return "lost";
}

export function getLastPlayedQuoteCount(): number {
  const lastPlayedStr = localStorage.getItem(BOD_LAST_PLAYED_KEY);
  if (lastPlayedStr) {
    const lastPlayed: BookOfTheDayRecord = JSON.parse(lastPlayedStr);
    return lastPlayed.quote_count;
  }
  return 0;
}

export function getBookOfTheDay(books: Book[]): Book {
  const dateSeed = new Date().toDateString();

  const rng = seedrandom(dateSeed);

  const index = Math.floor(rng() * books.length);
  return books[index];
}
