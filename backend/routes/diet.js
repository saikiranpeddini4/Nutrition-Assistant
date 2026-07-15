const express = require("express");
const Suggestion = require("../models/Suggestion");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Simple, transparent rule-based diet logic (Mifflin-St Jeor style approximation)
function generateSuggestion({ age, height, weight }) {
  const heightM = height / 100;
  const bmi = +(weight / (heightM * heightM)).toFixed(2);

  // Rough baseline calorie estimate (unisex simplified formula)
  let baseCalories = Math.round(10 * weight + 6.25 * height - 5 * age + 5);

  let bmiCategory;
  let calorieIntake;
  let suggestion;
  let walk;

  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    calorieIntake = baseCalories + 300;
    walk = "2-3km";
    suggestion = "Increase calorie intake with a balanced diet rich in proteins, healthy fats, and complex carbs.";
  } else if (bmi < 25) {
    bmiCategory = "Normal";
    calorieIntake = baseCalories;
    walk = "3-4km";
    suggestion = "Maintain your current balanced diet and stay active with regular walks and light exercise.";
  } else if (bmi < 30) {
    bmiCategory = "Overweight";
    calorieIntake = baseCalories - 300;
    walk = "4-5km";
    suggestion = "Reduce refined carbs and sugary foods, increase fiber and protein intake, and walk daily.";
  } else {
    bmiCategory = "Obese";
    calorieIntake = baseCalories - 500;
    walk = "5-6km";
    suggestion = "Adopt a calorie-controlled diet high in vegetables and lean protein; consult a healthcare professional for a tailored plan.";
  }

  calorieIntake = Math.max(1200, calorieIntake); // safety floor

  const carbLow = Math.round((calorieIntake * 0.45) / 4);
  const carbHigh = Math.round((calorieIntake * 0.55) / 4);
  const proteinLow = Math.round(weight * 0.8);
  const proteinHigh = Math.round(weight * 1.0);

  return {
    bmi,
    bmiCategory,
    timing: "3 meals and 2 snacks",
    calorieIntake,
    walk,
    carbNeeds: `${carbLow}-${carbHigh}g`,
    proteinNeeds: `${proteinLow}-${proteinHigh}g`,
    suggestion,
  };
}

// @route  POST /api/diet/suggest  (auth required)
router.post("/suggest", auth, async (req, res) => {
  try {
    const { age, height, weight } = req.body;
    const ageNum = Number(age);
    const heightNum = Number(height);
    const weightNum = Number(weight);

    if (!ageNum || !heightNum || !weightNum || ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      return res.status(400).json({ message: "Please provide valid age, height, and weight" });
    }

    const result = generateSuggestion({ age: ageNum, height: heightNum, weight: weightNum });

    const doc = await Suggestion.create({
      user: req.user.id,
      email: req.user.email,
      age: ageNum,
      height: heightNum,
      weight: weightNum,
      bmi: result.bmi,
      timing: result.timing,
      calorieIntake: result.calorieIntake,
      walk: result.walk,
      carbNeeds: result.carbNeeds,
      proteinNeeds: result.proteinNeeds,
      suggestion: result.suggestion,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  GET /api/diet/my  (auth required) - current user's plans
router.get("/my", auth, async (req, res) => {
  try {
    const plans = await Suggestion.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  DELETE /api/diet/:id  (auth required, owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const plan = await Suggestion.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this plan" });
    }
    await plan.deleteOne();
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
