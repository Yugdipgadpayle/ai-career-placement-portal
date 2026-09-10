from backend.app.main import app

__all__ = ["app"]


@app.get("/api/v1/roles")
def get_roles():
    return {
        "roles": ["student", "recruiter", "admin"],
    }