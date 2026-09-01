import { Pool } from "pg";

export async function fetchFullUser(pool: Pool, userId: string | number) {
  const userResult = await pool.query(
    `SELECT 
      u.id, 
      u.name, 
      u.avatar_color AS "avatarColor",
      b.date, 
      b.num_quotes AS "numQuotes", 
      b.status
     FROM users u
     LEFT JOIN book_of_the_day_stats b ON u.id = b.user_id
     WHERE u.id = $1`,
    [userId]
  );

  const row = userResult.rows[0];
  if (!row) return null;

  // Fetch book guesses history
  const guessesResult = await pool.query(
    `SELECT 
      book_id AS "bookId", 
      best_num_quotes AS "bestNumQuotes", 
      worst_num_quotes AS "worstNumQuotes"
     FROM book_guesses 
     WHERE user_id = $1`,
    [userId]
  );

  return {
    id: row.id,
    name: row.name,
    avatarColor: row.avatarColor,
    booksGuessed: guessesResult.rows,
    bookofthedayStats: row.date
      ? {
          date: row.date,
          numQuotes: row.numQuotes,
          status: row.status,
        }
      : null,
  };
}