import { useEffect, useState } from "react";
import api from "../services/api.js";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await api.get("/api/v1/jobs");
        setJobs(response.data);
      } catch (error) {
        setMessage(error.response?.data?.detail || "Unable to load jobs.");
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, []);

  async function handleApply(jobId) {
    setMessage("");

    try {
      await api.post(`/api/v1/jobs/${jobId}/apply`);
      setMessage("Application submitted successfully.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Unable to apply for job.");
    }
  }

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <p>Loading jobs...</p>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow-dark">Jobs</p>
          <h1>Available Jobs</h1>
          <p>Browse openings and apply with your student profile.</p>
        </div>
      </section>

      {message && <p className="form-message">{message}</p>}

      <section className="job-grid">
        {jobs.map((job) => (
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

            <p>{job.description}</p>

            <button className="primary-button" onClick={() => handleApply(job.id)}>
              Apply
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default JobsPage;