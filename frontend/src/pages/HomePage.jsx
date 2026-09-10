import React from "react";
import {useEffect,useState} from "react";
import FeatureList from "../components/FeatureList.jsx";
import api from "../services/api.js";
const features = [
  "Student profiles",
  "Resume upload",
  "ATS scoring",
  "Job recommendations",
  "Interview question generator",
  "Recruiter and admin dashboards",
];

function HomePage() {
  const [projectInfo, setProjectInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProjectInfo() {
      try {
        const response = await api.get("/api/v1/info");
        setProjectInfo(response.data);
      } catch (error) {
        setErrorMessage("Unable to connect to Backend API.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectInfo();
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Final-year full-stack project</p>
          <h1>AI Career & Placement Portal</h1>
          <p className="hero-text">
            A placement preparation platform for students, recruiters, and
            administrators, built step by step with React and FastAPI.
          </p>
          {isLoading && <p>Loading project info...</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
          {projectInfo && (
            <p className="muted">Version: {projectInfo.version}</p>
          )}
        </div>
      </section>

      <section className="content-section">
        <h2>Planned MVP Features</h2>
        <FeatureList features={features} />
      </section>
    </main>
  );
}

export default HomePage;

