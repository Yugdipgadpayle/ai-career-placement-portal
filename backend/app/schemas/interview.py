from pydantic import BaseModel,Field

class InterviewQuestionRequest(BaseModel):
    job_role:str=Field(min_length=2,max_length=100)
    skills:str=Field(min_length=2)
    difficulty:str="beginner"

class InterviewQuestionResponse(BaseModel):
     job_role:str
     difficulty:str
     technical_questions:list[str]
     hr_questions:list[str]
     preparation_tips:list[str]