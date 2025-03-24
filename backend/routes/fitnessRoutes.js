const express = require("express");
const router = express.Router();
// const User = require("../models/user");


const {updateFitnessData} = require("../controllers/fitnessController")

router.post("/update", updateFitnessData);

module.exports = router;
