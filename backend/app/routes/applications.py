from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.student_profile import StudentProfile
from app.models.user import User
from app.schemas.application import ApplicationResponse, ApplicationWithJobResponse
from app.services.matching_service import calculate_match_score

router = APIRouter(
    prefix="/api/v1/applications",
    tags=["Applications"],
)


@router.get("/my", response_model=list[ApplicationWithJobResponse])
def get_my_applications(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    return (
        db.query(Application)
        .filter(Application.student_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def apply_to_job(
    job_id: int,
    current_user: User,
    db: Session,
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    existing_application = (
        db.query(Application)
        .filter(
            Application.student_id == current_user.id,
            Application.job_id == job_id,
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job",
        )

    student_profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Create your student profile before applying",
        )

    match_score = calculate_match_score(
        student_skills=student_profile.skills,
        required_skills=job.required_skills,
    )

    application = Application(
        student_id=current_user.id,
        job_id=job_id,
        status="applied",
        match_score=match_score,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application