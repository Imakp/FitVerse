const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  oauthProvider: { type: String, required: true }, // e.g., "google"
  oauthId: { type: String, required: true }, // Unique ID from OAuth provider
  email: { type: String, required: true, unique: true },
  name: { type: String },
  profilePicture: { type: String }
});

module.exports = mongoose.model("User", userSchema);
