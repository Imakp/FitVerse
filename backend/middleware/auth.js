const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

const hasGoogleFitAccess = (req, res, next) => {
  if (!req.user.googleTokens || !req.user.googleTokens.accessToken) {
    return res.status(403).json({ error: "Google Fit not connected" });
  }
  next();
};

module.exports = {
  isAuthenticated,
  hasGoogleFitAccess,
};
