import mongoose from "mongoose";
import dotenv from "dotenv";
import { Book } from "../schema.ts";
import booksData from "../data/books.json" with { type: "json" };
dotenv.config();

const mongoConnectionSRV = process.env.MONGO_URI!;

export function connectDB() {
  mongoose
    .connect(mongoConnectionSRV)
    .then(() => console.log("Connected."))
    .catch((error) => console.log(error));
}

export async function seedDB() {
  const count = await Book.countDocuments();
  if (count === 0) {
    console.log("Seeding database with books.json...");
    await Book.insertMany(booksData);
    console.log("Seed complete!");
  }
}
