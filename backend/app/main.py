from app.routes.resumes import router as resumes_router
from app.models import Application, Job, RecruiterProfile, StudentProfile, User
from app.routes.applications import router as applications_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes.auth import router as auth_router
from .routes.students import router as students_router
from .routes.user import router as user_router
from .routes.recruiters import router as recruiter_router
from .routes.jobs import router as jobs_router
from .models import Job, RecruiterProfile, StudentProfile, User
from app.routes.interview import router as interview_router
# Create all database tables that don't exist yet.
# This must run after all models are imported above, so that
# SQLAlchemy's Base metadata knows about every table.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Career & Placement Portal API",
    description="Backend API for students, recruiters, admins, and AI placement features.",
    version="0.1.0",
)

app.include_router(auth_router)
app.include_router(students_router)
app.include_router(user_router)
app.include_router(recruiter_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(resumes_router)
app.include_router(interview_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "message": "AI Career & Placement Portal API is running",
        "docs_url": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ai-career-placement-portal-backend",
    }


@app.get("/api/v1/info")
def project_info():
    return {
        "project_name": "AI Career & Placement Portal",
        "version": "0.1.0",
        "modules": [
            "Authentication",
            "Student Dashboard",
            "Recruiter Dashboard",
            "Admin Dashboard",
            "Resume Analysis",
            "Job Recommendation",
            "Interview Preparation",
        ],
    }


@app.get("/api/v1/roles")
def get_roles():
    return {
        "roles": ["student", "recruiter", "admin"],
    }