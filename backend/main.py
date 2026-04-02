from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import create_db_and_tables
from backend.routes.notes import router as notes_router
from backend.routes.auth import router as auth_router
from backend.routes.share import router as sharing_router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Note Sharing API",
    description="API for creating and sharing notes with JWT authentication",
    version="1.0.0"
)


origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_start():
    create_db_and_tables()
    
    
@app.get("/")
def read_root():
    return {
        "message": "Note Sharing API",
        "docs": "/docs",
        "version": "1.0.0"
    }



app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(notes_router, prefix="/api", tags=["notes"])
app.include_router(sharing_router, prefix="/api", tags=["sharing"])