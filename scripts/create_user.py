#!/usr/bin/env python
"""
Script to create a user account for Sijadin
Usage: python scripts/create_user.py
"""
import sys
import os
import asyncio

# Add API path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../apps/api')))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole


async def create_user(email: str, password: str, role: UserRole = UserRole.USER):
    """Create a new user."""
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Check if user exists
        result = await session.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print(f"❌ User with email {email} already exists!")
            return None
        
        # Create new user
        new_user = User(
            email=email,
            password_hash=get_password_hash(password),
            role=role
        )
        
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        
        print(f"✅ User created successfully!")
        print(f"   ID: {new_user.id}")
        print(f"   Email: {new_user.email}")
        print(f"   Role: {new_user.role}")
        print(f"   Created: {new_user.created_at}")
        
        return new_user
    
    await engine.dispose()


async def main():
    print("=" * 60)
    print("Sijadin - Create User Account")
    print("=" * 60)
    print()
    
    # Get user input
    email = input("Email: ").strip()
    if not email:
        print("❌ Email is required!")
        return
    
    password = input("Password: ").strip()
    if not password:
        print("❌ Password is required!")
        return
    
    if len(password) < 8:
        print("❌ Password must be at least 8 characters!")
        return
    
    role_input = input("Role (admin/user/viewer) [default: user]: ").strip().lower()
    if not role_input:
        role_input = "user"
    
    try:
        role = UserRole(role_input)
    except ValueError:
        print(f"❌ Invalid role! Must be one of: admin, user, viewer")
        return
    
    print()
    print("Creating user...")
    print()
    
    await create_user(email, password, role)


if __name__ == "__main__":
    asyncio.run(main())
