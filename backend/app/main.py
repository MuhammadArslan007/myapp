from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, SessionLocal
from app.db import models
from app.db.models import User
from app.core.security import get_password_hash
from app.routes import auth, portfolio, contact

app = FastAPI(title="DevOps Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")
app.include_router(contact.router, prefix="/api")


@app.on_event("startup")
def startup():
    # Create all tables
    models.Base.metadata.create_all(bind=engine)

    # Create default admin user if not exists
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == "arslan").first()
        if not existing:
            admin = User(
                username="arslan",
                hashed_password=get_password_hash("Arslan@123"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("Default admin user created: arslan / Arslan@123")
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "DevOps Portfolio API is running"}
