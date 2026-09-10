from datetime import datetime

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    company_name: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=10)
    location: str = Field(min_length=2, max_length=150)
    job_type: str = Field(min_length=2, max_length=50)
    required_skills: str = Field(min_length=2)
    salary_range: str | None = None
    deadline: str | None = None


class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    company_name: str
    description: str
    location: str
    job_type: str
    required_skills: str
    salary_range: str | None
    deadline: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class RecommendedJobResponse(JobResponse):
    match_score: float