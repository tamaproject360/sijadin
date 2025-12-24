from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
from io import BytesIO

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.core.config import settings
from app.models.user import User
from app.models.report import Report
from app.models.report_file import ReportFile
from app.schemas.file import ReportFileResponse, FileListResponse
from app.utils.minio_client import minio_client

router = APIRouter()

# Allowed MIME types
ALLOWED_MIMES = settings.ALLOWED_MIME_TYPES.split(",")
MAX_SIZE = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024  # Convert to bytes


def validate_file(file: UploadFile) -> None:
    """Validate file size and mime type."""
    if file.content_type not in ALLOWED_MIMES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(ALLOWED_MIMES)}"
        )


@router.post("/reports/{report_id}/files", response_model=ReportFileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    report_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a file to a report."""
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
    
    # Validate file
    validate_file(file)
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    if file_size > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB"
        )
    
    # Generate storage key
    file_ext = file.filename.split(".")[-1] if "." in file.filename else ""
    storage_key = f"reports/{report_id}/{uuid.uuid4()}.{file_ext}"
    
    # Upload to MinIO
    try:
        minio_client.put_object(
            bucket_name=settings.MINIO_BUCKET_UPLOADS,
            object_name=storage_key,
            data=BytesIO(content),
            length=file_size,
            content_type=file.content_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )
    
    # Save metadata to database
    report_file = ReportFile(
        report_id=report_id,
        filename=file.filename,
        mime=file.content_type,
        size=file_size,
        storage_key=storage_key,
        kind=None  # Will be classified later
    )
    
    db.add(report_file)
    await db.commit()
    await db.refresh(report_file)
    
    return report_file


@router.get("/reports/{report_id}/files", response_model=FileListResponse)
async def list_files(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all files for a report."""
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
    
    # Get files
    files_result = await db.execute(
        select(ReportFile)
        .where(ReportFile.report_id == report_id)
        .order_by(ReportFile.created_at.desc())
    )
    files = files_result.scalars().all()
    
    return {
        "files": files,
        "total": len(files)
    }


@router.get("/files/{file_id}/download")
async def download_file(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Download a file."""
    # Get file metadata
    result = await db.execute(select(ReportFile).where(ReportFile.id == file_id))
    file_record = result.scalar_one_or_none()
    
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Verify user has access to this file's report
    report_result = await db.execute(
        select(Report).where(
            Report.id == file_record.report_id,
            Report.created_by == current_user.id
        )
    )
    report = report_result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Download from MinIO
    try:
        response = minio_client.get_object(
            bucket_name=settings.MINIO_BUCKET_UPLOADS,
            object_name=file_record.storage_key
        )
        
        return StreamingResponse(
            response,
            media_type=file_record.mime,
            headers={
                "Content-Disposition": f'attachment; filename="{file_record.filename}"'
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to download file: {str(e)}"
        )
