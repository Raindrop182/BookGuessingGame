import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { getPool } from "./db.ts";
import {fetchFullUser} from "../userHelper.ts"

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/login", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).send("Invalid token");

    // Find or create user
    const pool = getPool();
    const result = await pool.query("SELECT * FROM users WHERE googleid = $1",
      [payload.sub]
    );
    const user=result.rows[0];
    if (!user) {
      console.log("Creating new user");
      const insertResult = await pool.query("INSERT INTO users (name, googleid, avatar_color) VALUES ($1, $2, $3) RETURNING *", [payload.name, payload.sub, "#FFFFFF"]);
    }

    // Save user id in session
    req.session.userId = user.id;

    const fullUser = await fetchFullUser(pool, user.id);
    res.json({ user: fullUser });
  } catch (error) {
    console.error("!!! DETAILED LOGIN ERROR !!!");
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

export default router;
