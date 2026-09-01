import { Pool } from "pg";
import * as fs from "fs";

import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, //don't verify if SSL certificate is signed by a trusted Certificate Authority
    //necessary for some hosting platforms like Render
  },
});

export async function connectDB() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

export function getPool() {
  return pool;
}

export async function seedDB() {
  try {
    const count = await pool.query("SELECT COUNT(*) FROM books");
    if (count.rows[0].count === "0") {
      console.log("Seeding database with books.json...");

      const booksData = JSON.parse(fs.readFileSync("./data/books.json", "utf-8"));

      for (const book of booksData) {
        await pool.query(
          "INSERT INTO books (id, title, quotes) VALUES ($1, $2, $3)",
          [book.id, book.title, book.quotes]
        );
      }
      console.log("Seed complete!");
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}

export async function initDB() {
  try {
    const schema = fs.readFileSync("./schema.sql", "utf-8");
    await pool.query(schema);
    console.log("Database schema initialized");
    await seedDB();
  } catch (err) {
    console.error("Failed to initialize schema:", err);
  }
}
