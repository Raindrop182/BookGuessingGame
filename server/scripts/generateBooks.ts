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
];

function cleanGutenbergText(text: string): string {
  const start = text.indexOf("*** START OF");
  const end = text.indexOf("*** END OF");
  return text.slice(start !== -1 ? start : 0, end !== -1 ? end : text.length);
}

function extractQuotes(text: string): string[] {
  const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

  const lines = Array.from(segmenter.segment(text))
    .map((seg) => seg.segment.trim())
    .filter((line) => line.length > 10);

  return lines;
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
