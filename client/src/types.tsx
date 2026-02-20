export type Book = {
  id: number;
  title: string;
  quotes: string[];
};

export type GameMode = "random" | "bookoftheday" | "lobby";

export type GameState = "won" | "lost" | "on";
