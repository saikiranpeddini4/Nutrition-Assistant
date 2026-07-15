import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewPlan from "./pages/NewPlan";
import MyDietPlan from "./pages/MyDietPlan";
import AdminPanel from "./pages/AdminPanel";

const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

function App() {
  const [user, setUser] = useState(getStoredUser());

  const handleAuth = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const PrivateRoute = ({ children }) => (user ? children : <Navigate to="/login" replace />);
  const AdminRoute = ({ children }) =>
    user && user.isAdmin ? children : <Navigate to="/home" replace />;

  return (
    <BrowserRouter>
      <div className="app-bg">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/signup"
            element={user ? <Navigate to="/home" replace /> : <Signup onAuth={handleAuth} />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/home" replace /> : <Login onAuth={handleAuth} />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-plan"
            element={
              <PrivateRoute>
                <NewPlan />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-diet-plan"
            element={
              <PrivateRoute>
                <MyDietPlan />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
          <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
        </Routes>
        {user && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default App;
