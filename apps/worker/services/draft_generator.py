"""
Draft Generator Service
Generate structured draft from facts and template schema
"""
import sys
sys.path.insert(0, '/app')

from typing import Dict, Any, List
import json
from app.schemas.facts import Facts
from app.schemas.draft import Draft, DraftMeta, Section, Subsection, Citation
from app.services.llm_factory import get_llm_provider, LLMProviderType
from app.services.rag_service import RAGService


class DraftGenerator:
    """Generate draft sections from facts"""
    
    def __init__(self, db_session=None):
        self.llm = get_llm_provider(LLMProviderType.GEMINI)
        self.rag = RAGService(db_session) if db_session else None
    
    async def generate_draft(
        self,
        facts: Facts,
        template_schema: Dict[str, Any],
        report_id: int
    ) -> Draft:
        """Generate complete draft from facts"""
        
        # Build metadata
        meta = DraftMeta(
            activity_name=facts.activity_name or "Kegiatan",
            location=facts.location or "",
            date_start=str(facts.date_start) if facts.date_start else "",
            date_end=str(facts.date_end) if facts.date_end else "",
            unit=facts.unit or "",
            participants=[p.name for p in facts.participants]
        )
        
        # Generate sections based on template schema
        sections = []
        for section_def in template_schema.get("sections", []):
            section = await self._generate_section(
                section_def=section_def,
                facts=facts,
                report_id=report_id
            )
            sections.append(section)
        
        # Build draft
        draft = Draft(
            template_id=template_schema.get("template_id", "default"),
            title=f"Laporan Perjalanan Dinas {facts.activity_name or ''}",
            meta=meta,
            sections=sections
        )
        
        return draft
    
    async def _generate_section(
        self,
        section_def: Dict[str, Any],
        facts: Facts,
        report_id: int
    ) -> Section:
        """Generate a single section"""
        
        section_key = section_def["key"]
        section_title = section_def["title"]
        
        # Build context from RAG if available
        context = ""
        if self.rag:
            context = await self.rag.build_context(
                query=f"Informasi untuk bagian {section_title}",
                report_id=report_id,
                max_tokens=1500
            )
        
        # Generate content using LLM
        content = await self._generate_section_content(
            section_key=section_key,
            section_title=section_title,
            facts=facts,
            context=context
        )
        
        # Build section
        section = Section(
            key=section_key,
            title=section_title,
            content=content,
            citations=[]
        )
        
        # Handle special sections
        if section_key == "pelaksanaan" and facts.agenda:
            section.subsections = [
                Subsection(
                    key="agenda",
                    title="Agenda Kegiatan",
                    table=[{"data": {
                        "waktu": item.time or "",
                        "kegiatan": item.activity,
                        "pembicara": item.speaker or ""
                    }} for item in facts.agenda]
                )
            ]
        
        return section
    
    async def _generate_section_content(
        self,
        section_key: str,
        section_title: str,
        facts: Facts,
        context: str
    ) -> str:
        """Generate content for a section"""
        
        # Build prompt based on section type
        prompts = {
            "pendahuluan": f"""Tulis bagian Pendahuluan untuk laporan perjalanan dinas.
Kegiatan: {facts.activity_name}
Tujuan: {facts.activity_purpose}
Lokasi: {facts.location}
Tanggal: {facts.date_start} s/d {facts.date_end}

Tulis 2-3 paragraf yang menjelaskan latar belakang dan tujuan kegiatan.""",
            
            "pelaksanaan": f"""Tulis bagian Pelaksanaan Kegiatan.
Ringkasan: {facts.activity_summary}

Jelaskan bagaimana kegiatan dilaksanakan, siapa yang terlibat, dan apa yang dilakukan.""",
            
            "hasil": f"""Tulis bagian Hasil dan Pembahasan.
Hasil utama: {', '.join(facts.key_outcomes)}

Jelaskan hasil yang dicapai dari kegiatan ini.""",
            
            "penutup": """Tulis bagian Penutup/Kesimpulan.
Buat kesimpulan singkat dan saran tindak lanjut."""
        }
        
        prompt = prompts.get(section_key, f"Tulis bagian {section_title} untuk laporan.")
        
        # Add context if available
        if context:
            prompt = f"{prompt}\n\nReferensi dari dokumen:\n{context}"
        
        # Generate with LLM
        content = await self.llm.generate_text(
            prompt=prompt,
            temperature=0.7
        )
        
        return content.strip()
