const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth"); // OAuth routes
require("./config/passport"); // Passport config
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const morgan = require("morgan");

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with process.env.CLIENT_URL in production
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
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
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }, // Adjust based on deployment
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
