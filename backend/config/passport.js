const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
require("dotenv").config();

const backendUrl = process.env.API_URL ?? "https://localhost:3000"; // Updated production URL

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${backendUrl}/auth/google/callback`,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ oauthId: profile.id });

        if (!user) {
          user = new User({
            oauthProvider: "google",
            oauthId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value.replace(/sz=50$/, "sz=200"),
          });
          await user.save();
        }

        done(null, {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          _id: user._id,
        });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
