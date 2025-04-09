const express = require("express");
const router = express.Router();
const { updateFitnessData } = require("../controllers/fitnessController");
const { isAuthenticated } = require("../middleware/auth");

router.post("/update", isAuthenticated, updateFitnessData);

module.exports = router;
