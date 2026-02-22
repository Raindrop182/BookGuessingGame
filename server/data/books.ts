import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  quotes: { type: [String], default: [] },
});

export const Book = mongoose.model("Book", BookSchema);
