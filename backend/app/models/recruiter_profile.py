from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(150), nullable=False)
    company_website = Column(String(255), nullable=True)
    designation = Column(String(100), nullable=False)

    user = relationship("User")