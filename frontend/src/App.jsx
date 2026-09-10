import { Link, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ATSScorePage from "./pages/ATSScorePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import InterviewPrepPage from "./pages/InterviewPrepPage.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MyApplicationsPage from "./pages/MyApplicationsPage.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ResumeParsePage from "./pages/ResumeParsePage.jsx";
import ResumeUploadPage from "./pages/ResumeUploadPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentProfilePage from "./pages/StudentProfilePage.jsx";

function App() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <>
      <nav className="top-nav">
        <Link to="/">Career Portal</Link>

        <div>
          <Link to="/jobs">Jobs</Link>
          <Link to="/student-dashboard">Student Dashboard</Link>
          <Link to="/student-profile">Student Profile</Link>
          <Link to="/my-applications">My Applications</Link>
          <Link to="/resume-upload">Upload Resume</Link>
          <Link to="/resume-parser">Resume Parser</Link>
          <Link to="/ats-score">ATS Score</Link>
          <Link to="/interview-prep">Interview Prep</Link>
          <Link to="/recruiter-dashboard">Recruiter Dashboard</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-profile"
          element={
            <ProtectedRoute>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <ResumeUploadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-parser"
          element={
            <ProtectedRoute>
              <ResumeParsePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ats-score"
          element={
            <ProtectedRoute>
              <ATSScorePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-prep"
          element={
            <ProtectedRoute>
              <InterviewPrepPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;