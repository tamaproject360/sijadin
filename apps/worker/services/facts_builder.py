"""
Facts Builder Service
Normalize all extracted data into Facts JSON
"""
import sys
sys.path.insert(0, '/app')

from typing import Dict, Any, List
import json
from datetime import datetime
from app.schemas.facts import Facts, ParticipantFact, AgendaItem, AttachmentFact
from app.services.llm_factory import get_llm_provider, LLMProviderType


class FactsBuilder:
    """Build normalized facts from extracted documents"""
    
    def __init__(self):
        self.llm = get_llm_provider(LLMProviderType.GEMINI)
    
    async def build_facts(
        self,
        extracted_data: Dict[str, Any],
        files_metadata: List[Dict[str, Any]]
    ) -> Facts:
        """Build facts from extracted data"""
        
        # Aggregate all text content
        all_text = self._aggregate_text(extracted_data)
        
        # Use LLM to extract structured facts
        facts_json = await self._extract_facts_with_llm(all_text)
        
        # Parse and validate
        facts = Facts(**facts_json)
        
        # Add attachments metadata
        facts.attachments = self._build_attachments(files_metadata)
        
        # Store raw extractions for reference
        facts.raw_extractions = extracted_data
        
        return facts
    
    def _aggregate_text(self, extracted_data: Dict[str, Any]) -> str:
        """Aggregate all extracted text"""
        texts = []
        
        for file_id, data in extracted_data.items():
            if "text" in data:
                texts.append(f"=== File {file_id} ===\n{data['text']}\n")
            if "tables" in data:
                for table in data["tables"]:
                    texts.append(f"Table: {json.dumps(table)}\n")
        
        return "\n".join(texts)
    
    async def _extract_facts_with_llm(self, text: str) -> Dict[str, Any]:
        """Use LLM to extract structured facts"""
        
        prompt = """Extract the following information from the documents and return as JSON:

{
  "activity_name": "nama kegiatan",
  "activity_purpose": "tujuan kegiatan",
  "location": "lokasi kegiatan",
  "date_start": "YYYY-MM-DD",
  "date_end": "YYYY-MM-DD",
  "unit": "unit/instansi penyelenggara",
  "organizer": "penyelenggara",
  "participants": [
    {"name": "nama", "role": "jabatan", "organization": "instansi"}
  ],
  "agenda": [
    {"time": "HH:MM", "activity": "kegiatan", "speaker": "pembicara", "location": "tempat"}
  ],
  "activity_summary": "ringkasan kegiatan",
  "key_outcomes": ["hasil 1", "hasil 2"]
}

Extract as much information as possible. If a field is not found, use null.
Return ONLY valid JSON, no other text.

Documents:
"""
        
        result = await self.llm.generate_text(
            prompt=prompt,
            context=text[:8000],  # Limit context size
            temperature=0.3
        )
        
        # Parse JSON
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            # Fallback: extract JSON from markdown code block
            if "```json" in result:
                json_str = result.split("```json")[1].split("```")[0]
                return json.loads(json_str)
            raise
    
    def _build_attachments(
        self, 
        files_metadata: List[Dict[str, Any]]
    ) -> List[AttachmentFact]:
        """Build attachments list from files metadata"""
        attachments = []
        
        for file_meta in files_metadata:
            attachments.append(AttachmentFact(
                file_id=file_meta["id"],
                kind=file_meta.get("kind", "other"),
                filename=file_meta["filename"],
                caption=file_meta.get("caption")
            ))
        
        return attachments
