from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ContactMessage
from app.models.user import ContactMessageSchema
from app.routes.auth import get_current_user

router = APIRouter(tags=["Contact"])


@router.post("/contact", status_code=status.HTTP_201_CREATED)
def send_contact(data: ContactMessageSchema, db: Session = Depends(get_db)):
    if len(data.message.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message must be at least 10 characters"
        )
    msg = ContactMessage(
        name=data.name,
        email=data.email,
        subject=data.subject or "General Inquiry",
        message=data.message
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"success": True, "id": msg.id, "msg": f"Thanks {data.name}, your message has been received!"}


@router.get("/contact/messages")
def get_messages(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "subject": m.subject,
            "message": m.message,
            "created_at": m.created_at
        }
        for m in messages
    ]
