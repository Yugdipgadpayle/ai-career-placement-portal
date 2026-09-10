QUESTION_BANK = {
    "python": [
        "What are Python lists and tuples?",
        "Explain the difference between mutable and immutable data types.",
        "What is exception handling in Python?",
    ],
    "fastapi": [
        "What is FastAPI and why is it used?",
        "What are Pydantic schemas in FastAPI?",
        "How does dependency injection work in FastAPI?",
    ],
    "react": [
        "What are React components?",
        "What is the difference between props and state?",
        "What is the purpose of useEffect?",
    ],
    "sql": [
        "What is a primary key?",
        "What is the difference between WHERE and HAVING?",
        "Explain joins in SQL.",
    ],
    "git": [
        "What is Git used for?",
        "What is the difference between commit and push?",
        "How do you resolve merge conflicts?",
    ],
}

HR_QUESTIONS = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths and weaknesses?",
    "Describe a challenge you faced in a project.",
    "Where do you see yourself in five years?",
]


def normalize_skills(skills: str) -> list[str]:
    return [
        skill.strip().lower()
        for skill in skills.split(",")
        if skill.strip()
    ]


def generate_interview_questions(
    job_role: str,
    skills: str,
    difficulty: str,
) -> dict:
    selected_skills = normalize_skills(skills)

    technical_questions = []

    for skill in selected_skills:
        skill_questions = QUESTION_BANK.get(skill)

        if skill_questions:
            technical_questions.extend(skill_questions)

    if not technical_questions:
        technical_questions = [
            f"What core skills are required for a {job_role} role?",
            f"Explain one project you built related to {job_role}.",
            f"What challenges can appear in a {job_role} interview?",
        ]

    preparation_tips = [
        f"Revise fundamentals required for the {job_role} role.",
        "Prepare one strong project explanation using problem, approach, and result.",
        "Practice explaining your code clearly instead of only writing it.",
    ]

    return {
        "job_role": job_role,
        "difficulty": difficulty,
        "technical_questions": technical_questions[:10],
        "hr_questions": HR_QUESTIONS,
        "preparation_tips": preparation_tips,
    }
