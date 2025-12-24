from typing import Optional, Dict, Any
from datetime import datetime
import traceback
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from worker.config import DATABASE_URL


class BaseJob:
    """Base class for all worker jobs with error handling and progress tracking."""
    
    def __init__(self, report_id: int, job_id: int):
        self.report_id = report_id
        self.job_id = job_id
        self.engine = create_async_engine(DATABASE_URL, echo=False)
        self.async_session = sessionmaker(
            self.engine, class_=AsyncSession, expire_on_commit=False
        )
    
    async def update_progress(self, progress: int, status: Optional[str] = None):
        """Update job progress in database."""
        from app.models.job_run import JobRun
        
        async with self.async_session() as session:
            result = await session.execute(
                select(JobRun).where(JobRun.id == self.job_id)
            )
            job = result.scalar_one_or_none()
            
            if job:
                job.progress = progress
                if status:
                    job.status = status
                await session.commit()
    
    async def mark_success(self):
        """Mark job as successful."""
        from app.models.job_run import JobRun, JobStatus
        
        async with self.async_session() as session:
            result = await session.execute(
                select(JobRun).where(JobRun.id == self.job_id)
            )
            job = result.scalar_one_or_none()
            
            if job:
                job.status = JobStatus.SUCCESS
                job.progress = 100
                job.finished_at = datetime.utcnow()
                await session.commit()
    
    async def mark_failed(self, error: Exception):
        """Mark job as failed with error details."""
        from app.models.job_run import JobRun, JobStatus
        
        error_details = {
            "error": str(error),
            "traceback": traceback.format_exc(),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        async with self.async_session() as session:
            result = await session.execute(
                select(JobRun).where(JobRun.id == self.job_id)
            )
            job = result.scalar_one_or_none()
            
            if job:
                job.status = JobStatus.FAILED
                job.error_json = error_details
                job.finished_at = datetime.utcnow()
                await session.commit()
    
    async def execute(self):
        """Override this method in subclasses."""
        raise NotImplementedError("Subclasses must implement execute method")
    
    async def run(self):
        """Run the job with error handling."""
        try:
            await self.update_progress(0, "running")
            await self.execute()
            await self.mark_success()
        except Exception as e:
            print(f"Job {self.job_id} failed: {str(e)}")
            await self.mark_failed(e)
            raise
        finally:
            await self.engine.dispose()


def run_job_sync(job_class, report_id: int, job_id: int):
    """Synchronous wrapper to run async job (for RQ compatibility)."""
    job = job_class(report_id, job_id)
    asyncio.run(job.run())
