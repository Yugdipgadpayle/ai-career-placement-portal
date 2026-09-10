import { useState } from "react";
import api from "../services/api.js";

function InterviewPrepPage() {
  const [formData, setFormData] = useState({
    job_role: "",
    skills: "",
    difficulty: "beginner",
  });

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setResult(null);
    setIsGenerating(true);

    try {
      const response = await api.post("/api/v1/interview/questions", formData);
      setResult(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to generate interview questions."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow-dark">Interview Prep</p>
          <h1>Question Generator</h1>
          <p>Generate technical and HR questions based on your target role.</p>
        </div>
      </section>

      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <label>
          Job Role
          <input
            name="job_role"
            value={formData.job_role}
            onChange={handleChange}
            placeholder="Junior Full Stack Developer"
            required
          />
        </label>

        <label>
          Skills
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Python, FastAPI, React, SQL, Git"
            required
          />
        </label>

        <label>
          Difficulty
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <button type="submit" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Questions"}
        </button>
      </form>

      {message && <p className="error-text">{message}</p>}

      {result && (
        <section className="interview-result">
          <h2>
            {result.job_role} - {result.difficulty}
          </h2>

          <div className="report-grid">
            <div>
              <h3>Technical Questions</h3>
              <ol>
                {result.technical_questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3>HR Questions</h3>
              <ol>
                {result.hr_questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3>Preparation Tips</h3>
              <ul>
                {result.preparation_tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default InterviewPrepPage;