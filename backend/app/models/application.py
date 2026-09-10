from datetime import datetime

from sqlalchemy import Column,DateTime,ForeignKey,Integer,String,UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Application(Base):
    __tablename__="application"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    status = Column(String(50), nullable=False, default="applied")
    match_score = Column(Integer, nullable=True)
    applied_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User")
    job = relationship("Job")

    __table_args__=(

        UniqueConstraint("student_id","job_id",name="unique_student_job_application"),

    )
