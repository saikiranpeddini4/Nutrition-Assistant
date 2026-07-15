import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const NewPlan = () => {
  const [form, setForm] = useState({ age: "", height: "", weight: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/diet/suggest", form);
      navigate("/my-diet-plan");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="plan-layout">
        <div className="plan-intro">
          <h2>Get Your Personalized Diet Plan</h2>
          <p>
            Fill in your age, height, and weight to receive a personalized diet plan tailored to
            your wellness goals. Our smart system uses science-backed recommendations to support
            your nutrition journey.
          </p>
          <p>
            Make sure your information is accurate. Always consult a healthcare professional for
            medical advice.
          </p>
        </div>

        <div className="plan-form">
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Ex: 20"
                value={form.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                placeholder="Ex: 170"
                value={form.height}
                onChange={handleChange}
                min="50"
                max="250"
                required
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="Ex: 60"
                value={form.weight}
                onChange={handleChange}
                min="10"
                max="400"
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Generating..." : "Get Diet Suggestions"}
            </button>
          </form>
          <Link className="back-home-link" to="/home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewPlan;
