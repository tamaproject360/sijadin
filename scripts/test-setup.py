#!/usr/bin/env python3
"""
Test script to verify Sijadin setup is correct
"""

import sys
import os

def check_python_version():
    """Check Python version"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 11:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print(f"   ❌ Python {version.major}.{version.minor}.{version.micro} (requires 3.11+)")
        return False

def check_directory_structure():
    """Check if directory structure is correct"""
    print("\n📁 Checking directory structure...")
    required_dirs = [
        "apps/api",
        "apps/web",
        "apps/worker",
        "packages/shared",
        "templates/instansi_a",
        "data/uploads",
        "data/exports",
        "scripts",
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"   ✅ {dir_path}")
        else:
            print(f"   ❌ {dir_path} (missing)")
            all_exist = False
    
    return all_exist

def check_required_files():
    """Check if required files exist"""
    print("\n📄 Checking required files...")
    required_files = [
        ".env.example",
        "docker-compose.yml",
        "README.md",
        "apps/api/requirements.txt",
        "apps/api/main.py",
        "apps/api/alembic.ini",
        "templates/instansi_a/schema_v1.json",
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} (missing)")
            all_exist = False
    
    return all_exist

def check_env_file():
    """Check if .env file exists"""
    print("\n⚙️  Checking environment configuration...")
    if os.path.exists(".env"):
        print("   ✅ .env file exists")
        return True
    else:
        print("   ⚠️  .env file not found")
        print("   💡 Run: cp .env.example .env")
        return False

def check_docker():
    """Check if Docker is available"""
    print("\n🐳 Checking Docker...")
    import subprocess
    try:
        result = subprocess.run(
            ["docker", "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"   ✅ {result.stdout.strip()}")
            return True
        else:
            print("   ❌ Docker not available")
            return False
    except Exception as e:
        print(f"   ❌ Docker not available: {e}")
        return False

def check_docker_compose():
    """Check if Docker Compose is available"""
    print("\n🐳 Checking Docker Compose...")
    import subprocess
    try:
        result = subprocess.run(
            ["docker-compose", "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"   ✅ {result.stdout.strip()}")
            return True
        else:
            print("   ❌ Docker Compose not available")
            return False
    except Exception as e:
        print(f"   ❌ Docker Compose not available: {e}")
        return False

def main():
    """Run all checks"""
    print("=" * 60)
    print("🔍 Sijadin Setup Verification")
    print("=" * 60)
    
    checks = [
        check_python_version(),
        check_directory_structure(),
        check_required_files(),
        check_env_file(),
        check_docker(),
        check_docker_compose(),
    ]
    
    print("\n" + "=" * 60)
    if all(checks):
        print("✅ All checks passed! Setup is complete.")
        print("\n📝 Next steps:")
        print("   1. Edit .env file with your configuration")
        print("   2. Run: scripts/start-dev.bat (Windows) or scripts/start-dev.sh (Linux/Mac)")
        print("   3. Setup backend: cd apps/api && python -m venv venv && pip install -r requirements.txt")
        print("   4. Run migrations: cd apps/api && alembic upgrade head")
        print("   5. Start API: cd apps/api && uvicorn main:app --reload")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        sys.exit(1)
    print("=" * 60)

if __name__ == "__main__":
    main()
