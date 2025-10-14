from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
import secrets
from backend.database import get_session
from backend.models import Note, User
from backend.schemas import ShareLinkResponse, SharedNoteResponse, NoteResponse
from backend.auth.security import get_current_user

router = APIRouter()


@router.post("/notes/{note_id}/share", response_model=ShareLinkResponse)
def generate_share_link(
    note_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Generate a shareable link for a note (authenticated users only)
    Only the note owner can generate share links
    """
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Check ownership - only owner can generate share links
    if note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the note owner can generate share links"
        )
    
    # Generate unique token if not exists
    if not note.share_token:
        note.share_token = secrets.token_urlsafe(16)
        session.add(note)
        session.commit()
        session.refresh(note)
    
    # Build share URL (adjust to your frontend URL)
    base_url = "http://localhost:3000"  # Change to your frontend URL
    share_url = f"{base_url}/shared/{note.share_token}"
    
    return ShareLinkResponse(
        share_token=note.share_token,
        share_url=share_url,
        note_id=note.id
    )


@router.get("/shared/{share_token}", response_model=SharedNoteResponse)
def get_shared_note(
    share_token: str,
    session: Session = Depends(get_session)
):
    """
    Access a note via share token (PUBLIC - no auth required)
    Anyone with the link can view the note
    """
    statement = select(Note).where(Note.share_token == share_token)
    note = session.exec(statement).first()
    
    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found or share link is invalid"
        )
    
    return SharedNoteResponse(
        id=note.id,
        title=note.title,
        content=note.content,
        created_at=note.created_at,
        updated_at=note.updated_at
    )


@router.delete("/notes/{note_id}/share")
def revoke_share_link(
    note_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Revoke/delete the shareable link (authenticated users only)
    Only the note owner can revoke share links
    """
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Check ownership
    if note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the note owner can revoke share links"
        )
    
    if not note.share_token:
        raise HTTPException(
            status_code=400,
            detail="This note doesn't have an active share link"
        )
    
    # Remove the share token
    note.share_token = None
    session.add(note)
    session.commit()
    
    return {"ok": True, "message": "Share link revoked successfully"}


@router.get("/notes/{note_id}/share-info", response_model=ShareLinkResponse)
def get_share_info(
    note_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get existing share link info for a note (authenticated users only)
    Returns 404 if no share link exists
    """
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Check ownership
    if note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the note owner can view share link info"
        )
    
    if not note.share_token:
        raise HTTPException(
            status_code=404,
            detail="This note doesn't have an active share link"
        )
    
    # Build share URL
    base_url = "http://localhost:3000"
    share_url = f"{base_url}/shared/{note.share_token}"
    
    return ShareLinkResponse(
        share_token=note.share_token,
        share_url=share_url,
        note_id=note.id
    )