"""
Export Service - Generate DOCX and PDF from draft
"""
import sys
sys.path.insert(0, '/app')

from pathlib import Path
from typing import Dict, Any
import json
from docxtpl import DocxTemplate
from playwright.async_api import async_playwright
import tempfile

from app.schemas.draft import Draft


class ExportService:
    """Export draft to DOCX and PDF"""
    
    def __init__(self, templates_dir: str = "/app/templates"):
        self.templates_dir = Path(templates_dir)
    
    async def export_docx(
        self,
        draft: Draft,
        template_path: str,
        output_path: str
    ) -> str:
        """Export draft to DOCX using template"""
        
        # Load template
        doc = DocxTemplate(template_path)
        
        # Prepare context for docxtpl
        context = self._prepare_docx_context(draft)
        
        # Render template
        doc.render(context)
        
        # Save
        doc.save(output_path)
        
        return output_path
    
    async def export_pdf(
        self,
        draft: Draft,
        output_path: str
    ) -> str:
        """Export draft to PDF via HTML rendering"""
        
        # Generate HTML from draft
        html_content = self._generate_html(draft)
        
        # Convert HTML to PDF using Playwright
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Set content
            await page.set_content(html_content)
            
            # Generate PDF
            await page.pdf(
                path=output_path,
                format='A4',
                margin={
                    'top': '2cm',
                    'right': '2cm',
                    'bottom': '2cm',
                    'left': '2cm'
                },
                print_background=True
            )
            
            await browser.close()
        
        return output_path
    
    def _prepare_docx_context(self, draft: Draft) -> Dict[str, Any]:
        """Prepare context dictionary for docxtpl"""
        
        context = {
            "title": draft.title,
            "meta": draft.meta.model_dump(),
            "sections": {}
        }
        
        # Convert sections to dict
        for section in draft.sections:
            section_data = {
                "title": section.title,
                "content": section.content or "",
                "subsections": []
            }
            
            # Add subsections
            for subsec in section.subsections:
                subsec_data = {
                    "title": subsec.title,
                    "content": subsec.content or "",
                    "table": subsec.table or []
                }
                section_data["subsections"].append(subsec_data)
            
            # Add attachments
            if section.attachments:
                section_data["attachments"] = section.attachments
            
            context["sections"][section.key] = section_data
        
        # Flatten for easier template access
        context.update(context["sections"])
        
        return context
    
    def _generate_html(self, draft: Draft) -> str:
        """Generate HTML from draft"""
        
        html_parts = [
            """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        h1 {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 20px;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        p {
            text-align: justify;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .meta-info {
            margin-bottom: 30px;
        }
        .meta-row {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
"""
        ]
        
        # Title
        html_parts.append(f"<h1>{draft.title}</h1>")
        
        # Metadata
        html_parts.append('<div class="meta-info">')
        html_parts.append(f'<div class="meta-row"><strong>Kegiatan:</strong> {draft.meta.activity_name}</div>')
        html_parts.append(f'<div class="meta-row"><strong>Lokasi:</strong> {draft.meta.location}</div>')
        html_parts.append(f'<div class="meta-row"><strong>Tanggal:</strong> {draft.meta.date_start} s/d {draft.meta.date_end}</div>')
        html_parts.append(f'<div class="meta-row"><strong>Unit:</strong> {draft.meta.unit}</div>')
        html_parts.append('</div>')
        
        # Sections
        for section in draft.sections:
            html_parts.append(f"<h2>{section.title}</h2>")
            
            if section.content:
                # Split paragraphs
                paragraphs = section.content.split('\n\n')
                for para in paragraphs:
                    if para.strip():
                        html_parts.append(f"<p>{para.strip()}</p>")
            
            # Subsections
            for subsec in section.subsections:
                if subsec.title:
                    html_parts.append(f"<h3>{subsec.title}</h3>")
                
                if subsec.content:
                    html_parts.append(f"<p>{subsec.content}</p>")
                
                # Tables
                if subsec.table:
                    html_parts.append("<table>")
                    
                    # Header
                    if subsec.table:
                        keys = list(subsec.table[0].data.keys())
                        html_parts.append("<thead><tr>")
                        for key in keys:
                            html_parts.append(f"<th>{key.replace('_', ' ').title()}</th>")
                        html_parts.append("</tr></thead>")
                        
                        # Rows
                        html_parts.append("<tbody>")
                        for row in subsec.table:
                            html_parts.append("<tr>")
                            for key in keys:
                                html_parts.append(f"<td>{row.data.get(key, '')}</td>")
                            html_parts.append("</tr>")
                        html_parts.append("</tbody>")
                    
                    html_parts.append("</table>")
        
        html_parts.append("</body></html>")
        
        return "\n".join(html_parts)
