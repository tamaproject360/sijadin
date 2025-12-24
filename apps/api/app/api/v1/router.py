from fastapi import APIRouter

api_router = APIRouter()

# Import and include routers here
# from app.api.v1.endpoints import auth, reports, files, jobs, drafts, exports
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
# api_router.include_router(files.router, prefix="/files", tags=["files"])
# api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
# api_router.include_router(drafts.router, prefix="/drafts", tags=["drafts"])
# api_router.include_router(exports.router, prefix="/exports", tags=["exports"])


@api_router.get("/")
async def api_root():
    return {"message": "Sijadin API v1"}
