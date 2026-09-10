from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session

from ..core.security import require_role
from ..database import get_db
from ..models.recruiter_profile import RecruiterProfile
from ..models.user import User

from ..schemas.recruiter_profile import (
    RecruiterProfileCreate,
    RecruiterProfileResponse,
)
router=APIRouter(
    prefix="/api/v1/recruiters",
    tags=["Recruiters"],
)

@router.post(
    "/profile",
    response_model=RecruiterProfileResponse,
)
def create_recruiter_profile(
    profile: RecruiterProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter")),
):

    existing_profile = (
        db.query(RecruiterProfile)
        .filter(RecruiterProfile.user_id == current_user.id)
        .first()
    )
    if existing_profile:
        existing_profile.company_name = profile.company_name
        existing_profile.company_website = profile.company_website
        existing_profile.designation = profile.designation

        db.commit()
        db.refresh(existing_profile)

        return existing_profile

    new_profile = RecruiterProfile(
        user_id=current_user.id,
        company_name=profile.company_name,
        company_website=profile.company_website,
        designation=profile.designation,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.get("/profile", response_model=RecruiterProfileResponse)
def get_my_profile(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(RecruiterProfile)
        .filter(RecruiterProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruiter profile not found",
        )

    return profile