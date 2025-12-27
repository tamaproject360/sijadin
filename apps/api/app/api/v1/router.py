from fastapi import APIRouter
from app.api.v1.endpoints import auth, reports, files, jobs, analytics, draft, export, templates, settings

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(files.router, tags=["files"])  # No prefix, paths already include /reports or /files
api_router.include_router(jobs.router, tags=["jobs"])  # No prefix, paths already include /reports or /jobs
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(draft.router, tags=["draft"])  # No prefix, paths already include /reports
api_router.include_router(export.router, tags=["export"])  # No prefix, paths already include /reports or /exports
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
api_router.include_router(settings.router, tags=["settings"])  # No prefix, paths already include /settings


@api_router.get("/")
async def api_root():
    return {"message": "Sijadin API v1"}
