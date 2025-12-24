from typing import Optional, Dict, Any
import re


class FileClassifier:
    """Classify uploaded files into categories using heuristics."""
    
    # File categories
    CATEGORIES = {
        "kak": "KAK/TOR",
        "agenda": "Susunan Acara/Agenda",
        "tiket": "Tiket Perjalanan",
        "undangan": "Undangan",
        "daftar_hadir": "Daftar Hadir/Peserta",
        "foto": "Foto Dokumentasi",
        "lainnya": "Lainnya"
    }
    
    # Keywords for classification
    KEYWORDS = {
        "kak": [
            r"kerangka\s+acuan\s+kerja",
            r"\bkak\b",
            r"term\s+of\s+reference",
            r"\btor\b",
            r"latar\s+belakang",
            r"tujuan\s+kegiatan",
            r"sasaran"
        ],
        "agenda": [
            r"susunan\s+acara",
            r"agenda\s+kegiatan",
            r"rundown",
            r"jadwal\s+kegiatan",
            r"timeline"
        ],
        "tiket": [
            r"boarding\s+pass",
            r"tiket\s+pesawat",
            r"tiket\s+kereta",
            r"e-ticket",
            r"booking\s+code",
            r"garuda",
            r"lion\s+air",
            r"kai\s+access"
        ],
        "undangan": [
            r"undangan",
            r"invitation",
            r"mengundang",
            r"hadir\s+dalam",
            r"acara\s+.*\s+pada"
        ],
        "daftar_hadir": [
            r"daftar\s+hadir",
            r"daftar\s+peserta",
            r"attendance\s+list",
            r"participant\s+list",
            r"nama\s+.*\s+tanda\s+tangan"
        ]
    }
    
    @classmethod
    def classify_by_filename(cls, filename: str) -> Optional[str]:
        """Classify file based on filename."""
        filename_lower = filename.lower()
        
        if any(keyword in filename_lower for keyword in ["kak", "tor", "kerangka"]):
            return "kak"
        elif any(keyword in filename_lower for keyword in ["agenda", "susunan", "rundown"]):
            return "agenda"
        elif any(keyword in filename_lower for keyword in ["tiket", "ticket", "boarding"]):
            return "tiket"
        elif any(keyword in filename_lower for keyword in ["undangan", "invitation"]):
            return "undangan"
        elif any(keyword in filename_lower for keyword in ["daftar", "hadir", "peserta", "attendance"]):
            return "daftar_hadir"
        elif any(keyword in filename_lower for keyword in ["foto", "photo", "img", "dokumentasi"]):
            return "foto"
        
        return None
    
    @classmethod
    def classify_by_content(cls, text: str, max_chars: int = 2000) -> Optional[str]:
        """Classify file based on text content (first N characters)."""
        if not text:
            return None
        
        # Use only first part of text for efficiency
        text_sample = text[:max_chars].lower()
        
        # Score each category
        scores = {}
        for category, patterns in cls.KEYWORDS.items():
            score = 0
            for pattern in patterns:
                matches = re.findall(pattern, text_sample, re.IGNORECASE)
                score += len(matches)
            scores[category] = score
        
        # Get category with highest score
        if scores:
            max_category = max(scores, key=scores.get)
            if scores[max_category] > 0:
                return max_category
        
        return None
    
    @classmethod
    def classify_by_mime(cls, mime_type: str) -> Optional[str]:
        """Classify file based on MIME type."""
        if mime_type.startswith("image/"):
            return "foto"
        return None
    
    @classmethod
    def classify(cls, filename: str, mime_type: str, text_content: Optional[str] = None) -> str:
        """
        Classify file using multiple heuristics.
        Returns category key or 'lainnya' if uncertain.
        """
        # Try filename first
        category = cls.classify_by_filename(filename)
        if category:
            return category
        
        # Try MIME type
        category = cls.classify_by_mime(mime_type)
        if category:
            return category
        
        # Try content if available
        if text_content:
            category = cls.classify_by_content(text_content)
            if category:
                return category
        
        # Default to 'lainnya'
        return "lainnya"
    
    @classmethod
    def get_category_name(cls, category_key: str) -> str:
        """Get human-readable category name."""
        return cls.CATEGORIES.get(category_key, "Lainnya")
