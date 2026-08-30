import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import type { Book } from "../../types";

import { useUser } from "../Utils/UserContext";
import Avatar from "./Avatar.tsx";
import BookshelfBook from "./BookshelfBook.tsx";

import "./ProfilePage.css";

const ProfilePage = () => {
  const { books } = useOutletContext<{ books: Book[] }>();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        // check user again after 3 seconds
        // if user still doesn't exist, return home
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
