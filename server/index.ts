import express from "express";
import session from "express-session";
import { Book } from "./schema.ts";
import mongoose from "mongoose";
import { connectDB, seedDB } from "./utils/db.ts";
import dotenv from "dotenv";
import authRoutes from "./utils/auth.ts";
import cors from "cors";
import { User } from "./schema.ts";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true,
  }),
);

// Serve static front-end files
const __dirname = path.resolve(); // necessary for ES modules

connectDB();
seedDB();

app.use(express.json()); // parse the body as json and put it in req.body
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: (process.env.NODE_ENV ?? "development") === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use("/api/auth", authRoutes);

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/api/user", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json(null);
  }

  const user = await User.findById(req.session.userId);
  res.json(user);
});

app.put("/api/user", async (req, res) => {
  console.log("Update body:", req.body);

  if (!req.session.userId)
    return res.status(401).json({ error: "Not logged in" });

  const updates = req.body;

  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (updates.booksGuessed) {
      updates.booksGuessed.forEach(
        (guess: { bookId: number; numQuotes: number }) => {
          const index = user.booksGuessed.findIndex(
            (b) => b.bookId === guess.bookId,
          );
          if (index >= 0) {
            user.booksGuessed[index].bestNumQuotes = Math.min(
              user.booksGuessed[index].bestNumQuotes,
              guess.numQuotes,
            );
            user.booksGuessed[index].worstNumQuotes = Math.max(
              user.booksGuessed[index].worstNumQuotes,
              guess.numQuotes,
            );
          } else {
            user.booksGuessed.push({
              bookId: guess.bookId,
              bestNumQuotes: guess.numQuotes,
              worstNumQuotes: guess.numQuotes,
            });
          }
        },
      );
      delete updates.booksGuessed; // remove from generic updates
    }

    // Update other fields generically
    Object.keys(updates).forEach((key) => {
      if (
        key === "name" ||
        key === "bookofthedayStats" ||
        key === "avatarColor"
      ) {
        user[key] = updates[key];
      }
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.use(express.static(path.join(__dirname, "client/dist"))); // Vite output

// Serve React SPA for all non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next(); // skip API routes
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
