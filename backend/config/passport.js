const passport = require("passport");
const User = require("../models/user");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
