from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TaskIn(BaseModel):
    title: str
    deadline: Optional[str] = ""

class TaskOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    title: str
    deadline: Optional[str] = ""
    completed: bool

    