const express = require("express");
const passport = require("passport");

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://localhost:5173";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res, next) => {
  console.log("Received callback from Google");
  passport.authenticate("google", (err, user, info) => {
    console.log("Passport authenticate callback executing...");
    if (err) {
      console.error("Passport authentication error:", err);
      return res.redirect(
        `${FRONTEND_URL}/login?error=auth_failed&details=${encodeURIComponent(
          err.message || "Unknown error"
        )}`
      );
    }
    if (!user) {
      console.warn("Passport authentication: No user found or returned.", info);
      const infoMessage = info?.message || "No user returned from strategy";
      return res.redirect(
        `${FRONTEND_URL}/login?error=no_user&details=${encodeURIComponent(
          infoMessage
        )}`
      );
    }

    console.log("Passport authentication successful, user:", user);

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("req.logIn error:", loginErr);
        return res.redirect(
          `${FRONTEND_URL}/login?error=login_failed&details=${encodeURIComponent(
            loginErr.message || "Session login failed"
          )}`
        );
      }

      req.session.userId = user._id;
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error:", saveErr);
        }
        console.log("Session saved successfully. Redirecting to dashboard.");
        return res.redirect(`${FRONTEND_URL}/dashboard`);
      });
    });
  })(req, res, next);
});

// Get User Info (Session-based authentication)
router.get("/user", (req, res) => {
  console.log("Auth check request received");
  console.log("Is authenticated:", req.isAuthenticated());
  console.log("Session:", req.session);

  if (req.isAuthenticated()) {
    console.log("User is authenticated:", req.user);
    res.json(req.user);
  } else {
    console.log("User is not authenticated");
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Fix CORS issue during logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((error) => {
      if (error) return res.status(500).json({ message: "Logout failed" });

      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Logged out successfully" }); // ✅ Send JSON response
    });
  });
});

module.exports = router;
