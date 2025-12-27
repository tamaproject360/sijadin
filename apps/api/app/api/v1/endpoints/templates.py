"""
Template API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.doc_template import DocTemplate

router = APIRouter()


@router.get("/templates", response_model=List[dict])
async def list_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List available templates"""
    stmt = select(DocTemplate).where(
        DocTemplate.is_active == True
    ).order_by(DocTemplate.created_at.desc())
    
    result = await db.execute(stmt)
    templates = result.scalars().all()
    
    return [
        {
            "id": t.id,
            "name": t.name,
            "version": t.version,
            "organization_id": t.organization_id,
            "created_at": t.created_at
        }
        for t in templates
    ]


@router.get("/templates/{template_id}/schema", response_model=Dict[str, Any])
async def get_template_schema(
    template_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get template schema"""
    stmt = select(DocTemplate).where(DocTemplate.id == template_id)
    result = await db.execute(stmt)
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template.schema_json
