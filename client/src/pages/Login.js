import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ import Link
import { database, ref, get } from "../firebase";
import "../SignupForm.css";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const matchedUser = Object.values(usersData).find(
          (user) =>
            user.name === credentials.username &&
            user.mobile === credentials.password
        );

        if (matchedUser) {
          alert("✅ Login successful!");
          console.log("User logged in:", matchedUser);
          navigate("/main", { state: { username: credentials.username } });
        } else {
          alert("❌ Invalid username or password.");
        }
      } else {
        alert("❌ No users found in the database.");
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleLogin} className="signup-form">
        <h2>🔐 Login</h2>
        <p>
          Enter your <strong>Username</strong> (name) and <strong>Password</strong> (phone number) to continue.
        </p>

        <div className="signup-field">
          <label className="signup-label">Username</label>
          <input
            className="signup-input"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="signup-field">
          <label className="signup-label">Password</label>
          <input
            className="signup-input"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <button type="submit" className="signup-button">
          Login
        </button>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <p>
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "#007bff", textDecoration: "underline" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
