import express from "express";
import cors from "cors";
import books from "./data/books.json" with { type: "json" };

const app = express();
const PORT = 5000;

app.use(cors()); // allow frontend to fetch

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
