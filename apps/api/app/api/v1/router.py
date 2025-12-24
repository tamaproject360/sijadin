from fastapi import APIRouter
from app.api.v1.endpoints import auth, reports, files, jobs, analytics

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])


@api_router.get("/")
async def api_root():
    return {"message": "Sijadin API v1"}
