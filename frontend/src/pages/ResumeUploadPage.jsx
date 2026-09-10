import { useState } from "react";
import api from "../services/api.js";

function ResumeUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please choose a resume file first.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", selectedFile);

    setIsUploading(true);
    setMessage("");

    try {
      const response = await api.post("/api/v1/resumes/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedResume(response.data);
      setMessage("Resume uploaded successfully.");
      setSelectedFile(null);
      event.target.reset();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Resume upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="form-page">
      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <h1>Upload Resume</h1>

        <label>
          Resume File
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
        </label>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Resume"}
        </button>

        {message && <p className="form-message">{message}</p>}

        {uploadedResume && (
          <div className="upload-result">
            <p>
              <strong>Saved File:</strong> {uploadedResume.filename}
            </p>
            <p>
              <strong>Path:</strong> {uploadedResume.resume_url}
            </p>
          </div>
        )}
      </form>
    </main>
  );
}

export default ResumeUploadPage;