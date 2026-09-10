"""Top-level package to expose the backend FastAPI app for local uvicorn runs.
This proxies the actual app defined under `backend/app/main.py` so `uvicorn app.main:app`
works when executed from the repository root.
"""

__all__ = ["main"]
