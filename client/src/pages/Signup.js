import React, { useState } from "react";
import { database, ref, push } from "../firebase";
import "../SignupForm.css";
import { Link } from "react-router-dom"; 

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    authId: "",
    authKey: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usersRef = ref(database, "users");
      await push(usersRef, formData);

      alert("✅ Signup successful!");
      console.log("Saved to Firebase:", formData);

      setFormData({
        name: "",
        email: "",
        mobile: "",
        address: "",
        authId: "",
        authKey: "",
      });
    } catch (error) {
      console.error("❌ Error saving to Firebase:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>🚀 Create Account</h2>
        <p>
          Enter your details below. <strong>Auth Key is required for test access.</strong>
        </p>

        {[
          { label: "Name", name: "name", type: "text", placeholder: "John Doe" },
          { label: "Email", name: "email", type: "email", placeholder: "johndoe@example.com" },
          { label: "Mobile", name: "mobile", type: "tel", placeholder: "+1234567890" },
          // { label: "Auth ID", name: "authId", type: "text", placeholder: "MERCH-ABC123" },
          // { label: "Auth Key", name: "authKey", type: "text", placeholder: "Your secret auth key" },
        ].map((field) => (
          <div className="signup-field" key={field.name}>
            <label className="signup-label">{field.label}</label>
            <input
              className="signup-input"
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
            />
          </div>
        ))}

        <div className="signup-field">
          <label className="signup-label">Address</label>
          <textarea
            className="signup-input"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
            required
            style={{ height: "80px", resize: "vertical" }}
          />
        </div>

        <button type="submit" className="signup-button">
          Sign Up
        </button>
         <p className="signup-footer">
          Already have an account?{" "}
          <Link to="/login" className="login-link">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
