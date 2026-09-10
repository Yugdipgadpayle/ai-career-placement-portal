from fastapi import APIRouter, Depends

from app.core.security import require_role
from app.models.user import User
from app.schemas.interview import (
    InterviewQuestionRequest,
    InterviewQuestionResponse,
)
from app.services.interview_service import generate_interview_questions

router = APIRouter(
    prefix="/api/v1/interview",
    tags=["Interview Preparation"],
)


@router.post("/questions", response_model=InterviewQuestionResponse)
def create_interview_questions(
    question_data: InterviewQuestionRequest,
    current_user: User = Depends(require_role("student")),
):
    return generate_interview_questions(
        job_role=question_data.job_role,
        skills=question_data.skills,
        difficulty=question_data.difficulty,
    )