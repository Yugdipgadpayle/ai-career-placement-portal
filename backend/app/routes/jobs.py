from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_role
from app.database import get_db
from app.models.job import Job
from app.models.student_profile import StudentProfile
from app.models.user import User
from app.routes.applications import apply_to_job
from app.schemas.application import ApplicationResponse
from app.schemas.job import JobCreate, JobResponse, RecommendedJobResponse
from app.services.matching_service import calculate_match_score

router = APIRouter(
    prefix="/api/v1/jobs",
    tags=["Jobs"],
)


@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job(
    job_data: JobCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    new_job = Job(
        recruiter_id=current_user.id,
        title=job_data.title,
        company_name=job_data.company_name,
        description=job_data.description,
        location=job_data.location,
        job_type=job_data.job_type,
        required_skills=job_data.required_skills,
        salary_range=job_data.salary_range,
        deadline=job_data.deadline,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get("", response_model=list[JobResponse])
def list_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Job).order_by(Job.created_at.desc()).all()


@router.get("/recommended", response_model=list[RecommendedJobResponse])
def get_recommended_jobs(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    student_profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Create your student profile before getting recommendations",
        )

    jobs = db.query(Job).all()
    recommended_jobs = []

    for job in jobs:
        match_score = calculate_match_score(
            student_skills=student_profile.skills,
            required_skills=job.required_skills,
        )

        recommended_jobs.append(
            {
                "id": job.id,
                "recruiter_id": job.recruiter_id,
                "title": job.title,
                "company_name": job.company_name,
                "description": job.description,
                "location": job.location,
                "job_type": job.job_type,
                "required_skills": job.required_skills,
                "salary_range": job.salary_range,
                "deadline": job.deadline,
                "created_at": job.created_at,
                "match_score": match_score,
            }
        )

    recommended_jobs.sort(
        key=lambda job_item: job_item["match_score"],
        reverse=True,
    )

    return recommended_jobs


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    return job


@router.post("/{job_id}/apply", response_model=ApplicationResponse)
def apply_for_job(
    job_id: int,
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    return apply_to_job(
        job_id=job_id,
        current_user=current_user,
        db=db,
    )