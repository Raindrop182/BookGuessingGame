import express from "express";
import cors from "cors";
import { Book } from "./schema.ts";
import mongoose from "mongoose";
import { connectDB, seedDB } from "./utils/db.ts";

const app = express();
const PORT = 5000;

app.use(cors()); // allow frontend to fetch

connectDB();
seedDB();

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
