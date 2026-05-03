"""nova_gauntlet_fields

Revision ID: 7b8c9d0e1f2a
Revises: 1319f13cae3e
Create Date: 2026-05-03 14:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7b8c9d0e1f2a'
down_revision: Union[str, Sequence[str], None] = '1319f13cae3e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('gauntlet_api_key', sa.String(), nullable=True))
    op.add_column('users', sa.Column('gauntlet_engine_model', sa.String(), server_default='models/gemini-2.5-flash-lite', nullable=False))
    op.add_column('users', sa.Column('gauntlet_embeddings_model', sa.String(), server_default='models/text-embedding-004', nullable=False))
    op.add_column('users', sa.Column('free_calls_remaining', sa.Integer(), server_default='10', nullable=False))

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'free_calls_remaining')
    op.drop_column('users', 'gauntlet_embeddings_model')
    op.drop_column('users', 'gauntlet_engine_model')
    op.drop_column('users', 'gauntlet_api_key')
