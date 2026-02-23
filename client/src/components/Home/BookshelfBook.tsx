import { useOutletContext } from "react-router-dom";
import type { Book } from "../../types";

type Props = {
  guess: {
    bookId: number;
    bestNumQuotes: number;
    worstNumQuotes: number;
  };
};

function BookshelfBook({ guess }: Props) {
  const { books } = useOutletContext<{ books: Book[] }>();

  function bookIdToTitle(bookId: number) {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : "Unknown Book";
  }

  return (
    <div key={guess.bookId} className="book-card">
      <h3 className="booktitle">{bookIdToTitle(guess.bookId)}</h3>
      <div className="book-stats">
        <p>Best: {guess.bestNumQuotes} quotes</p>
        <p>Worst: {guess.worstNumQuotes} quotes</p>
      </div>
    </div>
  );
}

export default BookshelfBook;
