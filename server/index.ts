import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./utils/auth.ts";
import { connectDB, initDB } from "./utils/db.ts";
import { getPool } from "./utils/db.ts";
import {fetchFullUser} from "./userHelper.ts"

dotenv.config();

const app = express();
app.enable("trust proxy"); //necessary if hosting through a secondary platform, like Render

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: //restricts API access to only the front-end domain
      process.env.NODE_ENV === "production"
        ? "https://bookguessinggame.onrender.com"
        : "http://localhost:5173",
    credentials: true, //allows cookies
  }),
);

const __dirname = path.resolve();

connectDB();
const pool = getPool(); //set of active database connectinos

app.use(express.json()); // parse the body as json and put it in req.body

// set up session (to keep track of who is currently logged in)
const PgSession = connectPgSimple(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      pool: pool,
      tableName: "session",
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
    const books = await pool.query("SELECT * FROM books")
    res.json(books.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/api/user", async (req, res) => {
  if (!req.session.userId) return res.status(401).json(null);

  try {
    const user = await fetchFullUser(pool, req.session.userId);
    if (!user) return res.status(404).json(null);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.put("/api/user", async (req, res) => {
  console.log("Update body:", req.body);

  if (!req.session.userId)
    return res.status(401).json({ error: "Not logged in" });

  const updates = req.body;

  try {
    if (updates.booksGuessed) {
      for(const guess of updates.booksGuessed){
        const { bookId, numQuotes } = guess;
        await pool.query(`INSERT INTO book_guesses (user_id, book_id, best_num_quotes, worst_num_quotes)
          VALUES ($1, $2, $3, $3)
          ON CONFLICT (user_id, book_id)
          DO UPDATE SET
          best_num_quotes=LEAST(book_guesses.best_num_quotes, $3), worst_num_quotes=GREATEST(book_guesses.worst_num_quotes, $3)`,
          [req.session.userId, guess.bookId, guess.numQuotes]);
      }
    }

    if (updates.avatarColor){
      await pool.query("UPDATE users SET avatar_color=$1 WHERE id=$2", [updates.avatarColor, req.session.userId])
    }

    if(updates.name){
        await pool.query("UPDATE users SET name=$1 WHERE id=$2", [updates.name, req.session.userId])
    }

    if(updates.bookofthedayStats){
      await pool.query(
        `INSERT INTO book_of_the_day_stats (user_id, date, num_quotes, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET date = $2, num_quotes = $3, status = $4`,
        [req.session.userId, updates.bookofthedayStats.date, updates.bookofthedayStats.numQuotes, updates.bookofthedayStats.status]
      );
    }

    const updatedUser = await fetchFullUser(pool, req.session.userId);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
}
});

app.use(express.static(path.join(__dirname, "client/dist")));

//for single page application routing
// if the request path does not start with /api, serve index.html
// once loaded in browser, the front-end router will take over and handle the routing
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
