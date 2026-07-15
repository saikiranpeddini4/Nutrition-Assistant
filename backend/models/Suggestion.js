const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true }, // cm
    weight: { type: Number, required: true }, // kg
    bmi: { type: Number, required: true },
    timing: { type: String, required: true },
    calorieIntake: { type: Number, required: true },
    walk: { type: String, required: true },
    carbNeeds: { type: String, required: true },
    proteinNeeds: { type: String, required: true },
    suggestion: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Suggestion", SuggestionSchema);
