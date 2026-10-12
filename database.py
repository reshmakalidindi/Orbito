"""
Orbito - Database Configuration & SQLAlchemy Models
Supports MySQL (default/production) and SQLite (automatic fallback/development).
"""

import os
import logging
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, Float, Boolean,
    DateTime, ForeignKey
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

logger = logging.getLogger("orbito.database")

# Configuration
# Default to MySQL, with environment variable override
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "orbito")

DEFAULT_MYSQL_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_MYSQL_URL)

SQLITE_FALLBACK_URL = "sqlite:///./orbito.db"

# Try connecting to primary DATABASE_URL; fallback to SQLite if connection fails
engine = None
try:
    if DATABASE_URL.startswith("mysql"):
        logger.info(f"Attempting connection to MySQL: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}")
        # Test engine with a short timeout to prevent blocking if MySQL is not running
        test_engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 2}
        )
        with test_engine.connect() as conn:
            pass
        engine = test_engine
        logger.info("Successfully connected to MySQL database!")
    else:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
except Exception as e:
    logger.warning(f"MySQL connection unavailable ({e}). Falling back to SQLite ({SQLITE_FALLBACK_URL}).")
    engine = create_engine(SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ---------------------------------------------------------------------------
# Database Models
# ---------------------------------------------------------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="participant")  # participant, organizer, admin
    professional_title = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    workshops = relationship("Workshop", back_populates="organizer", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="organizer", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(100), primary_key=True)  # e.g. "tech-ai"
    name = Column(String(255), nullable=False)
    icon = Column(String(50), nullable=True)
    color = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)

    topics = relationship("Topic", back_populates="category", cascade="all, delete-orphan")
    workshops = relationship("Workshop", back_populates="category")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(String(100), ForeignKey("categories.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    popular = Column(Boolean, default=False)

    category = relationship("Category", back_populates="topics")
    workshops = relationship("Workshop", back_populates="topic")


class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(String(100), primary_key=True)  # e.g. "ws-101" or uuid
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    organizer_name = Column(String(255), nullable=False)
    organizer_title = Column(String(255), nullable=True)
    organizer_email = Column(String(255), nullable=False)
    
    title = Column(String(255), nullable=False)
    skill_to_teach = Column(String(255), nullable=False)
    
    category_id = Column(String(100), ForeignKey("categories.id"), nullable=False, index=True)
    category_name = Column(String(255), nullable=False)
    
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False, index=True)
    topic_name = Column(String(255), nullable=False)
    
    description = Column(Text, nullable=False)
    learning_outcomes = Column(Text, nullable=True)  # JSON string or newline-separated
    
    duration_value = Column(Float, nullable=False, default=2.0)
    duration_unit = Column(String(50), nullable=False, default="hours")  # hours, days, weeks
    duration_label = Column(String(100), nullable=True)
    
    skill_level = Column(String(50), nullable=False, default="Beginner")  # Beginner, Intermediate, Advanced
    prerequisites = Column(Text, nullable=True)
    
    pricing_type = Column(String(20), nullable=False, default="Free")  # Free, Paid
    price = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), nullable=False, default="USD")
    price_label = Column(String(50), nullable=False, default="Free")
    
    format = Column(String(50), nullable=False, default="Online")  # Online, In person, Hybrid
    online_platform = Column(String(100), nullable=True)
    online_meeting_link = Column(String(500), nullable=True)  # Private, not exposed publicly
    venue_name = Column(String(255), nullable=True)
    venue_address = Column(Text, nullable=True)
    
    workshop_date = Column(String(50), nullable=False)
    start_time = Column(String(50), nullable=False)
    end_time = Column(String(50), nullable=False)
    registration_deadline = Column(String(50), nullable=True)
    max_participants = Column(Integer, nullable=True, default=30)
    
    cover_image_url = Column(String(500), nullable=True)
    
    # Review Workflow: Draft, Pending Review, Published, Rejected
    status = Column(String(50), nullable=False, default="Pending Review", index=True)
    admin_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organizer = relationship("User", back_populates="workshops")
    category = relationship("Category", back_populates="workshops")
    topic = relationship("Topic", back_populates="workshops")
    certifications = relationship("Certification", back_populates="workshop", cascade="all, delete-orphan")
    registrations = relationship("Registration", back_populates="workshop", cascade="all, delete-orphan")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    workshop_id = Column(String(100), ForeignKey("workshops.id"), nullable=True, index=True)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    skills_summary = Column(Text, nullable=True)
    certification_name = Column(String(255), nullable=True)
    issuing_organization = Column(String(255), nullable=True)
    year_issued = Column(String(50), nullable=True)
    
    file_url = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=True)
    file_type = Column(String(50), nullable=True)
    
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    workshop = relationship("Workshop", back_populates="certifications")
    organizer = relationship("User", back_populates="certifications")


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    registration_id = Column(String(100), unique=True, index=True, nullable=False)
    workshop_id = Column(String(100), ForeignKey("workshops.id"), nullable=False, index=True)
    
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(100), nullable=True)
    learning_goal = Column(Text, nullable=True)
    status = Column(String(50), default="Confirmed")
    registered_at = Column(DateTime, default=datetime.utcnow)

    workshop = relationship("Workshop", back_populates="registrations")


def get_db():
    """FastAPI database dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create tables if they don't exist."""
    Base.metadata.create_all(bind=engine)
