import { useState } from "react";
import api from "../services/api.js";

function ATSScorePage() {
  const [requiredSkills, setRequiredSkills] = useState("");
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!requiredSkills.trim()) {
      setMessage("Please enter required skills.");
      return;
    }

    setIsChecking(true);
    setMessage("");
    setReport(null);

    try {
      const response = await api.post("/api/v1/resumes/ats-score", {
        required_skills: requiredSkills,
      });

      setReport(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Unable to calculate ATS score.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow-dark">ATS Score</p>
          <h1>Resume Match Report</h1>
          <p>Compare your uploaded resume against job-required skills.</p>
        </div>
      </section>

      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <label>
          Required Skills
          <textarea
            value={requiredSkills}
            onChange={(event) => setRequiredSkills(event.target.value)}
            placeholder="Python, FastAPI, SQL, Git, React"
            required
          />
        </label>

        <button type="submit" disabled={isChecking}>
          {isChecking ? "Checking..." : "Check ATS Score"}
        </button>
      </form>

      {message && <p className="error-text">{message}</p>}

      {report && (
        <section className="ats-report">
          <div className="score-circle">
            <span>{report.score}%</span>
            <small>ATS Score</small>
          </div>

          <div className="report-grid">
            <div>
              <h2>Matched Skills</h2>
              <ul>
                {report.matched_skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Missing Skills</h2>
              <ul>
                {report.missing_skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Suggestions</h2>
              <ul>
                {report.suggestions.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default ATSScorePage;