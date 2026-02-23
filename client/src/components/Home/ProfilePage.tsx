import type { Book } from "../../types";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useUser } from "../Utils/UserContext";
import "./ProfilePage.css";
import Avatar from "./Avatar.tsx";
import BookshelfBook from "./BookshelfBook.tsx";
import { useEffect } from "react";

const ProfilePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        // check user again after 3 seconds
        if (!user) {
          navigate("/", { replace: true });
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user || !user.booksGuessed || books.length == 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-left">
        <h1 className="username">{user.name}</h1>
        <Avatar color={user.avatarColor} />
      </div>

      <div className="profile-right">
        <h1 className="username">Bookshelf</h1>
        <h2 className="profile-info">
          {" "}
          You have {books.length - user.booksGuessed.length} books left to be
          discovered.
        </h2>
        <div className="guessed-books">
          {user.booksGuessed.map((guess) => (
            <BookshelfBook guess={guess} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
