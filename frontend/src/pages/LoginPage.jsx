import { useState } from "react";
import api from "../services/api.js";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await api.post("/api/v1/auth/login", formData);
      localStorage.setItem("access_token", response.data.access_token);
      setMessage("Login successful. Token saved.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Login failed.");
    }
  }

  return (
    <main className="form-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

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
          />
        </label>

        <button type="submit">Login</button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </main>
  );
}

export default LoginPage;