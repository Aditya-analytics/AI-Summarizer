import fitz
from fastapi import UploadFile, File

class InvalidPDFError(Exception):
    """Exception raised for non-compliant or corrupted PDF files."""
    pass

async def extract_pdf_text(file : UploadFile = File(...,detail="Upload pdf to process")):
    if file.content_type != "application/pdf":
        raise InvalidPDFError("Please upload pdf file only!")
    
    pdf_bytes = await file.read()

    with fitz.open(stream=pdf_bytes,filetype="pdf") as doc :
        text_pages = [page.get_text("text",sort=True) for page in doc]
    
    raw_text = "\n\n".join(text_pages).strip()
    
    # CRITICAL: Strip NULL bytes which PostgreSQL rejects
    return raw_text.replace('\x00', '')

