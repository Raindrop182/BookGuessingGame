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
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();
app.enable("trust proxy");
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://bookguessinggame.onrender.com"
        : "http://localhost:5173",
    credentials: true,
  }),
);

const __dirname = path.resolve();

connectDB();
seedDB();
console.log("NODE_ENV:", process.env.NODE_ENV);

app.use(express.json()); // parse the body as json and put it in req.body
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

app.use(express.static(path.join(__dirname, "client/dist")));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
