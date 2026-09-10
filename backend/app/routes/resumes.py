from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.database import get_db
from app.models.student_profile import StudentProfile
from app.models.user import User
from app.schemas.resume import ATSScoreRequest, ATSScoreResponse
from app.services.resume_parser_service import (
    extract_resume_text,
    extract_skills_from_text,
    calculate_ats_score,
)

router = APIRouter(
    prefix="/api/v1/resumes",
    tags=["Resumes"],
)

UPLOAD_DIR = Path("uploads/resumes")
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, DOCX, and TXT resumes are allowed",
        )

    student_profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Create your student profile before uploading resume",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    safe_filename = f"{current_user.id}_{uuid4().hex}{file_extension}"
    file_path = UPLOAD_DIR / safe_filename

    content = await file.read()

    with open(file_path, "wb") as resume_file:
        resume_file.write(content)

    student_profile.resume_url = str(file_path)
    db.commit()
    db.refresh(student_profile)

    return {
        "message": "Resume uploaded successfully",
        "filename": safe_filename,
        "resume_url": student_profile.resume_url,
    }


@router.get("/parse")
def parse_my_resume(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    student_profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not student_profile or not student_profile.resume_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a resume before parsing",
        )

    try:
        resume_text = extract_resume_text(student_profile.resume_url)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found on server",
        ) from exc

    if not resume_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from this resume format",
        )

    detected_skills = extract_skills_from_text(resume_text)

    return {
        "message": "Resume parsed successfully",
        "detected_skills": detected_skills,
        "text_preview": resume_text[:1000],
    }
@router.post("/ats-score", response_model=ATSScoreResponse)
def get_ats_score(
    ats_data: ATSScoreRequest,
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    student_profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not student_profile or not student_profile.resume_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a resume before checking ATS score",
        )

    try:
        resume_text = extract_resume_text(student_profile.resume_url)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found on server",
        ) from exc

    if not resume_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from this resume format",
        )

    return calculate_ats_score(
        resume_text=resume_text,
        required_skills_text=ats_data.required_skills,
    )