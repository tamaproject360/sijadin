from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.report import Report
from app.models.file import File

router = APIRouter()


@router.get("")
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get analytics data for the current user."""
    
    # Total reports
    total_reports_query = select(func.count(Report.id)).where(
        Report.created_by == current_user.id
    )
    total_reports_result = await db.execute(total_reports_query)
    total_reports = total_reports_result.scalar() or 0
    
    # Completed reports
    completed_reports_query = select(func.count(Report.id)).where(
        Report.created_by == current_user.id,
        Report.status == "finalized"
    )
    completed_reports_result = await db.execute(completed_reports_query)
    completed_reports = completed_reports_result.scalar() or 0
    
    # In progress reports
    in_progress_reports_query = select(func.count(Report.id)).where(
        Report.created_by == current_user.id,
        Report.status == "processing"
    )
    in_progress_reports_result = await db.execute(in_progress_reports_query)
    in_progress_reports = in_progress_reports_result.scalar() or 0
    
    # Total files
    total_files_query = select(func.count(File.id)).where(
        File.uploaded_by == current_user.id
    )
    total_files_result = await db.execute(total_files_query)
    total_files = total_files_result.scalar() or 0
    
    # Reports by status
    drafting_query = select(func.count(Report.id)).where(
        Report.created_by == current_user.id,
        Report.status == "drafting"
    )
    drafting_result = await db.execute(drafting_query)
    drafting_count = drafting_result.scalar() or 0
    
    processing_query = select(func.count(Report.id)).where(
        Report.created_by == current_user.id,
        Report.status == "processing"
    )
    processing_result = await db.execute(processing_query)
    processing_count = processing_result.scalar() or 0
    
    finalized_query = select(func.count(Report.id)).where(
        Report.created_by == current_user.id,
        Report.status == "finalized"
    )
    finalized_result = await db.execute(finalized_query)
    finalized_count = finalized_result.scalar() or 0
    
    # Reports by month (last 6 months)
    reports_by_month = []
    for i in range(5, -1, -1):
        month_date = datetime.now() - timedelta(days=30 * i)
        month_query = select(func.count(Report.id)).where(
            Report.created_by == current_user.id,
            extract('year', Report.created_at) == month_date.year,
            extract('month', Report.created_at) == month_date.month
        )
        month_result = await db.execute(month_query)
        count = month_result.scalar() or 0
        reports_by_month.append({
            "month": month_date.strftime("%b"),
            "count": count
        })
    
    # Top locations
    top_locations_query = (
        select(Report.location, func.count(Report.id).label('count'))
        .where(
            Report.created_by == current_user.id,
            Report.location.isnot(None)
        )
        .group_by(Report.location)
        .order_by(func.count(Report.id).desc())
        .limit(5)
    )
    top_locations_result = await db.execute(top_locations_query)
    top_locations = [
        {"location": row[0], "count": row[1]}
        for row in top_locations_result.all()
    ]
    
    # Average processing time (mock for now)
    average_processing_time = 15  # minutes
    
    return {
        "totalReports": total_reports,
        "completedReports": completed_reports,
        "inProgressReports": in_progress_reports,
        "totalFiles": total_files,
        "averageProcessingTime": average_processing_time,
        "reportsByStatus": {
            "drafting": drafting_count,
            "processing": processing_count,
            "finalized": finalized_count
        },
        "reportsByMonth": reports_by_month,
        "topLocations": top_locations
    }
