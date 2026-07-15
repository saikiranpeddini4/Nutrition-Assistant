import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const MyDietPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/diet/my");
      setPlans(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your diet plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/diet/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete plan");
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Diet Suggestions</h1>
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : plans.length === 0 ? (
        <p className="empty-state">
          You don't have any diet plans yet. <Link to="/new-plan">Create one now</Link>.
        </p>
      ) : (
        plans.map((plan) => (
          <div className="suggestion-card" key={plan._id}>
            <div className="suggestion-header">
              <div className="stats">
                <span>Age: {plan.age}</span>
                <span>Height: {plan.height}</span>
                <span>Weight: {plan.weight}</span>
              </div>
              <button
                className="delete-icon"
                onClick={() => handleDelete(plan._id)}
                title="Delete this plan"
              >
                🗑️
              </button>
            </div>
            <div className="suggestion-body">
              <div className="row">
                <strong>Timing:</strong> {plan.timing}
              </div>
              <div className="row">
                <strong>Calorie Intake:</strong> {plan.calorieIntake}
              </div>
              <div className="row">
                <strong>Walk:</strong> {plan.walk}
              </div>
              <div className="row">
                <strong>Carbohydrate Needs:</strong> {plan.carbNeeds}
              </div>
              <div className="row">
                <strong>Protein Needs:</strong> {plan.proteinNeeds}
              </div>
              <div className="row">
                <strong>BMI:</strong> {plan.bmi}
              </div>

              <div className="suggestion-note">
                <span className="label">Suggestion:</span>
                {plan.suggestion}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyDietPlan;
