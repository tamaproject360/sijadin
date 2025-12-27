from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.report import Report
from app.models.job_run import JobRun, JobStatus
from app.schemas.job import JobResponse, JobTriggerResponse

router = APIRouter()


@router.post("/reports/{report_id}/process", response_model=JobTriggerResponse)
async def trigger_processing(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Trigger processing job for a report."""
    # Verify report exists and belongs to user
    result = await db.execute(
        select(Report).where(
            Report.id == report_id,
            Report.created_by == current_user.id
        )
    )
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check if there's already a running job
    existing_job_result = await db.execute(
        select(JobRun).where(
            JobRun.report_id == report_id,
            JobRun.status.in_([JobStatus.QUEUED, JobStatus.RUNNING])
        )
    )
    existing_job = existing_job_result.scalar_one_or_none()
    
    if existing_job:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A job is already running for this report"
        )
    
    # Create new job
    new_job = JobRun(
        report_id=report_id,
        status=JobStatus.QUEUED,
        progress=0,
        started_at=datetime.utcnow()
    )
    
    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)
    
    # TODO: Enqueue job to RQ worker
    # from app.worker.tasks import process_report_pipeline
    # job = process_report_pipeline.delay(report_id, new_job.id)
    
    # Update report status
    report.status = "processing"
    await db.commit()
    
    return {
        "job_id": new_job.id,
        "status": new_job.status,
        "message": "Processing job has been queued"
    }


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(
    job_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get job status and progress."""
    result = await db.execute(select(JobRun).where(JobRun.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Verify user has access to this job's report
    report_result = await db.execute(
        select(Report).where(
            Report.id == job.report_id,
            Report.created_by == current_user.id
        )
    )
    report = report_result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return job


@router.get("/reports/{report_id}/job", response_model=JobResponse)
async def get_report_latest_job(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get the latest job for a report."""
    # Verify report exists and belongs to user
    report_result = await db.execute(
        select(Report).where(
            Report.id == report_id,
            Report.created_by == current_user.id
        )
    )
    report = report_result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Get latest job for this report
    job_result = await db.execute(
        select(JobRun)
        .where(JobRun.report_id == report_id)
        .order_by(JobRun.created_at.desc())
        .limit(1)
    )
    job = job_result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No job found for this report"
        )
    
    return job
