from pydantic import BaseModel, Field


class ATSScoreRequest(BaseModel):
    required_skills: str = Field(min_length=2)


class ATSScoreResponse(BaseModel):
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]
