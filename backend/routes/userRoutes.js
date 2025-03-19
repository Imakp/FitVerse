const express = require("express");
const { getBalance } = require("../controllers/userController");

const router = express.Router();

router.get("/balance/:userId", getBalance);

module.exports = router;