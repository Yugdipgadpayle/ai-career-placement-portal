import { useEffect, useState } from "react";
import api from "../services/api.js";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await api.get("/api/v1/applications/my");
        setApplications(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.detail || "Unable to load applications."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <p>Loading applications...</p>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow-dark">Applications</p>
          <h1>My Applications</h1>
          <p>Track your job applications and match scores.</p>
        </div>
      </section>

      {message && <p className="error-text">{message}</p>}

      {applications.length === 0 && !message && (
        <p>You have not applied to any jobs yet.</p>
      )}

      {applications.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Match Score</th>
                <th>Applied At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.job?.title || `Job #${application.job_id}`}</td>
                  <td>{application.job?.company_name || "N/A"}</td>
                  <td>{application.job?.location || "N/A"}</td>
                  <td>{application.job?.job_type || "N/A"}</td>
                  <td>{application.status}</td>
                  <td>
                    {application.match_score !== null
                      ? `${application.match_score}%`
                      : "Not calculated"}
                  </td>
                  <td>{new Date(application.applied_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default MyApplicationsPage;