def normalize_skills(skills_text:str)->set[str]:
    return{
        skill.strip().lower()
        for skill in skills_text.split(",")
        if skill.strip()
    }

def calculate_match_score(student_skills:str,required_skills:str)->int:
    student_skill_set=normalize_skills(student_skills)
    required_skill_set=normalize_skills(required_skills)

    if not required_skill_set:
        return 0

    matched_skills = student_skill_set.intersection(required_skill_set)

    score = (len(matched_skills) / len(required_skill_set)) * 100

    return round(score)