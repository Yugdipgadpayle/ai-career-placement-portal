from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field

from ..database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    college = Column(String(150), nullable=False)
    degree = Column(String(100), nullable=False)
    branch = Column(String(100), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    skills = Column(Text, nullable=True)
    career_goal = Column(String(255), nullable=True)
    resume_url = Column(String(500), nullable=True)

    user = relationship("User")

    def __repr__(self):
        return f"<StudentProfile(id={self.id}, user_id={self.user_id})>"


class StudentProfileCreate(BaseModel):
    college:str=Field(min_length=2,max_length=150)
    degree:str=Field(min_length=2,max_length=100)
    branch:str=Field(min_length=2,max_length=100)
    graduation_year:int
    skills:str | None =None
    resume_url:str |None =None

class StudentProfileResponse(BaseModel):
  id:int 
  user_id:int
  college:str
  degree:str
  branch:str
  graduation_year:int
  skills:str | None
  resume_url:str | None

  class Config:
      from_attributes=True