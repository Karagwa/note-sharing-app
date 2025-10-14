from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import create_db_and_tables
from backend.routes.notes import router as notes_router
from backend.routes.auth import router as auth_router
from backend.routes.share import router as sharing_router

app = FastAPI(
    title="Note Sharing API",
    description="API for creating and sharing notes with JWT authentication",
    version="1.0.0"
)

# CORS Configuration - MUST be before route includes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including OPTIONS
    allow_headers=["*"],  # Allows all headers
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


# Include routers AFTER CORS middleware
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(notes_router, prefix="/api", tags=["notes"])
app.include_router(sharing_router, prefix="/api", tags=["sharing"])