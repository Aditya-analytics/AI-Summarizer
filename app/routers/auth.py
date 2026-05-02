from app.helper.auth import create_access_token
from app.helper.auth import verify_password
from app.helper.auth import hash_password
from app.data.models import User
from fastapi import APIRouter,Depends,HTTPException
from app.schemas import Sign
from app.data.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter(
    prefix="/authentication",
    tags=["auths"]
)

@router.post("/signup",status_code=201)
async def signup(payload:Sign,db : AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email==payload.email) 
    result = await db.execute(stmt)

    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered!")
    
    hashed_pass = hash_password(payload.password)

    new_user = User(
        email = payload.email,
        hashed_password = hashed_pass
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}
    
@router.post("/login",status_code=200)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    # 1. Look up the user by email (OAuth2 calls it 'username')
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    # 2. Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Create the JWT (storing user_id in the 'sub' claim)
    access_token = create_access_token(user.id)

    # 4. Return the token in the standard OAuth2 format
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }


