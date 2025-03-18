const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
require("dotenv").config();

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
            profilePicture: profile.photos[0].value,
            googleTokens: {
              accessToken,
              refreshToken,
              scope: profile._json.scope,
            },
          });
        } else {
          // Update tokens
          user.googleTokens = {
            accessToken,
            refreshToken,
            scope: profile._json.scope,
          };
        }

        await user.save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
