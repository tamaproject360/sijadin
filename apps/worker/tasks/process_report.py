from typing import List, Dict, Any
from sqlalchemy import select
from io import BytesIO
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from worker.base_job import BaseJob
from worker.parsers.pdf_parser import PDFParser
from worker.parsers.docx_parser import DOCXParser
from worker.parsers.file_classifier import FileClassifier


class ProcessReportJob(BaseJob):
    """Job to process report files: classify, extract text, and prepare for draft generation."""
    
    async def execute(self):
        """Execute the processing pipeline."""
        from app.models.report_file import ReportFile
        from app.models.report import Report
        from app.core.config import settings
        from app.utils.minio_client import minio_client
        
        # Step 1: Get all files for this report
        await self.update_progress(10, "running")
        
        async with self.async_session() as session:
            result = await session.execute(
                select(ReportFile).where(ReportFile.report_id == self.report_id)
            )
            files = result.scalars().all()
            
            if not files:
                raise Exception("No files found for this report")
            
            total_files = len(files)
            processed_data = []
            
            # Step 2: Process each file
            for idx, file in enumerate(files):
                progress = 10 + int((idx / total_files) * 60)  # 10-70%
                await self.update_progress(progress)
                
                # Download file from MinIO
                try:
                    response = minio_client.get_object(
                        bucket_name=settings.MINIO_BUCKET_UPLOADS,
                        object_name=file.storage_key
                    )
                    file_content = response.read()
                except Exception as e:
                    print(f"Error downloading file {file.id}: {str(e)}")
                    continue
                
                # Extract text based on file type
                extracted_text = ""
                extraction_result = {}
                
                if file.mime == "application/pdf":
                    extraction_result = PDFParser.extract_text(file_content)
                    extracted_text = extraction_result.get("full_text", "")
                
                elif file.mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    extraction_result = DOCXParser.extract_text(file_content)
                    extracted_text = extraction_result.get("full_text", "")
                
                elif file.mime.startswith("image/"):
                    # For images, we'll just mark them as photos
                    # Vision LLM processing will be added in Phase 6
                    extracted_text = ""
                    extraction_result = {"success": True, "is_image": True}
                
                # Classify file
                category = FileClassifier.classify(
                    filename=file.filename,
                    mime_type=file.mime,
                    text_content=extracted_text
                )
                
                # Update file classification in database
                file.kind = category
                
                processed_data.append({
                    "file_id": file.id,
                    "filename": file.filename,
                    "category": category,
                    "category_name": FileClassifier.get_category_name(category),
                    "extracted_text": extracted_text[:500],  # Store preview
                    "full_text_length": len(extracted_text),
                    "extraction_success": extraction_result.get("success", False)
                })
            
            await session.commit()
            
            # Step 3: Build facts (simplified for MVP)
            await self.update_progress(80)
            facts = await self.build_facts(processed_data, session)
            
            # Step 4: Update report status
            await self.update_progress(90)
            report_result = await session.execute(
                select(Report).where(Report.id == self.report_id)
            )
            report = report_result.scalar_one_or_none()
            
            if report:
                report.status = "ready_to_review"
                await session.commit()
            
            await self.update_progress(100)
            
            return {
                "processed_files": len(processed_data),
                "facts": facts
            }
    
    async def build_facts(self, processed_data: List[Dict[str, Any]], session) -> Dict[str, Any]:
        """Build facts JSON from processed files (simplified MVP version)."""
        from app.models.report import Report
        
        # Get report metadata
        result = await session.execute(
            select(Report).where(Report.id == self.report_id)
        )
        report = result.scalar_one_or_none()
        
        # Group files by category
        files_by_category = {}
        for item in processed_data:
            category = item["category"]
            if category not in files_by_category:
                files_by_category[category] = []
            files_by_category[category].append(item)
        
        # Build basic facts structure
        facts = {
            "report_id": self.report_id,
            "metadata": {
                "title": report.title if report else "",
                "activity_name": report.activity_name if report else "",
                "location": report.location if report else "",
                "date_start": report.date_start if report else "",
                "date_end": report.date_end if report else "",
                "unit": report.unit if report else ""
            },
            "files_summary": {
                "total": len(processed_data),
                "by_category": {
                    category: len(items) 
                    for category, items in files_by_category.items()
                }
            },
            "classified_files": files_by_category
        }
        
        # TODO: In Phase 8, this will be enhanced with:
        # - LLM-based extraction of key information
        # - Agenda parsing
        # - Participant list extraction
        # - Date/location normalization
        
        return facts


# RQ task wrapper
def process_report_task(report_id: int, job_id: int):
    """RQ task to process a report."""
    from worker.base_job import run_job_sync
    run_job_sync(ProcessReportJob, report_id, job_id)
