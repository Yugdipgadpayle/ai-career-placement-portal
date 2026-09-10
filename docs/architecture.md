# Architecture Notes

## High-Level Architecture

The project has three main layers:

1. Frontend
2. Backend
3. Database

## Frontend

The frontend is built with React. It is responsible for pages, forms, dashboards, and calling backend APIs with Axios.

## Backend

The backend is built with FastAPI. It handles authentication, business logic, database access, resume analysis, ATS scoring, and job recommendations.

## Database

PostgreSQL stores users, student profiles, recruiter profiles, jobs, applications, resumes, and AI results.

## Request Flow

Example: Student applies for a job.

1. Student clicks Apply on the React frontend.
2. React sends a POST request to the FastAPI backend.
3. FastAPI validates the JWT token.
4. FastAPI checks whether the student already applied.
5. FastAPI stores the application in PostgreSQL.
6. FastAPI returns a success response.
7. React updates the UI.

