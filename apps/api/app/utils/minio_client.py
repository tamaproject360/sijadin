from minio import Minio
from minio.error import S3Error
from app.core.config import settings
import io


class MinIOClient:
    def __init__(self):
        try:
            self.client = Minio(
                settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=settings.MINIO_SECURE,
            )
            self._ensure_buckets()
            print(f"✓ MinIO client initialized: {settings.MINIO_ENDPOINT}")
        except Exception as e:
            print(f"✗ MinIO client initialization failed: {e}")
            raise

    def _ensure_buckets(self):
        """Ensure all required buckets exist"""
        buckets = [
            settings.MINIO_BUCKET_UPLOADS,
            settings.MINIO_BUCKET_EXPORTS,
            settings.MINIO_BUCKET_ARTIFACTS,
        ]
        for bucket in buckets:
            try:
                if not self.client.bucket_exists(bucket):
                    self.client.make_bucket(bucket)
            except S3Error as e:
                print(f"Error ensuring bucket {bucket}: {e}")

    def upload_file(self, bucket: str, object_name: str, file_data: bytes, content_type: str):
        """Upload file to MinIO"""
        try:
            print(f"Uploading to MinIO: bucket={bucket}, object={object_name}, size={len(file_data)}, type={content_type}")
            self.client.put_object(
                bucket,
                object_name,
                io.BytesIO(file_data),
                length=len(file_data),
                content_type=content_type,
            )
            print(f"✓ Upload successful: {object_name}")
            return True
        except S3Error as e:
            print(f"✗ S3Error uploading file: {e}")
            return False
        except Exception as e:
            print(f"✗ Error uploading file: {e}")
            return False

    def download_file(self, bucket: str, object_name: str):
        """Download file from MinIO"""
        try:
            response = self.client.get_object(bucket, object_name)
            return response.read()
        except S3Error as e:
            print(f"Error downloading file: {e}")
            return None

    def delete_file(self, bucket: str, object_name: str):
        """Delete file from MinIO"""
        try:
            self.client.remove_object(bucket, object_name)
            return True
        except S3Error as e:
            print(f"Error deleting file: {e}")
            return False

    def get_presigned_url(self, bucket: str, object_name: str, expires: int = 3600):
        """Get presigned URL for file"""
        try:
            url = self.client.presigned_get_object(bucket, object_name, expires=expires)
            return url
        except S3Error as e:
            print(f"Error getting presigned URL: {e}")
            return None


# Singleton instance
minio_client = MinIOClient()
