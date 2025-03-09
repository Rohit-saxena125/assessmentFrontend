import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./Component/login/login/login";
import Profile from "./Component/profile/profile";
import Listing from "./Component/listing/listing";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const handleAuth = (userData) => {
    setToken(userData.data.accessToken);
    localStorage.setItem("token", userData.data.accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for Login/Signup */}
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/profile" />
              ) : (
                <AuthForm onAuth={handleAuth} />
              )
            }
          />

          {/* Route for Profile */}
          <Route
            path="/profile"
            element={
              token ? (
                <Profile user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route for Listing */}
          <Route
            path="/listing"
            element={
              token ? (
                <Listing />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              token ? (
                <Navigate to="/profile" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;