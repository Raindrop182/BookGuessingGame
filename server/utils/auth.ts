import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../schema.ts";

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
    let user = await User.findOne({ googleid: payload.sub });
    if (!user) {
      user = await User.create({ name: payload.name, googleid: payload.sub });
    }

    // Save user id in session
    req.session.userId = user._id.toString();
    res.json({ user });
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
