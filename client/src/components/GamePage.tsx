import type { Book } from "../types";
import { useOutletContext } from "react-router-dom";

const GamePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  return (
    <div>
      <h1>Books Loaded: {books.length}</h1>
      {books.map((book) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <p>Number of quotes: {book.quotes.length}</p>
        </div>
      ))}
    </div>
  );
};

export default GamePage;
