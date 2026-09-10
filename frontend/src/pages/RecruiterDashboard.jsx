import { useState } from "react";
import api from "../services/api.js";

function RecruiterDashboard() {
  const [profileData, setProfileData] = useState({
    company_name: "",
    company_website: "",
    designation: "",
  });

  const [jobData, setJobData] = useState({
    title: "",
    company_name: "",
    description: "",
    location: "",
    job_type: "Full-time",
    required_skills: "",
    salary_range: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");

  function handleProfileChange(event) {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  }

  function handleJobChange(event) {
    setJobData({
      ...jobData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/api/v1/recruiters/profile", {
        ...profileData,
        company_website: profileData.company_website || null,
      });

      setMessage("Recruiter profile saved successfully.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Unable to save profile.");
    }
  }

  async function handleJobSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/api/v1/jobs", {
        ...jobData,
        salary_range: jobData.salary_range || null,
        deadline: jobData.deadline || null,
      });

      setMessage("Job posted successfully.");

      setJobData({
        title: "",
        company_name: profileData.company_name,
        description: "",
        location: "",
        job_type: "Full-time",
        required_skills: "",
        salary_range: "",
        deadline: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.detail || "Unable to post job.");
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow-dark">Recruiter Dashboard</p>
          <h1>Company Profile & Job Posting</h1>
          <p>Create your company profile and publish jobs for students.</p>
        </div>
      </section>

      {message && <p className="form-message">{message}</p>}

      <section className="split-grid">
        <form className="auth-form wide-form" onSubmit={handleProfileSubmit}>
          <h2>Company Profile</h2>

          <label>
            Company Name
            <input
              name="company_name"
              value={profileData.company_name}
              onChange={handleProfileChange}
              required
            />
          </label>

          <label>
            Company Website
            <input
              name="company_website"
              value={profileData.company_website}
              onChange={handleProfileChange}
              placeholder="https://company.com"
            />
          </label>

          <label>
            Designation
            <input
              name="designation"
              value={profileData.designation}
              onChange={handleProfileChange}
              placeholder="HR Manager"
              required
            />
          </label>

          <button type="submit">Save Profile</button>
        </form>

        <form className="auth-form wide-form" onSubmit={handleJobSubmit}>
          <h2>Post Job</h2>

          <label>
            Job Title
            <input
              name="title"
              value={jobData.title}
              onChange={handleJobChange}
              required
            />
          </label>

          <label>
            Company Name
            <input
              name="company_name"
              value={jobData.company_name}
              onChange={handleJobChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleJobChange}
              required
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={jobData.location}
              onChange={handleJobChange}
              required
            />
          </label>

          <label>
            Job Type
            <select
              name="job_type"
              value={jobData.job_type}
              onChange={handleJobChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </label>

          <label>
            Required Skills
            <textarea
              name="required_skills"
              value={jobData.required_skills}
              onChange={handleJobChange}
              placeholder="Python, FastAPI, SQL, Git"
              required
            />
          </label>

          <label>
            Salary Range
            <input
              name="salary_range"
              value={jobData.salary_range}
              onChange={handleJobChange}
              placeholder="7-10 LPA"
            />
          </label>

          <label>
            Deadline
            <input
              name="deadline"
              value={jobData.deadline}
              onChange={handleJobChange}
              placeholder="2026-09-30"
            />
          </label>

          <button type="submit">Post Job</button>
        </form>
      </section>
    </main>
  );
}

export default RecruiterDashboard;