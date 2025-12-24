from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.report import Report
from app.schemas.report import (
    ReportCreate,
    ReportUpdate,
    ReportResponse,
    ReportListResponse,
)

router = APIRouter()


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_data: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new report."""
    new_report = Report(
        title=report_data.title,
        template_id=report_data.template_id,
        created_by=current_user.id,
        org_id=None,  # MVP: nullable
        activity_name=report_data.activity_name,
        location=report_data.location,
        date_start=report_data.date_start,
        date_end=report_data.date_end,
        unit=report_data.unit,
    )
    
    db.add(new_report)
    await db.commit()
    await db.refresh(new_report)
    
    return new_report


@router.get("", response_model=ReportListResponse)
async def list_reports(
    page: int = 1,
    page_size: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all reports for the current user."""
    offset = (page - 1) * page_size
    
    # Get total count
    count_query = select(func.count(Report.id)).where(Report.created_by == current_user.id)
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get reports
    query = (
        select(Report)
        .where(Report.created_by == current_user.id)
        .order_by(Report.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    result = await db.execute(query)
    reports = result.scalars().all()
    
    return {
        "reports": reports,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific report by ID."""
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
    
    return report


@router.patch("/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: int,
    report_data: ReportUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update report metadata."""
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
    
    # Update fields
    update_data = report_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(report, field, value)
    
    await db.commit()
    await db.refresh(report)
    
    return report
