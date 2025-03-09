import React, { useState } from "react";
import "../login/login.css";

function AuthForm({ onAuth }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFlipped) {
      // Login
      const { firstName, password } = formData;
      if (firstName && password) {
        try {
          const response = await fetch("http://3.6.60.175:8001/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, password }),
          });

          if (response.ok) {
            const data = await response.json();
            onAuth(data); // Pass the response data to the parent component
          } else {
            alert("Login failed. Please check your credentials.");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred during login.");
        }
      } else {
        alert("Please fill in all fields.");
      }
    } else {
      // Signup
      const { firstName, lastName, email, phone } = formData;
      if (firstName && lastName && email && phone ) {
        try {
          const response = await fetch("http://3.6.60.175:8001/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, lastName, email, phone }),
          });

          if (response.ok) {
            const data = await response.json();
            alert("Signup successful. Please login to continue.");
            setIsFlipped(true);
          } else {
            alert("Signup failed. Please try again.");
          }
        } catch (error) {
          console.error("Error during signup:", error);
          alert("An error occurred during signup.");
        }
      } else {
        alert("Please fill in all fields.");
      }
    }
  };

  return (
    <div className={`auth-container ${isFlipped ? "flipped" : ""}`}>
      <div className="auth-card">
        {/* Signup Form */}
        <div className="auth-front">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsFlipped(true)}>Login</button>
          </p>
        </div>

        {/* Login Form */}
        <div className="auth-back">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account?{" "}
            <button onClick={() => setIsFlipped(false)}>Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;