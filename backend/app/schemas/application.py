from datetime import datetime

from pydantic import BaseModel


class ApplicationJobResponse(BaseModel):
    id: int
    title: str
    company_name: str
    location: str
    job_type: str
    required_skills: str


class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    job_id: int
    status: str
    match_score: int | None
    applied_at: datetime

    class Config:
        from_attributes = True


class ApplicationWithJobResponse(ApplicationResponse):
    job: ApplicationJobResponse