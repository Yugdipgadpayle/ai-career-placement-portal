from pathlib import Path

from pypdf import PdfReader

KNOWN_SKILLS = {
    "python",
    "fastapi",
    "django",
    "flask",
    "react",
    "javascript",
    "html",
    "css",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "git",
    "github",
    "docker",
    "aws",
    "machine learning",
    "data analysis",
    "excel",
}


def extract_text_from_txt(file_path: Path) -> str:
    return file_path.read_text(encoding="utf-8", errors="ignore")


def extract_text_from_pdf(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    text_parts = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        text_parts.append(page_text)

    return "\n".join(text_parts)


def extract_resume_text(resume_path: str) -> str:
    file_path = Path(resume_path)

    if not file_path.exists():
        raise FileNotFoundError("Resume file not found")

    if file_path.suffix.lower() == ".txt":
        return extract_text_from_txt(file_path)

    if file_path.suffix.lower() == ".pdf":
        return extract_text_from_pdf(file_path)

    return ""


def extract_skills_from_text(text: str) -> list[str]:
    normalized_text = text.lower()
    detected_skills = []

    for skill in KNOWN_SKILLS:
        if skill in normalized_text:
            detected_skills.append(skill.title())

    return sorted(detected_skills)
def calculate_ats_score(
    resume_text: str,
    required_skills_text: str,
) -> dict:
    resume_skills = set(extract_skills_from_text(resume_text))
    required_skills = {
        skill.strip().title()
        for skill in required_skills_text.split(",")
        if skill.strip()
    }

    if not required_skills:
        return {
            "score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "suggestions": ["Add required skills to compare ATS score."],
        }

    matched_skills = sorted(resume_skills.intersection(required_skills))
    missing_skills = sorted(required_skills.difference(resume_skills))

    score = round((len(matched_skills) / len(required_skills)) * 100)

    suggestions = []

    if missing_skills:
        suggestions.append(
            "Add or improve these missing skills: " + ", ".join(missing_skills)
        )

    if score < 60:
        suggestions.append("Customize your resume more closely for this job role.")

    if score >= 80:
        suggestions.append("Your resume is strongly aligned with this job.")

    return {
        "score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
    }