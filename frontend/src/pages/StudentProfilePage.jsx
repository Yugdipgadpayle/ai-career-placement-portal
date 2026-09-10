import { useEffect, useState } from "react";
import api from "../services/api.js";

function StudentProfilePage() {
  const [formData, setFormData] = useState({
    college: "",
    degree: "",
    branch: "",
    graduation_year: "",
    skills: "",
    career_goal: "",
    resume_url: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/api/v1/students/profile");

        setFormData({
          college: response.data.college,
          degree: response.data.degree,
          branch: response.data.branch,
          graduation_year: response.data.graduation_year,
          skills: response.data.skills,
          career_goal: response.data.career_goal || "",
          resume_url: response.data.resume_url || "",
        });
      } catch (error) {
        if (error.response?.status !== 404) {
          setMessage(error.response?.data?.detail || "Unable to load profile.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

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
      await api.post("/api/v1/students/profile", {
        ...formData,
        graduation_year: Number(formData.graduation_year),
        resume_url: formData.resume_url || null,
        career_goal: formData.career_goal || null,
      });

      setMessage("Profile saved successfully.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Unable to save profile.");
    }
  }

  if (isLoading) {
    return (
      <main className="form-page">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="form-page">
      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <h1>Student Profile</h1>

        <label>
          College
          <input
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Degree
          <input
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Branch
          <input
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Graduation Year
          <input
            name="graduation_year"
            type="number"
            value={formData.graduation_year}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Skills
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Python, FastAPI, React, SQL"
            required
          />
        </label>

        <label>
          Career Goal
          <input
            name="career_goal"
            value={formData.career_goal}
            onChange={handleChange}
            placeholder="Backend Developer"
          />
        </label>

        <label>
          Resume URL
          <input
            name="resume_url"
            value={formData.resume_url}
            onChange={handleChange}
            placeholder="Optional for now"
          />
        </label>

        <button type="submit">Save Profile</button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </main>
  );
}

export default StudentProfilePage;