import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  quotes: { type: [String], default: [] },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  googleid: { type: String, required: true },
  booksGuessed: [
    {
      bookId: { type: Number, required: true },
      numQuotes: { type: Number, required: true },
    },
  ],
});

export const Book = mongoose.model("Book", BookSchema);
export const User = mongoose.model("User", UserSchema);
