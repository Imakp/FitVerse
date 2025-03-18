const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    oauthProvider: {
      type: String,
      required: true,
      enum: ["google"],
    },
    oauthId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: String,
    googleTokens: {
      accessToken: String,
      refreshToken: String,
      scope: String,
      expiresAt: Date,
    },
    fitnessData: {
      lastSync: Date,
      steps: [
        {
          date: Date,
          count: Number,
        },
      ],
      heartRate: [
        {
          date: Date,
          value: Number,
        },
      ],
      sleep: [
        {
          date: Date,
          duration: Number,
          quality: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
