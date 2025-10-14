from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, or_, col
from typing import List, Optional
from datetime import datetime
from backend.database import get_session
from backend.models import Note, User
from backend.schemas import NoteCreate, NoteUpdate, NoteResponse
from backend.auth.security import get_current_user

router = APIRouter()


@router.get("/notes/search", response_model=List[NoteResponse])
def search_notes(
    q: str = Query(..., min_length=1, description="Search query"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Search notes by title or content
    Case-insensitive search across title and content fields
    """
    
    search_pattern = f"%{q}%"
    
    
    statement = select(Note).where(
        Note.owner_id == current_user.id,
        or_(
            col(Note.title).ilike(search_pattern),
            col(Note.content).ilike(search_pattern)
        )
    )
    
    notes = session.exec(statement).all()
    return notes


@router.get("/notes", response_model=List[NoteResponse])
def read_notes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get all notes owned by the current user"""
    statement = select(Note).where(Note.owner_id == current_user.id)
    notes = session.exec(statement).all()
    return notes


@router.get("/notes/{note_id}", response_model=NoteResponse)
def read_note(
    note_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get a specific note by ID (must be owner)"""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    
    if note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Not authorized to access this note"
        )
    
    return note


@router.post("/notes", response_model=NoteResponse, status_code=201)
def create_note(
    note_data: NoteCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new note (authenticated users only)"""
    note = Note(
        title=note_data.title,
        content=note_data.content,
        is_public=note_data.is_public,
        owner_id=current_user.id,  
        created_at=datetime.utcnow()
    )
    
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int, 
    note_data: NoteCreate,  
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Completely replace a note (must be owner)"""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    
    if note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Not authorized to edit this note"
        )
    
    
    note.title = note_data.title
    note.content = note_data.content
    note.is_public = note_data.is_public
    note.updated_at = datetime.utcnow()
    
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.patch("/notes/{note_id}", response_model=NoteResponse)
def patch_note(
    note_id: int, 
    note_data: NoteUpdate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Partially update a note - only updates fields you provide"""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    
    if note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Not authorized to edit this note"
        )
    
    
    update_data = note_data.model_dump(exclude_unset=True)
    
    if update_data:
        for key, value in update_data.items():
            setattr(note, key, value)
        
        note.updated_at = datetime.utcnow()
        
        session.add(note)
        session.commit()
        session.refresh(note)
    
    return note


@router.delete("/notes/{note_id}")
def delete_note(
    note_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Delete a note (must be owner)"""
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    
    if note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Not authorized to delete this note"
        )
    
    session.delete(note)
    session.commit()
    return {"ok": True, "message": "Note deleted successfully"}