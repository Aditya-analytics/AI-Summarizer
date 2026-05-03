from typing import Optional
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, UniqueConstraint, DateTime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[str] = mapped_column()

    # Nova Gauntlet Fields
    gauntlet_api_key: Mapped[Optional[str]] = mapped_column(nullable=True) # Encrypted
    gauntlet_engine_model: Mapped[str] = mapped_column(default="models/gemini-2.5-flash-lite")
    gauntlet_embeddings_model: Mapped[str] = mapped_column(default="models/gemini-embedding-2-preview")
    free_calls_remaining: Mapped[int] = mapped_column(default=10)

    documents: Mapped[list["Document"]] = relationship(
        back_populates="user", 
        lazy="selectin",
        cascade="all, delete-orphan"
    )

class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column() # User-defined or fallback name
    type: Mapped[str]
    source: Mapped[str] = mapped_column() # The "Passport"
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user: Mapped["User"] = relationship(back_populates="documents")
    
    # 1. THE STORAGE LOCKER (Notice: NO lazy="selectin" here)
    # This keeps the "boulder" out of your dashboard queries!
    content_blob: Mapped["DocumentContent"] = relationship(
        back_populates="document", 
        uselist=False,
        cascade="all, delete-orphan"
    )

    output: Mapped[list["Output"]] = relationship(
        back_populates="document", 
        lazy="selectin",
        cascade="all, delete-orphan"
    )
    qa_history: Mapped[list["QAHistory"]] = relationship(
        back_populates="document", 
        lazy="selectin",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("user_id", "source", name="uq_user_source"),
    )

class DocumentContent(Base):
    __tablename__ = "document_contents"
    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"))
    
    # 2. THE BOULDER (The heavy text lives here)
    raw_text: Mapped[Optional[str]] = mapped_column(nullable=True)

    document: Mapped["Document"] = relationship(back_populates="content_blob")

class Output(Base):
    __tablename__ = "outputs" 
    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"))
    summary: Mapped[Optional[str]] = mapped_column(nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(nullable=True)
    quiz: Mapped[Optional[str]]  = mapped_column(nullable=True)
    style: Mapped[str] = mapped_column(nullable=False)
    difficulty: Mapped[Optional[str]] = mapped_column(nullable=True)
    language: Mapped[str] = mapped_column(nullable=False)

   
    document: Mapped["Document"] = relationship(back_populates="output")

class QAHistory(Base):
    __tablename__ = "qa_history" 
    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"))
    question: Mapped[str]
    answer: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    
    document: Mapped["Document"] = relationship(back_populates="qa_history")
