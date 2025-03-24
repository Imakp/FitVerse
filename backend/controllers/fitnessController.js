const FitnessData = require("../models/FitnessData");



// Update fitness data (e.g., steps, calories, etc.)
const updateFitnessData = async (req, res) => {
  try {
    const { userId, stepCount, activeMinutes, caloriesBurned } = req.body;

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let fitnessRecord = await FitnessData.findOne({ userId });

    if (!fitnessRecord) {
      fitnessRecord = new FitnessData({
        userId,
        stepCount,
        activeMinutes,
        caloriesBurned,
      });
    } else {
      fitnessRecord.stepCount = stepCount;
      fitnessRecord.activeMinutes = activeMinutes;
      fitnessRecord.caloriesBurned = caloriesBurned;
    }

    await fitnessRecord.save();
    res.status(200).json({ message: "Fitness data updated successfully" });
  } catch (error) {
    console.error("Error updating fitness data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateFitnessData };
