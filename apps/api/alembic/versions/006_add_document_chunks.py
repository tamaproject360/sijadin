"""add document chunks for RAG

Revision ID: 006
Revises: 005
Create Date: 2024-01-20

"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers
revision = '006'
down_revision = '005'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create document_chunks table
    op.create_table(
        'document_chunks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('report_id', sa.Integer(), nullable=False),
        sa.Column('file_id', sa.Integer(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('source_type', sa.String(50), nullable=True),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('embedding', Vector(1536), nullable=True),
        sa.ForeignKeyConstraint(['report_id'], ['reports.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['file_id'], ['report_files.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('ix_document_chunks_report_id', 'document_chunks', ['report_id'])
    op.create_index('ix_document_chunks_embedding', 'document_chunks', ['embedding'], postgresql_using='ivfflat')


def downgrade() -> None:
    op.drop_index('ix_document_chunks_embedding', table_name='document_chunks')
    op.drop_index('ix_document_chunks_report_id', table_name='document_chunks')
    op.drop_table('document_chunks')
