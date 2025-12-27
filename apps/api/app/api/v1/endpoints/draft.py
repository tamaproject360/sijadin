"""
Draft API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.report import Report
from app.models.report_draft_version import ReportDraftVersion
from app.schemas.draft import Draft

router = APIRouter()


@router.get("/reports/{report_id}/draft", response_model=Draft)
async def get_current_draft(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current draft for a report"""
    # Get latest draft version
    stmt = select(ReportDraftVersion).where(
        ReportDraftVersion.report_id == report_id
    ).order_by(desc(ReportDraftVersion.version_no)).limit(1)
    
    result = await db.execute(stmt)
    draft_version = result.scalar_one_or_none()
    
    if not draft_version:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    return draft_version.draft_json


@router.patch("/reports/{report_id}/draft", response_model=Draft)
async def update_draft(
    report_id: int,
    draft: Draft,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update draft and create new version"""
    # Get report
    stmt = select(Report).where(Report.id == report_id)
    result = await db.execute(stmt)
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Get latest version number
    stmt = select(ReportDraftVersion).where(
        ReportDraftVersion.report_id == report_id
    ).order_by(desc(ReportDraftVersion.version_no)).limit(1)
    
    result = await db.execute(stmt)
    latest = result.scalar_one_or_none()
    
    next_version = (latest.version_no + 1) if latest else 1
    
    # Create new version
    new_version = ReportDraftVersion(
        report_id=report_id,
        version_no=next_version,
        draft_json=draft.model_dump(),
        created_by=current_user.id
    )
    
    db.add(new_version)
    await db.commit()
    await db.refresh(new_version)
    
    return new_version.draft_json


@router.get("/reports/{report_id}/draft/versions", response_model=List[dict])
async def list_draft_versions(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all draft versions"""
    stmt = select(ReportDraftVersion).where(
        ReportDraftVersion.report_id == report_id
    ).order_by(desc(ReportDraftVersion.created_at))
    
    result = await db.execute(stmt)
    versions = result.scalars().all()
    
    return [
        {
            "id": v.id,
            "version_no": v.version_no,
            "created_at": v.created_at,
            "created_by": v.created_by
        }
        for v in versions
    ]


@router.post("/reports/{report_id}/draft/restore")
async def restore_draft_version(
    report_id: int,
    version_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Restore a previous draft version"""
    # Get the version to restore
    stmt = select(ReportDraftVersion).where(
        ReportDraftVersion.id == version_id,
        ReportDraftVersion.report_id == report_id
    )
    
    result = await db.execute(stmt)
    old_version = result.scalar_one_or_none()
    
    if not old_version:
        raise HTTPException(status_code=404, detail="Version not found")
    
    # Get latest version number
    stmt = select(ReportDraftVersion).where(
        ReportDraftVersion.report_id == report_id
    ).order_by(desc(ReportDraftVersion.version_no)).limit(1)
    
    result = await db.execute(stmt)
    latest = result.scalar_one_or_none()
    
    next_version = (latest.version_no + 1) if latest else 1
    
    # Create new version with old content
    new_version = ReportDraftVersion(
        report_id=report_id,
        version_no=next_version,
        draft_json=old_version.draft_json,
        created_by=current_user.id
    )
    
    db.add(new_version)
    await db.commit()
    
    return {"message": "Draft restored", "version_no": next_version}
