"""add_report_metadata_fields

Revision ID: 002
Revises: 001
Create Date: 2024-12-24 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add metadata fields to reports table
    op.add_column('reports', sa.Column('activity_name', sa.String(length=500), nullable=True))
    op.add_column('reports', sa.Column('location', sa.String(length=500), nullable=True))
    op.add_column('reports', sa.Column('date_start', sa.String(length=50), nullable=True))
    op.add_column('reports', sa.Column('date_end', sa.String(length=50), nullable=True))
    op.add_column('reports', sa.Column('unit', sa.String(length=500), nullable=True))
    
    # Make org_id nullable (for MVP)
    op.alter_column('reports', 'org_id', nullable=True)


def downgrade() -> None:
    # Remove metadata fields
    op.drop_column('reports', 'unit')
    op.drop_column('reports', 'date_end')
    op.drop_column('reports', 'date_start')
    op.drop_column('reports', 'location')
    op.drop_column('reports', 'activity_name')
    
    # Revert org_id to not nullable
    op.alter_column('reports', 'org_id', nullable=False)
