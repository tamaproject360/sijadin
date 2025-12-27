"""Test file upload to MinIO directly."""
import sys
sys.path.insert(0, '../apps/api')

from minio import Minio
from io import BytesIO

# MinIO configuration
MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadmin123"
MINIO_SECURE = False
BUCKET_NAME = "uploads"

def test_minio_connection():
    """Test MinIO connection and upload."""
    print("Testing MinIO connection...")
    
    try:
        # Create client
        client = Minio(
            MINIO_ENDPOINT,
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=MINIO_SECURE,
        )
        print("✓ MinIO client created")
        
        # Check bucket exists
        if client.bucket_exists(BUCKET_NAME):
            print(f"✓ Bucket '{BUCKET_NAME}' exists")
        else:
            print(f"✗ Bucket '{BUCKET_NAME}' does not exist")
            print("Creating bucket...")
            client.make_bucket(BUCKET_NAME)
            print(f"✓ Bucket '{BUCKET_NAME}' created")
        
        # Test upload
        test_content = b"Hello, this is a test file!"
        test_object = "test/test_file.txt"
        
        client.put_object(
            BUCKET_NAME,
            test_object,
            BytesIO(test_content),
            length=len(test_content),
            content_type="text/plain"
        )
        print(f"✓ Test file uploaded to '{test_object}'")
        
        # Test download
        response = client.get_object(BUCKET_NAME, test_object)
        downloaded = response.read()
        response.close()
        response.release_conn()
        
        if downloaded == test_content:
            print("✓ Test file downloaded and verified")
        else:
            print("✗ Downloaded content doesn't match")
        
        # Cleanup
        client.remove_object(BUCKET_NAME, test_object)
        print("✓ Test file cleaned up")
        
        print("\n✓ All MinIO tests passed!")
        return True
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False


if __name__ == "__main__":
    test_minio_connection()
