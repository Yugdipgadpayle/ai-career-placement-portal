import { useState } from "react";
import api from "../services/api.js";

function ResumeParsePage() {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  async function handleParseResume() {
    setMessage("");
    setResult(null);
    setIsParsing(true);

    try {
      const response = await api.get("/api/v1/resumes/parse");
      setResult(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Unable to parse resume.");
    } finally {
      setIsParsing(false);
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow-dark">Resume Parser</p>
          <h1>Extract Resume Skills</h1>
          <p>Analyze your uploaded resume and detect technical skills.</p>
        </div>
      </section>

      <button
        className="primary-button compact-button"
        onClick={handleParseResume}
        disabled={isParsing}
      >
        {isParsing ? "Parsing..." : "Parse My Resume"}
      </button>

      {message && <p className="error-text">{message}</p>}

      {result && (
        <section className="parse-result">
          <div>
            <h2>Detected Skills</h2>

            {result.detected_skills.length === 0 ? (
              <p>No known skills detected.</p>
            ) : (
              <div className="skill-tags">
                {result.detected_skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2>Resume Text Preview</h2>
            <pre>{result.text_preview}</pre>
          </div>
        </section>
      )}
    </main>
  );
}

export default ResumeParsePage;