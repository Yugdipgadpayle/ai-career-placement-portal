from pydantic import BaseModel, Field


class StudentProfileCreate(BaseModel):
    college: str = Field(min_length=2, max_length=150)
    degree: str = Field(min_length=2, max_length=100)
    branch: str = Field(min_length=2, max_length=100)
    graduation_year: int
    skills: str | None = None
    career_goal: str | None = None
    resume_url: str | None = None


class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    college: str
    degree: str
    branch: str
    graduation_year: int
    skills: str | None
    career_goal: str | None
    resume_url: str | None

    class Config:
        from_attributes = True