from pydantic import BaseModel, Field


class RecruiterProfileCreate(BaseModel):
    company_name: str = Field(min_length=2, max_length=150)
    company_website: str | None = None
    designation: str = Field(min_length=2, max_length=100)


class RecruiterProfileResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    company_website: str | None
    designation: str

    class Config:
        from_attributes = True