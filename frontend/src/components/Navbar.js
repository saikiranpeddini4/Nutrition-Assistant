import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  if (!user) {
    return (
      <nav className="navbar">
        <div className="brand">Nutri-Assist</div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="brand">Nutri-Assist</div>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/new-plan">New Plan</Link>
        <Link to="/my-diet-plan">My Diet Plan</Link>
        {user.isAdmin && <Link to="/admin">Admin Panel</Link>}
        <button onClick={handleLogout}>Logout</button>
        <span className="user-name">( {user.fullName} )</span>
      </div>
    </nav>
  );
};

export default Navbar;
