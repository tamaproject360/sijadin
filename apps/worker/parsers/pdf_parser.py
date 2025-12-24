import fitz  # PyMuPDF
from typing import Dict, List, Any
from io import BytesIO


class PDFParser:
    """Extract text and metadata from PDF files."""
    
    @staticmethod
    def extract_text(file_content: bytes) -> Dict[str, Any]:
        """Extract text from PDF file."""
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
            
            text_content = []
            page_texts = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                page_text = page.get_text()
                page_texts.append({
                    "page": page_num + 1,
                    "text": page_text
                })
                text_content.append(page_text)
            
            full_text = "\n\n".join(text_content)
            
            # Get metadata
            metadata = doc.metadata
            
            doc.close()
            
            return {
                "success": True,
                "full_text": full_text,
                "pages": page_texts,
                "page_count": len(doc),
                "metadata": metadata,
                "has_text": len(full_text.strip()) > 0
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "full_text": "",
                "pages": [],
                "page_count": 0
            }
    
    @staticmethod
    def extract_images(file_content: bytes) -> List[Dict[str, Any]]:
        """Extract images from PDF (for OCR fallback)."""
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
            images = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                image_list = page.get_images()
                
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    
                    images.append({
                        "page": page_num + 1,
                        "index": img_index,
                        "image_bytes": base_image["image"],
                        "ext": base_image["ext"]
                    })
            
            doc.close()
            
            return images
        
        except Exception as e:
            print(f"Error extracting images: {str(e)}")
            return []
