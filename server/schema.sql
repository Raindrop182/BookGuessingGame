CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  quotes TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  googleid VARCHAR(255) UNIQUE NOT NULL,
  avatar_color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF'
);

CREATE TABLE IF NOT EXISTS book_guesses (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  best_num_quotes INTEGER NOT NULL,
  worst_num_quotes INTEGER NOT NULL,
  UNIQUE(user_id, book_id)
);

CREATE TABLE IF NOT EXISTS book_of_the_day_stats (
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  num_quotes INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON "session" ("expire");
CREATE INDEX IF NOT EXISTS idx_users_googleid ON users(googleid);
CREATE INDEX IF NOT EXISTS idx_book_guesses_user_id ON book_guesses(user_id);
CREATE INDEX IF NOT EXISTS idx_bod_stats_user_id ON book_of_the_day_stats(user_id);