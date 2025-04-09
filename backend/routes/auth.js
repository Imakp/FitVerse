const express = require("express");
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

router.post("/google", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Authorization code is missing" });
    }

    const { tokens } = await oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      return res.status(400).json({ message: "ID token not found" });
    }

    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: "Invalid ID token" });
    }

    let user = await User.findOne({ oauthId: payload.sub });

    if (!user) {
      user = new User({
        oauthProvider: "google",
        oauthId: payload.sub,
        name: payload.name,
        email: payload.email,
        profilePicture: payload.picture,
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.SESSION_SECRET,
      { expiresIn: "24h" }
    );

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error after Google auth:", err);
        return res
          .status(500)
          .json({ message: "Login failed after authentication" });
      }
      res.json({
        token, // Send token to client
        id: user.id,
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      });
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((error) => {
      if (error) return res.status(500).json({ message: "Logout failed" });

      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
