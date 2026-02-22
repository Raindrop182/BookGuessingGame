import express from "express";
import cors from "cors";
import books from "./data/books.json" with { type: "json" };
import { Book } from "./data/books.ts";
import mongoose from "mongoose";
import { connectDB } from "./utils/db.ts";

const app = express();
const PORT = 5000;

connectDB();

app.use(cors()); // allow frontend to fetch

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
