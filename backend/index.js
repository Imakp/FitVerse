const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth"); // OAuth routes
require("./config/passport"); // Passport config
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Replace with process.env.CLIENT_URL in production
    credentials: true, // Allow cookies
  })
);

// Use morgan middleware to log HTTP requests
app.use(morgan("dev"));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
