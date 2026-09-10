import { useState } from "react";
import api from "../services/api.js";

function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/api/v1/auth/register", formData);
      setMessage("Registration successful. You can now login.");
      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "student",
      });
    } catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed.");
    }
  }

  return (
    <main className="form-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        <label>
          Full Name
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </label>

        <label>
          Role
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </label>

        <button type="submit">Register</button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </main>
  );
}

export default RegisterPage;