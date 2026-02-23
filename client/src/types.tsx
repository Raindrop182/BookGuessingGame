export type Book = {
  id: number;
  title: string;
  quotes: string[];
};

export type GameMode = "random" | "bookoftheday" | "lobby";

export type GameState = "won" | "lost" | "on";

export type BookOfTheDayRecord = {
  status: GameState; // "on" | "won" | "lost"
  date: string;
  quote_count: number;
};

export interface User {
  googleid: string;
  name: string;
  booksGuessed: [
    {
      bookId: number;
      numQuotes: number;
    },
  ];
}
