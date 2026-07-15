const express = require("express");
const Suggestion = require("../models/Suggestion");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// @route  GET /api/admin/suggestions  (admin only) - all users' suggestions
router.get("/suggestions", auth, adminOnly, async (req, res) => {
  try {
    const all = await Suggestion.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  DELETE /api/admin/suggestions/:id  (admin only)
router.delete("/suggestions/:id", auth, adminOnly, async (req, res) => {
  try {
    const plan = await Suggestion.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Entry not found" });
    await plan.deleteOne();
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
