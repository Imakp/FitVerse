const passport = require("passport");
const User = require("../models/user");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`[Passport Deserialize] Attempting to deserialize user with ID: ${id}`);
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log(`[Passport Deserialize] No user found for ID: ${id}`);
      return done(null, null);
    }
    console.log(`[Passport Deserialize] User found: ${user.displayName || user._id}`);
    done(null, user);
  } catch (err) {
    console.error(`[Passport Deserialize] Error deserializing user ID ${id}:`, err);
    done(err, null); 
  }
});
