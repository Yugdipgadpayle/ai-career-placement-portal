import { useEffect, useState } from "react";
import api from "../services/api.js";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userResponse = await api.get("/api/v1/users/me");
        const jobsResponse = await api.get("/api/v1/jobs/recommended");

        setUser(userResponse.data);
        setRecommendedJobs(jobsResponse.data);
      } catch (error) {
        setMessage(
          error.response?.data?.detail ||
            "Unable to load dashboard. Please login again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  const bestMatch =
    recommendedJobs.length > 0
      ? Math.max(...recommendedJobs.map((job) => job.match_score || 0))
      : 0;

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow-dark">Student Dashboard</p>
          <h1>Welcome, {user?.full_name || "Student"}</h1>
          <p>{user?.email}</p>
        </div>
      </section>

      {message && <p className="error-text">{message}</p>}

      <section className="stats-grid">
        <div className="stat-card">
          <strong>{recommendedJobs.length}</strong>
          <span>Recommended Jobs</span>
        </div>

        <div className="stat-card">
          <strong>{bestMatch}%</strong>
          <span>Best Match</span>
        </div>

        <div className="stat-card">
          <strong>{user?.role || "student"}</strong>
          <span>Current Role</span>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recommended Jobs</h2>

        {recommendedJobs.length === 0 && (
          <p>No recommended jobs found yet.</p>
        )}

        <div className="job-grid">
          {recommendedJobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div>
                <h3>{job.title}</h3>
                <p>{job.company_name}</p>
              </div>

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <p>
                <strong>Type:</strong> {job.job_type}
              </p>

              <p>
                <strong>Required Skills:</strong> {job.required_skills}
              </p>

              <div className="match-score">
                Match Score: {job.match_score}%
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default StudentDashboard;