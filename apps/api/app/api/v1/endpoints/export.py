"""
Export API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import os

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.report import Report
from app.models.export import Export
from app.models.report_draft_version import ReportDraftVersion
from app.schemas.draft import Draft
from app.utils.minio_client import minio_client

router = APIRouter()


@router.post("/reports/{report_id}/export")
async def create_export(
    report_id: int,
    format: str,  # docx or pdf
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create export job (DOCX or PDF)"""
    
    if format not in ["docx", "pdf"]:
        raise HTTPException(status_code=400, detail="Format must be 'docx' or 'pdf'")
    
    # Get report
    stmt = select(Report).where(Report.id == report_id)
    result = await db.execute(stmt)
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Get latest draft
    stmt = select(ReportDraftVersion).where(
        ReportDraftVersion.report_id == report_id
    ).order_by(ReportDraftVersion.version_no.desc()).limit(1)
    
    result = await db.execute(stmt)
    draft_version = result.scalar_one_or_none()
    
    if not draft_version:
        raise HTTPException(status_code=404, detail="No draft found")
    
    # Create export record
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"laporan_{report_id}_{timestamp}.{format}"
    storage_key = f"exports/{filename}"
    
    export = Export(
        report_id=report_id,
        format=format,
        storage_key=storage_key,
        filename=filename
    )
    
    db.add(export)
    await db.commit()
    await db.refresh(export)
    
    # Queue export job (simplified - should use RQ in production)
    # For now, return export ID and let client poll
    
    return {
        "export_id": export.id,
        "status": "processing",
        "message": f"Export {format.upper()} is being generated"
    }


@router.get("/exports/{export_id}/download")
async def download_export(
    export_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download exported file"""
    
    stmt = select(Export).where(Export.id == export_id)
    result = await db.execute(stmt)
    export = result.scalar_one_or_none()
    
    if not export:
        raise HTTPException(status_code=404, detail="Export not found")
    
    # Generate presigned URL
    try:
        url = minio_client.presigned_get_object(
            "exports",
            export.storage_key.replace("exports/", ""),
            expires=3600  # 1 hour
        )
        
        return {
            "download_url": url,
            "filename": export.filename,
            "format": export.format
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate download URL: {str(e)}")
