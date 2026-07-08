import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // if using React Router
import "../styles/LoginPage.css";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user.status !== "active") {
          alert(`Account is ${data.user.status}. Please wait for approval.`);
          return;
        }

        // Navigate based on role
        switch (data.user.role) {
          case "admin":
            navigate("/AdminDashboard");
            break;
          case "manager":
            navigate("/ManagerDashboard");
            break;
          case "staff":
            navigate("/StaffDashboard");
            break;
          default:
            alert("Unknown role");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
      </div>
    </div>
  );
}

export default LoginPage;
