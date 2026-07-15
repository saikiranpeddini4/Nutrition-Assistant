import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <div className="home-hero">
        <h1>Welcome to Nutrition Assistant 🍎</h1>
        <p>
          Your journey to better health begins here. Whether you're looking to maintain a
          balanced diet, support growth and development, or manage your weight, our assistant is
          ready to provide you with expert guidance tailored to your lifestyle.
        </p>
        <p>
          Click on the button below and answer a few questions about your age, height, and weight
          to get a personalized diet plan.
        </p>

        <div className="image-row">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80"
            alt="Healthy protein and produce"
          />
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"
            alt="Vegetables arranged in a heart shape"
          />
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80"
            alt="Assorted fresh fruit"
          />
        </div>

        <button className="cta-btn" onClick={() => navigate("/new-plan")}>
          Get Diet Plan
        </button>
      </div>
    </div>
  );
};

export default Home;
