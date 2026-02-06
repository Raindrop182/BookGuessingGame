import type { Book } from "../types";

const BookDropdown = ({
  books,
  onSelect,
}: {
  books: Book[];
  onSelect: (bookId: number) => void;
}) => {
  return (
    <select
      defaultValue=""
      onChange={(e) => {
        const selectedId = Number(e.target.value);
        const book = books.find((b) => b.id === selectedId);
        if (book) onSelect(book);
      }}
    >
      <option value="" disabled>
        Select a book
      </option>
      {books.map((book) => (
        <option key={book.id} value={book.id}>
          {book.title}
        </option>
      ))}
    </select>
  );
};

export default BookDropdown;
