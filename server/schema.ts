import mongoose from "mongoose";

type GameState = "won" | "lost" | "on";

const BookSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  quotes: { type: [String], default: [] },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  googleid: { type: String, required: true },
  avatarColor: { type: String, required: true },
  booksGuessed: [
    {
      bookId: { type: Number, required: true },
      bestNumQuotes: { type: Number, required: true },
      worstNumQuotes: { type: Number, required: true },
    },
  ],
  bookofthedayStats: {
    date: { type: String, required: false },
    numQuotes: { type: Number, required: true },
    status: { type: String, required: true },
  },
});

export const Book = mongoose.model("Book", BookSchema);
export const User = mongoose.model("User", UserSchema);
