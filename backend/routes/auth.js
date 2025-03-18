const express = require("express");
const passport = require("passport");

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Default frontend URL

// Google Authentication Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
    if (!user) return res.redirect(`${CLIENT_URL}/login?error=no_user`);

    req.logIn(user, (err) => {
      if (err) return res.redirect(`${CLIENT_URL}/login?error=login_failed`);
      return res.redirect(`${CLIENT_URL}/dashboard`);
    });
  })(req, res, next);
});

// Get User Info (Session-based authentication)
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Return user info
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((error) => {
      if (error) return res.status(500).json({ message: "Logout failed" });

      res.clearCookie("connect.sid"); // Clear session cookie
      res.redirect(CLIENT_URL);
    });
  });
});

module.exports = router;
