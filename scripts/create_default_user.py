#!/usr/bin/env python
"""
Script to create default user account for Sijadin
Creates: admin@sijadin.local / admin123
"""
import sys
import os
import asyncio

# Add API path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../apps/api')))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

# Database URL - using local PostgreSQL
DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/sijadin_db"
from app.core.security import get_password_hash
from app.models.user import User, UserRole


async def create_default_user():
    """Create default admin user."""
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    email = "admin@sijadin.local"
    password = "admin123"
    role = UserRole.ADMIN
    
    async with async_session() as session:
        # Check if user exists
        result = await session.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print(f"✅ Default user already exists!")
            print(f"   Email: {email}")
            print(f"   Password: {password}")
            return existing_user
        
        # Create new user
        new_user = User(
            email=email,
            password_hash=get_password_hash(password),
            role=role
        )
        
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        
        print(f"✅ Default user created successfully!")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Role: {role}")
        
        return new_user
    
    await engine.dispose()


if __name__ == "__main__":
    print("=" * 60)
    print("Creating Default Sijadin User")
    print("=" * 60)
    print()
    asyncio.run(create_default_user())
    print()
    print("=" * 60)
