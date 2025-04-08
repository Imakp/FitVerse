const router = require("express").Router();
const passport = require("passport");

// Route to get the current authenticated user
router.get("/user", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Google OAuth login route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    // Get the redirect URL from session or use default
    const redirectUrl = req.session.loginRedirectUrl || "/dashboard";
    delete req.session.loginRedirectUrl;

    // Redirect to the frontend
    res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}`);
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
