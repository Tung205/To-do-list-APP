# main.py
from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
from datetime import timedelta
import uvicorn

from db import users_collection, tasks_collection
from auth import hash_password, verify_password, create_access_token, decode_access_token

app = FastAPI(title="Todo App API")

# CORS: change origins list in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupIn(BaseModel):
    email: str
    password: str

class LoginIn(BaseModel):
    email: str
    password: str

def get_user_from_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")

    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return payload  # contains user_id, email, exp

@app.post("/api/auth/signup")
async def signup(data: SignupIn):
    existing = await users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(data.password)
    user_doc = {"email": data.email, "hashed_password": hashed}
    res = await users_collection.insert_one(user_doc)
    return {"id": str(res.inserted_id), "email": data.email}

@app.post("/api/auth/login")
async def login(data: LoginIn):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"user_id": str(user["_id"]), "email": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Tasks endpoints
@app.post("/api/tasks", status_code=201)
async def create_task(payload: dict, auth=Depends(get_user_from_token)):
    # payload expects {"title": "...", "deadline": "YYYY-MM-DD" or ""}
    user_id = auth["user_id"]
    title = payload.get("title")
    deadline = payload.get("deadline", "")
    if not title:
        raise HTTPException(status_code=400, detail="Missing title")
    doc = {"user_id": user_id, "title": title, "deadline": deadline or "", "completed": False}
    res = await tasks_collection.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    return {"id": str(res.inserted_id), **doc}

@app.get("/api/tasks", response_model=list)
async def list_tasks(auth=Depends(get_user_from_token)):
    user_id = auth["user_id"]
    cursor = tasks_collection.find({"user_id": user_id})
    tasks = []
    async for t in cursor:
        t["_id"] = str(t["_id"])
        tasks.append(t)
    return tasks

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: str, payload: dict, auth=Depends(get_user_from_token)):
    user_id = auth["user_id"]
    # build update doc
    update_doc = {}
    for k in ("title", "deadline", "completed"):
        if k in payload:
            update_doc[k] = payload[k]
    if not update_doc:
        raise HTTPException(status_code=400, detail="No fields to update")
    res = await tasks_collection.update_one({"_id": ObjectId(task_id), "user_id": user_id}, {"$set": update_doc})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    updated = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    updated["_id"] = str(updated["_id"])
    return updated

@app.delete("/api/tasks/{task_id}", status_code=204)
async def delete_task(task_id: str, auth=Depends(get_user_from_token)):
    user_id = auth["user_id"]
    res = await tasks_collection.delete_one({"_id": ObjectId(task_id), "user_id": user_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
