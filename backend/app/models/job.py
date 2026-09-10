from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from ..database import Base
class Job(Base):
    __tablename__="jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(150), nullable=False)
    company_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(150), nullable=False)
    job_type = Column(String(50), nullable=False)
    required_skills = Column(Text, nullable=False)
    salary_range = Column(String(100), nullable=True)
    deadline = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    recruiter = relationship("User")