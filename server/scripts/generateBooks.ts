import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

type Book = {
  id: number;
  title: string;
  quotes: string[];
};

const toBeScrapedBooks = [
  { id: 1342, title: "Pride and Prejudice" },
  { id: 2701, title: "Moby Dick" },
  { id: 84, title: "Frankenstein" },
  { id: 11, title: "Alice's Adventures in Wonderland" },
  { id: 98, title: "A Tale of Two Cities" },
  { id: 1661, title: "The Adventures of Sherlock Holmes" },
  { id: 158, title: "Emma" },
  { id: 76, title: "Adventures of Huckleberry Finn" },
  { id: 5200, title: "Metamorphosis" },
  { id: 345, title: "Dracula" },
  { id: 215, title: "The Call of the Wild" },
  { id: 64317, title: "The War of the Worlds" },
  { id: 1400, title: "Great Expectations" },
  { id: 120, title: "Treasure Island" },
  { id: 16, title: "Peter Pan" },
  { id: 28054, title: "The Brothers Karamazov" },
  { id: 996, title: "The Adventures of Pinocchio" },
  { id: 43, title: "The Strange Case of Dr Jekyll and Mr Hyde" },
  { id: 219, title: "Heart of Darkness" },
  { id: 844, title: "The Importance of Being Earnest" },
];

function cleanGutenbergText(text: string): string {
  const start = text.indexOf("*** START OF");
  const end = text.indexOf("*** END OF");
  return text.slice(start !== -1 ? start : 0, end !== -1 ? end : text.length);
}

function extractQuotes(text: string): string[] {
  const abbreviations = ["Mr", "Mrs", "Dr", "Ms", "Prof", "Sr", "Jr", "St"];
  const abbrPattern = abbreviations.join("|");
  console.log(abbrPattern);
  const regex = new RegExp(
    `(?:(?!\\b(?:${abbrPattern})\\.)[^.!?]|\\b(?:${abbrPattern})\\.)+[.!?]["']?`,
    "g",
  );

  const matches = text.match(regex) || [];

  return matches
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && /[a-zA-Z]/.test(s));
}

async function scrapeBook(
  id: number,
  title: string,
  numBooks: number,
): Promise<Book> {
  const url = `https://www.gutenberg.org/files/${id}/${id}-0.txt`;
  console.log(`Fetching ${title}...`);

  const res = await fetch(url);
  const rawText = await res.text();

  const cleanText = cleanGutenbergText(rawText);
  const quotes = extractQuotes(cleanText);

  return { id: numBooks, title: title, quotes: quotes } as Book;
}

async function main() {
  const books: Book[] = [];
  for (const book of toBeScrapedBooks) {
    const scrapedBook = await scrapeBook(book.id, book.title, books.length);
    books.push(scrapedBook);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const outputPath = path.join(__dirname, "../data/books.json");
  fs.writeFileSync(outputPath, JSON.stringify(books, null, 2));

  console.log("books.json generated");
}

main();
