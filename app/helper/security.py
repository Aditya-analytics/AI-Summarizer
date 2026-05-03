import base64
import hashlib
from cryptography.fernet import Fernet
from app.config import SECRET_KEY

# Derive a 32-byte key for Fernet from the application's SECRET_KEY
def _get_fernet_key():
    h = hashlib.sha256(SECRET_KEY.encode()).digest()
    return base64.urlsafe_b64encode(h)

_fernet = Fernet(_get_fernet_key())

def encrypt_api_key(api_key: str) -> str:
    """Encrypts an API key using the system's secret key."""
    if not api_key:
        return None
    clean_key = api_key.strip()
    return _fernet.encrypt(clean_key.encode()).decode()

def decrypt_api_key(encrypted_key: str) -> str:
    """Decrypts an encrypted API key."""
    if not encrypted_key:
        return None
    try:
        decrypted = _fernet.decrypt(encrypted_key.encode()).decode()
        return decrypted.strip() # Final sanitize
    except Exception as e:
        print(f"LOG: Decryption Error: {e}")
        return None
