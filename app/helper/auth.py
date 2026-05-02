from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta,timezone
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES,SECRET_KEY,ALGORITHM
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends,HTTPException
from app.data.database import get_db
from app.data.models import User
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="authentication/login")
pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

def hash_password(password:str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_pass,hashed_pass):
    return pwd_context.verify(plain_pass,hashed_pass)

def create_access_token(user_id:int):
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.now(timezone.utc),
        "role": "admin"
    }
    encoded_jwt = jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get('sub')
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
            
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    # query the database
    stmt = select(User).where(User.id == int(user_id))
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="User not found!")

    return user  


