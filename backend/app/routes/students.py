from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.security import require_role
from ..database import get_db
from ..models.student_profile import StudentProfile
from ..models.user import User
from ..schemas.student_profile import StudentProfileCreate, StudentProfileResponse

router = APIRouter(
    prefix="/api/v1/students",
    tags=["Students"],
)


@router.post(
    "/profile",
    response_model=StudentProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_or_update_profile(
    profile_data: StudentProfileCreate,
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    existing_profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if existing_profile:
        existing_profile.college = profile_data.college
        existing_profile.degree = profile_data.degree
        existing_profile.branch = profile_data.branch
        existing_profile.graduation_year = profile_data.graduation_year
        existing_profile.skills = profile_data.skills
        existing_profile.career_goal = profile_data.career_goal
        existing_profile.resume_url = profile_data.resume_url

        db.commit()
        db.refresh(existing_profile)

        return existing_profile

    new_profile = StudentProfile(
        user_id=current_user.id,
        college=profile_data.college,
        degree=profile_data.degree,
        branch=profile_data.branch,
        graduation_year=profile_data.graduation_year,
        skills=profile_data.skills,
        career_goal=profile_data.career_goal,
        resume_url=profile_data.resume_url,
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.get("/profile", response_model=StudentProfileResponse)
def get_my_profile(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    return profile