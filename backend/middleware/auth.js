const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    console.log("User authenticated via session:", req.user._id);
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      req.user = decoded;
      console.log("User authenticated via token:", decoded._id);
      return next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
    }
  }

  console.log("Authentication failed. Headers:", JSON.stringify(req.headers));
  console.log("Session data:", req.session);
  res.status(401).json({ message: "Unauthorized: Please log in." });
};

module.exports = { isAuthenticated };
