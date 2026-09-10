from fastapi import APIRouter, Depends

from ..core.security import get_current_user, require_role
from ..models.user import User
from ..schemas.user import UserResponse

class full_name:
    def __init__(self, first_name: str, last_name: str):
        self.first_name = first_name or ""
        self.last_name = last_name or ""

    def formatted(self) -> str:
        return f"{self.first_name.strip()} {self.last_name.strip()}".strip()

    def initials(self) -> str:
        parts = [name.strip() for name in (self.first_name, self.last_name) if name and name.strip()]
        return "".join(part[0].upper() for part in parts)

    def as_dict(self) -> dict:
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.formatted(),
        }

router=APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)

@router.get("/me",response_model=UserResponse)
def get_logged_in_user(current_user:User=Depends(get_current_user)):
    return current_user

def student_only(current_user:User=Depends(require_role("recruiter"))):
    return {
        "message":f"Welcome recruiter {current_user.full_name}",
    }

@router.get("/admin-only")
def admin_only(current_user:User=Depends(require_role("admin"))):
    return{
        "message":f"Welcome admin {current_user.full_name}",
    }