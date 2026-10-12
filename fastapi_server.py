"""
Orbito - Python FastAPI Backend Server
Integrated Workshop Organizer System, Role-Based Authentication,
MySQL/SQLite Database Persistence, File Uploads & Dynamic Categories.
"""

import os
import uuid
import shutil
from datetime import datetime
from typing import List, Optional
from pathlib import Path

from fastapi import (
    FastAPI, HTTPException, Depends, Query, status,
    UploadFile, File, Form
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import (
    get_db, init_db, SessionLocal,
    User, Category, Topic, Workshop, Certification, Registration
)
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, get_current_user_optional,
    require_organizer, require_admin
)

# Initialize uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="Orbito Workshop Discovery & Organizer Platform API",
    description="Backend API powering Orbito workshop discovery, organizer dashboards, admin review, and persistence",
    version="2.0.0"
)

# Enable CORS for local development and live frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded certifications and workshop cover images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ---------------------------------------------------------------------------
# Seed Data Definitions
# ---------------------------------------------------------------------------
MASTER_CATEGORIES = [
    {
        "id": "tech-ai",
        "name": "Technology and AI",
        "icon": "code",
        "color": "#4F46E5",
        "description": "Master modern software, artificial intelligence, robotics, and cloud engineering.",
        "topics": [
            {"id": 1, "name": "Python Programming for Beginners", "popular": True},
            {"id": 2, "name": "Generative AI and Prompt Engineering", "popular": True},
            {"id": 3, "name": "Machine Learning Fundamentals", "popular": True},
            {"id": 4, "name": "Web Development Bootcamp", "popular": True},
            {"id": 5, "name": "Cloud Computing and AWS Basics", "popular": False},
            {"id": 6, "name": "Cybersecurity Awareness", "popular": False},
            {"id": 7, "name": "Robotics and Arduino", "popular": False},
            {"id": 8, "name": "Data Analytics with Excel and Python", "popular": True}
        ]
    },
    {
        "id": "creativity-arts",
        "name": "Creativity and Arts",
        "icon": "palette",
        "color": "#EC4899",
        "description": "Unleash your visual, tactile, and musical expressions through hands-on creative arts.",
        "topics": [
            {"id": 9, "name": "Pottery and Clay Modelling", "popular": True},
            {"id": 10, "name": "Photography for Beginners", "popular": True},
            {"id": 11, "name": "Digital Art and Illustration", "popular": True},
            {"id": 12, "name": "Painting and Canvas Art", "popular": False},
            {"id": 13, "name": "Graphic Design with Canva", "popular": True},
            {"id": 14, "name": "Creative Writing and Storytelling", "popular": False},
            {"id": 15, "name": "Dance for Beginners", "popular": False},
            {"id": 16, "name": "Music and Guitar Basics", "popular": True}
        ]
    },
    {
        "id": "career-professional",
        "name": "Career and Professional Skills",
        "icon": "briefcase",
        "color": "#2563EB",
        "description": "Elevate your professional trajectory, leadership presence, and workplace performance.",
        "topics": [
            {"id": 17, "name": "Public Speaking and Communication", "popular": True},
            {"id": 18, "name": "Interview Skills and Mock Interviews", "popular": True},
            {"id": 19, "name": "Resume and LinkedIn Building", "popular": True},
            {"id": 20, "name": "Teamwork and Leadership", "popular": False},
            {"id": 21, "name": "English Communication Skills", "popular": False},
            {"id": 22, "name": "Time Management and Productivity", "popular": True},
            {"id": 23, "name": "Competitive Programming Basics", "popular": False},
            {"id": 24, "name": "Design Thinking and Problem-Solving", "popular": True}
        ]
    },
    {
        "id": "entrepreneurship-finance",
        "name": "Entrepreneurship and Finance",
        "icon": "trending-up",
        "color": "#059669",
        "description": "Build viable ventures, master marketing, and take control of personal wealth.",
        "topics": [
            {"id": 25, "name": "Startup Idea Validation", "popular": True},
            {"id": 26, "name": "Entrepreneurship and Pitching", "popular": True},
            {"id": 27, "name": "Personal Finance for Students", "popular": True},
            {"id": 28, "name": "Digital Marketing Fundamentals", "popular": True},
            {"id": 29, "name": "Build a Small Online Business", "popular": False},
            {"id": 30, "name": "Negotiation and Decision-Making", "popular": False}
        ]
    },
    {
        "id": "lifestyle-wellness",
        "name": "Lifestyle, Wellness and Personal Development",
        "icon": "heart",
        "color": "#E11D48",
        "description": "Nurture physical vitality, mental clarity, culinary delight, and mindful living.",
        "topics": [
            {"id": 31, "name": "Yoga for Beginners", "popular": True},
            {"id": 32, "name": "Mindfulness and Meditation", "popular": True},
            {"id": 33, "name": "Cooking for Beginners", "popular": True},
            {"id": 34, "name": "Baking and Cake Decoration", "popular": True},
            {"id": 35, "name": "Home Gardening and Plant Care", "popular": False},
            {"id": 36, "name": "DIY Crafts and Jewellery Making", "popular": False},
            {"id": 37, "name": "Personal Styling and Fashion Basics", "popular": False},
            {"id": 38, "name": "First Aid and Emergency Preparedness", "popular": True}
        ]
    },
    {
        "id": "social-outdoor",
        "name": "Social, Outdoor and Community Activities",
        "icon": "compass",
        "color": "#D97706",
        "description": "Connect with nature, bond through social challenges, and give back to society.",
        "topics": [
            {"id": 39, "name": "Nature Walk and Birdwatching", "popular": True},
            {"id": 40, "name": "Beginner Hiking and Trekking", "popular": True},
            {"id": 41, "name": "Community Volunteering", "popular": False},
            {"id": 42, "name": "Board Games and Strategy Challenges", "popular": True},
            {"id": 43, "name": "Quiz and Trivia Challenge", "popular": False},
            {"id": 44, "name": "Theatre and Improvisation", "popular": True}
        ]
    },
    {
        "id": "emerging-practical",
        "name": "Emerging Skills and Practical Life Skills",
        "icon": "tool",
        "color": "#7C3AED",
        "description": "Acquire modern technological crafts, no-code workflows, and everyday hands-on mastery.",
        "topics": [
            {"id": 45, "name": "Video Editing and Content Creation", "popular": True},
            {"id": 46, "name": "3D Modelling and Printing", "popular": True},
            {"id": 47, "name": "No-Code App Development", "popular": True},
            {"id": 48, "name": "Basic Electronics and Gadget Repair", "popular": False},
            {"id": 49, "name": "Foreign Language Discovery", "popular": False},
            {"id": 50, "name": "Everyday DIY and Repair Skills", "popular": True}
        ]
    }
]


def seed_database_defaults():
    """Seed categories, topics, default accounts, and initial workshops."""
    db = SessionLocal()
    try:
        # 1. Categories & Topics
        for cat_data in MASTER_CATEGORIES:
            cat = db.query(Category).filter(Category.id == cat_data["id"]).first()
            if not cat:
                cat = Category(
                    id=cat_data["id"],
                    name=cat_data["name"],
                    icon=cat_data.get("icon"),
                    color=cat_data.get("color"),
                    description=cat_data.get("description")
                )
                db.add(cat)
                db.flush()

            for top_data in cat_data["topics"]:
                top = db.query(Topic).filter(Topic.id == top_data["id"]).first()
                if not top:
                    top = Topic(
                        id=top_data["id"],
                        category_id=cat.id,
                        name=top_data["name"],
                        popular=top_data.get("popular", False)
                    )
                    db.add(top)

        # 2. Default Seed Users
        # Admin
        if not db.query(User).filter(User.email == "admin@orbito.com").first():
            db.add(User(
                email="admin@orbito.com",
                password_hash=hash_password("admin123"),
                full_name="Orbito Admin",
                role="admin",
                professional_title="Platform Director"
            ))

        # Default Organizer
        organizer = db.query(User).filter(User.email == "organizer@orbito.com").first()
        if not organizer:
            organizer = User(
                email="organizer@orbito.com",
                password_hash=hash_password("organizer123"),
                full_name="Dr. Elena Rostova",
                role="organizer",
                professional_title="Senior AI Researcher & Educator"
            )
            db.add(organizer)
            db.flush()

        # Default Participant
        if not db.query(User).filter(User.email == "learner@orbito.com").first():
            db.add(User(
                email="learner@orbito.com",
                password_hash=hash_password("learner123"),
                full_name="Alex Morgan",
                role="participant"
            ))

        # 3. Initial Published Workshops
        initial_workshops = [
            {
                "id": "ws-101",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Dr. Elena Rostova",
                "organizer_title": "Senior AI Researcher & Computer Science Educator",
                "organizer_email": "organizer@orbito.com",
                "title": "Python for Absolute Beginners: Build Your First Mini Projects",
                "skill_to_teach": "Python Programming",
                "category_id": "tech-ai",
                "category_name": "Technology and AI",
                "topic_id": 1,
                "topic_name": "Python Programming for Beginners",
                "description": "Python is universally recognized as the friendliest programming language for newcomers. In this intensive live session, you'll install your coding environment, understand variables, functions, and control flow, and produce three tangible mini-projects before the clock runs out.",
                "learning_outcomes": "Set up Python 3 and VS Code\nMaster variables, data types, and loops\nBuild an expense tracker and dice simulator\nDebug errors like a seasoned pro",
                "duration_value": 3.0,
                "duration_unit": "hours",
                "duration_label": "3 hours",
                "skill_level": "Beginner",
                "prerequisites": "A laptop with an internet connection. No coding background expected.",
                "pricing_type": "Free",
                "price": 0.0,
                "currency": "USD",
                "price_label": "Free",
                "format": "Online",
                "online_platform": "Zoom Interactive Lab",
                "online_meeting_link": "https://zoom.us/j/84920491823",
                "workshop_date": "2026-10-24",
                "start_time": "10:00 AM",
                "end_time": "1:00 PM EST",
                "registration_deadline": "2026-10-23",
                "max_participants": 40,
                "cover_image_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            },
            {
                "id": "ws-102",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Marcus Vance",
                "organizer_title": "AI Solutions Architect & Tech Columnist",
                "organizer_email": "marcus@orbito.io",
                "title": "Generative AI & Prompt Engineering Studio",
                "skill_to_teach": "Prompt Engineering & LLMs",
                "category_id": "tech-ai",
                "category_name": "Technology and AI",
                "topic_id": 2,
                "topic_name": "Generative AI and Prompt Engineering",
                "description": "Unlock the real capabilities of Generative AI beyond generic answers. In this masterclass, you'll learn systematic prompt design methodologies, zero-shot/few-shot techniques, output formatting hacks, and how to automate everyday knowledge work.",
                "learning_outcomes": "Master the CREATE framework for precise prompt specifications\nUse system instructions and structured schemas\nAutomate document summaries and email triage\nPrevent hallucinations with ground-truth verification",
                "duration_value": 3.5,
                "duration_unit": "hours",
                "duration_label": "3.5 hours",
                "skill_level": "Beginner",
                "prerequisites": "Curiosity and access to any modern web browser.",
                "pricing_type": "Paid",
                "price": 29.0,
                "currency": "USD",
                "price_label": "$29",
                "format": "Online",
                "online_platform": "Google Meet & Live Prompt Sandbox",
                "online_meeting_link": "https://meet.google.com/xyz-orb-ai",
                "workshop_date": "2026-10-26",
                "start_time": "2:00 PM",
                "end_time": "5:30 PM EST",
                "registration_deadline": "2026-10-25",
                "max_participants": 50,
                "cover_image_url": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            },
            {
                "id": "ws-103",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Sophia Chen",
                "organizer_title": "Ceramicist & Sculptor",
                "organizer_email": "sophia@orbito.io",
                "title": "Urban Clay & Wheel Pottery Masterclass",
                "skill_to_teach": "Ceramic Wheel Pottery",
                "category_id": "creativity-arts",
                "category_name": "Creativity and Arts",
                "topic_id": 9,
                "topic_name": "Pottery and Clay Modelling",
                "description": "Step away from screens and connect with tactile craftsmanship. This workshop introduces clay preparation, wheel centering, wall pulling, and surface carving. Includes kiln firing and glazing for two finished pieces you get to keep.",
                "learning_outcomes": "Clay wedging and moisture management\nWheel centering fundamentals and foot pedal control\nShaping cylinders, cups, and curved rim vessels\nGlazing basics and ceramic firing timelines",
                "duration_value": 4.0,
                "duration_unit": "hours",
                "duration_label": "4 hours",
                "skill_level": "Beginner",
                "prerequisites": "Wear clothes you don't mind getting clay on (aprons provided).",
                "pricing_type": "Paid",
                "price": 65.0,
                "currency": "USD",
                "price_label": "$65",
                "format": "In person",
                "venue_name": "Artisan Loft Studios",
                "venue_address": "452 Broadway, New York, NY",
                "workshop_date": "2026-10-31",
                "start_time": "11:00 AM",
                "end_time": "3:00 PM EST",
                "registration_deadline": "2026-10-29",
                "max_participants": 16,
                "cover_image_url": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            },
            {
                "id": "ws-104",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Jonathan Reyes",
                "organizer_title": "TEDx Speaker & Executive Speech Coach",
                "organizer_email": "jonathan@orbito.io",
                "title": "Executive Public Speaking & Confident Storytelling",
                "skill_to_teach": "Public Speaking & Storytelling",
                "category_id": "career-professional",
                "category_name": "Career and Professional Skills",
                "topic_id": 17,
                "topic_name": "Public Speaking and Communication",
                "description": "Whether presenting to an executive board, leading an all-hands meeting, or pitching clients, your communication determines your impact. Learn how to craft irresistible narratives, project vocal warmth, and answer difficult questions on the spot.",
                "learning_outcomes": "Tame stage fright using physiological breathing protocols\nStructure high-impact talks using the 3-Act Persuasion Arc\nVocal variety: pacing, strategic pauses, and tonal range\nExecutive posture and virtual camera presence",
                "duration_value": 2.5,
                "duration_unit": "hours",
                "duration_label": "2.5 hours",
                "skill_level": "Intermediate",
                "prerequisites": "Willingness to turn on your webcam and deliver a 60-second micro-speech.",
                "pricing_type": "Paid",
                "price": 35.0,
                "currency": "USD",
                "price_label": "$35",
                "format": "Online",
                "online_platform": "Orbito Virtual Auditorium",
                "online_meeting_link": "https://auditorium.orbito.io/session/exec-speech",
                "workshop_date": "2026-11-02",
                "start_time": "6:00 PM",
                "end_time": "8:30 PM EST",
                "registration_deadline": "2026-10-31",
                "max_participants": 30,
                "cover_image_url": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            },
            {
                "id": "ws-105",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Maya Lin",
                "organizer_title": "Certified Somatic Movement & Yoga Therapist",
                "organizer_email": "maya@orbito.io",
                "title": "Mindful Hatha Yoga & Breathwork for Stress Relief",
                "skill_to_teach": "Breathwork & Somatic Mindfulness",
                "category_id": "lifestyle-wellness",
                "category_name": "Lifestyle, Wellness and Personal Development",
                "topic_id": 31,
                "topic_name": "Yoga and Movement Therapy",
                "description": "Release chronic muscular tension, master autonomic nervous system regulation through box and 4-7-8 breathing protocols, and ground your spirit in restorative somatic movement.",
                "learning_outcomes": "Perform 12 classic asanas safely with breath synchronization\nUnderstand physiological sighing and vagus nerve reset\nEstablish a 15-minute daily restorative mobility habit\nCultivate lasting mental presence and sleep improvement",
                "duration_value": 2.0,
                "duration_unit": "hours",
                "duration_label": "2 hours",
                "skill_level": "Beginner",
                "prerequisites": "Comfortable loose clothing and a yoga mat or soft carpet.",
                "pricing_type": "Free",
                "price": 0.0,
                "currency": "USD",
                "price_label": "Free",
                "format": "Online",
                "online_platform": "Orbito Wellness Stream",
                "online_meeting_link": "https://wellness.orbito.io/live/breathwork",
                "workshop_date": "2026-10-28",
                "start_time": "7:30 AM",
                "end_time": "9:30 AM EST",
                "registration_deadline": "2026-10-27",
                "max_participants": 60,
                "cover_image_url": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            },
            {
                "id": "ws-106",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Julian Cole",
                "organizer_title": "National Geographic Explorer & Documentary Photographer",
                "organizer_email": "julian@orbito.io",
                "title": "Outdoor Street & Urban Nature Photography Walking Lab",
                "skill_to_teach": "Street & Natural Light Photography",
                "category_id": "social-outdoor",
                "category_name": "Social, Outdoor and Community Activities",
                "topic_id": 39,
                "topic_name": "Nature Walk and Birdwatching",
                "description": "Learn to see the poetry in everyday urban architecture, shadows, and flora. We explore camera angles, rule of thirds, framing with natural foliage, and storytelling on the move with fellow curious learners.",
                "learning_outcomes": "Master camera exposure triangle and smartphone manual modes\nCapture dynamic motion blur, reflections, and sun flares\nFrame striking compositions in crowded city landscapes\nEdit RAW photos on mobile using free Lightroom presets",
                "duration_value": 3.0,
                "duration_unit": "hours",
                "duration_label": "3 hours",
                "skill_level": "Beginner",
                "prerequisites": "Any smartphone or digital camera. Comfortable walking shoes.",
                "pricing_type": "Paid",
                "price": 25.0,
                "currency": "USD",
                "price_label": "$25",
                "format": "In person",
                "venue_name": "Central Park Botanical Pavilion",
                "venue_address": "East 79th St & 5th Ave, New York, NY",
                "workshop_date": "2026-11-07",
                "start_time": "9:00 AM",
                "end_time": "12:00 PM EST",
                "registration_deadline": "2026-11-05",
                "max_participants": 20,
                "cover_image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            },
            {
                "id": "ws-107",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Chloe Dupont",
                "organizer_title": "Lead Concept Artist & Children's Book Illustrator",
                "organizer_email": "chloe@orbito.io",
                "title": "Digital Illustration & Character Design Studio",
                "skill_to_teach": "Digital Illustration & Character Drawing",
                "category_id": "creativity-arts",
                "category_name": "Creativity and Arts",
                "topic_id": 11,
                "topic_name": "Digital Illustration and Procreate",
                "description": "Bring your visual ideas to life on iPad, tablet, or PC. Learn character silhouette theory, color palettes, brush texturing, and line confidence in a collaborative creative environment.",
                "learning_outcomes": "Sketch expressive character anatomy and facial gestures\nBlend digital color palettes using light source models\nMaster digital brushes and layer blending modes\nExport professional print and sticker-ready artwork",
                "duration_value": 3.0,
                "duration_unit": "hours",
                "duration_label": "3 hours",
                "skill_level": "Beginner",
                "prerequisites": "Tablet (iPad, Wacom, Galaxy Tab) or computer with drawing software.",
                "pricing_type": "Paid",
                "price": 29.0,
                "currency": "USD",
                "price_label": "$29",
                "format": "Online",
                "online_platform": "Orbito Creative Studio & Discord",
                "online_meeting_link": "https://meet.orbito.io/room/digital-art",
                "workshop_date": "2026-11-05",
                "start_time": "5:00 PM",
                "end_time": "8:00 PM EST",
                "registration_deadline": "2026-11-04",
                "max_participants": 25,
                "cover_image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            },
            {
                "id": "ws-108",
                "organizer_id": organizer.id if organizer else None,
                "organizer_name": "Tariq Al-Mansoor",
                "organizer_title": "Founder & Product Design Mentor",
                "organizer_email": "tariq@orbito.io",
                "title": "No-Code MVP App Builder: From Idea to Working Product",
                "skill_to_teach": "No-Code Web App Building",
                "category_id": "emerging-practical",
                "category_name": "Emerging Skills and Practical Life Skills",
                "topic_id": 47,
                "topic_name": "No-Code App Development",
                "description": "Build functional databases, dashboards, and automated web apps without writing a single line of backend code. Launch a working interactive tool in a single afternoon.",
                "learning_outcomes": "Design database schemas using visual no-code builders\nConnect automated triggers with Zapier and Make\nDeploy responsive mobile-friendly web applications\nLaunch and share your live MVP with real users",
                "duration_value": 3.5,
                "duration_unit": "hours",
                "duration_label": "3.5 hours",
                "skill_level": "Beginner",
                "prerequisites": "A laptop with Google Chrome. No technical background necessary.",
                "pricing_type": "Paid",
                "price": 29.0,
                "currency": "USD",
                "price_label": "$29",
                "format": "Online",
                "online_platform": "Google Meet & Live Sandbox",
                "online_meeting_link": "https://meet.google.com/nocode-builder",
                "workshop_date": "2026-11-09",
                "start_time": "1:00 PM",
                "end_time": "4:30 PM EST",
                "registration_deadline": "2026-11-08",
                "max_participants": 35,
                "cover_image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                "status": "Published"
            }
        ]

        for ws_data in initial_workshops:
            if not db.query(Workshop).filter(Workshop.id == ws_data["id"]).first():
                db.add(Workshop(**ws_data))

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


# Initialize database and seeds on module load
init_db()
seed_database_defaults()


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class SignupPayload(BaseModel):
    fullName: str
    email: str
    password: str
    accountType: str = "participant"  # "participant" or "organizer"
    professionalTitle: Optional[str] = None

class LoginPayload(BaseModel):
    email: str
    password: str

class WorkshopCreatePayload(BaseModel):
    title: str
    skillToTeach: str
    categoryId: str
    topicId: int
    description: str
    learningOutcomes: Optional[str] = None
    durationValue: float = 2.0
    durationUnit: str = "hours"
    skillLevel: str = "Beginner"
    prerequisites: Optional[str] = None
    pricingType: str = "Free"
    price: float = 0.0
    currency: str = "USD"
    format: str = "Online"
    onlinePlatform: Optional[str] = None
    onlineMeetingLink: Optional[str] = None
    venueName: Optional[str] = None
    venueAddress: Optional[str] = None
    workshopDate: str
    startTime: str
    endTime: str
    registrationDeadline: Optional[str] = None
    maxParticipants: Optional[int] = 30
    coverImageUrl: Optional[str] = None
    status: str = "Pending Review"  # "Draft" or "Pending Review"
    
    # Optional certification details submitted with form
    skillsSummary: Optional[str] = None
    certificationName: Optional[str] = None
    issuingOrganization: Optional[str] = None
    yearIssued: Optional[str] = None
    certificationFileUrl: Optional[str] = None
    certificationFileName: Optional[str] = None

class WorkshopStatusUpdatePayload(BaseModel):
    action: str  # "approve", "reject", "request_corrections"
    reason: Optional[str] = None

class AIQuizAnswerItem(BaseModel):
    questionId: str
    questionTitle: Optional[str] = None
    selectedOptions: List[str] = []
    customText: Optional[str] = None

class AIQuizStepEvaluationPayload(BaseModel):
    questionId: str
    questionTitle: Optional[str] = None
    selectedOptions: List[str] = []
    customText: Optional[str] = None

class AIQuizRecommendPayload(BaseModel):
    answers: List[AIQuizAnswerItem] = []
    preferredFormat: Optional[str] = "either"
    budget: Optional[str] = "flexible"
    skillLevel: Optional[str] = "Beginner"

class QuizPayload(BaseModel):
    interests: List[str] = []
    goals: List[str] = []
    learningStyle: Optional[str] = None
    skillLevel: Optional[str] = None
    format: Optional[str] = None
    budget: Optional[str] = None
    availability: Optional[str] = None
    answers: Optional[List[AIQuizAnswerItem]] = None

class RegistrationPayload(BaseModel):
    workshopId: str
    fullName: str
    email: str
    phone: Optional[str] = None
    learningGoal: Optional[str] = None


# ---------------------------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------------------------
@app.post("/api/auth/signup")
def signup(payload: SignupPayload, db: Session = Depends(get_db)):
    """Register new account (Workshop Participant or Workshop Organizer)."""
    email_clean = payload.email.lower().strip()
    if db.query(User).filter(User.email == email_clean).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    role = "organizer" if payload.accountType == "organizer" else "participant"

    user = User(
        email=email_clean,
        password_hash=hash_password(payload.password),
        full_name=payload.fullName.strip(),
        role=role,
        professional_title=payload.professionalTitle.strip() if payload.professionalTitle else None
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email, user.role, user.full_name)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "fullName": user.full_name,
            "email": user.email,
            "role": user.role,
            "professionalTitle": user.professional_title
        }
    }


@app.post("/api/auth/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    """Authenticate user and return role and JWT access token."""
    email_clean = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(user.id, user.email, user.role, user.full_name)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "fullName": user.full_name,
            "email": user.email,
            "role": user.role,
            "professionalTitle": user.professional_title
        }
    }


@app.get("/api/auth/me")
def get_me(user: User = Depends(get_current_user)):
    """Return authenticated user profile."""
    return {
        "id": user.id,
        "fullName": user.full_name,
        "email": user.email,
        "role": user.role,
        "professionalTitle": user.professional_title
    }


# ---------------------------------------------------------------------------
# Categories & Topics Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    """Return all 7 categories with their full topics list."""
    categories = db.query(Category).all()
    results = []
    for cat in categories:
        topics = db.query(Topic).filter(Topic.category_id == cat.id).all()
        results.append({
            "id": cat.id,
            "name": cat.name,
            "icon": cat.icon,
            "color": cat.color,
            "description": cat.description,
            "topics": [{"id": t.id, "name": t.name, "popular": t.popular} for t in topics]
        })
    return results


@app.get("/api/categories/{category_id}/topics")
def get_category_topics(category_id: str, db: Session = Depends(get_db)):
    """Return topics belonging to a specific category."""
    topics = db.query(Topic).filter(Topic.category_id == category_id).all()
    if not topics:
        raise HTTPException(status_code=404, detail="Category not found or has no topics")
    return [{"id": t.id, "name": t.name, "popular": t.popular} for t in topics]


# ---------------------------------------------------------------------------
# Public Workshop Endpoints (Only Published Workshops Returned)
# ---------------------------------------------------------------------------
@app.get("/api/workshops")
def get_public_workshops(
    category: Optional[str] = None,
    topic: Optional[str] = None,
    format: Optional[str] = None,
    level: Optional[str] = None,
    price: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "upcoming",
    db: Session = Depends(get_db)
):
    """Retrieve all approved & published workshops dynamically from database."""
    query = db.query(Workshop).filter(Workshop.status == "Published")

    if category and category != "all":
        query = query.filter(Workshop.category_id == category)

    if topic:
        query = query.filter(
            or_(
                Workshop.topic_name.ilike(f"%{topic}%"),
                Workshop.topic_id == (int(topic) if topic.isdigit() else -1)
            )
        )

    if format and format != "all":
        query = query.filter(Workshop.format.ilike(f"%{format}%"))

    if level and level != "all":
        query = query.filter(Workshop.skill_level.ilike(f"%{level}%"))

    if price and price != "all":
        if price == "free":
            query = query.filter(Workshop.price == 0)
        elif price == "paid":
            query = query.filter(Workshop.price > 0)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Workshop.title.ilike(s),
                Workshop.skill_to_teach.ilike(s),
                Workshop.description.ilike(s),
                Workshop.category_name.ilike(s),
                Workshop.topic_name.ilike(s),
                Workshop.organizer_name.ilike(s)
            )
        )

    workshops = query.all()
    
    # Sort
    if sort == "price-low":
        workshops.sort(key=lambda x: x.price)
    elif sort == "price-high":
        workshops.sort(key=lambda x: x.price, reverse=True)
    else:
        workshops.sort(key=lambda x: x.workshop_date)

    results = []
    for w in workshops:
        results.append({
            "id": w.id,
            "title": w.title,
            "skillToTeach": w.skill_to_teach,
            "categoryId": w.category_id,
            "categoryName": w.category_name,
            "topicId": w.topic_id,
            "topicName": w.topic_name,
            "format": w.format.lower(),
            "formatLabel": w.format,
            "location": w.venue_name or w.online_platform or "Online",
            "date": w.workshop_date,
            "time": f"{w.start_time} - {w.end_time}",
            "duration": w.duration_label or f"{w.duration_value} {w.duration_unit}",
            "price": w.price,
            "priceLabel": w.price_label,
            "level": w.skill_level.lower(),
            "levelLabel": w.skill_level,
            "coverImageUrl": w.cover_image_url,
            "instructor": {
                "name": w.organizer_name,
                "title": w.organizer_title or "Orbito Workshop Mentor",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
            },
            "shortDescription": (w.description[:140] + "...") if len(w.description) > 140 else w.description,
            "fullDescription": w.description,
            "learningPoints": [p.strip() for p in (w.learning_outcomes or "").split("\n") if p.strip()],
            "prerequisites": w.prerequisites,
            "seatsTotal": w.max_participants or 30,
            "seatsLeft": max(1, (w.max_participants or 30) - 5),
            "status": w.status
        })

    return results


@app.get("/api/workshops/{workshop_id}")
def get_single_workshop(
    workshop_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Retrieve detailed workshop record. Conceals private meeting link unless authorized."""
    w = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workshop not found")

    # If workshop is not published, only the owner or an admin may view it
    if w.status != "Published":
        is_owner = current_user and (current_user.id == w.organizer_id or current_user.email == w.organizer_email)
        is_admin = current_user and current_user.role == "admin"
        if not (is_owner or is_admin):
            raise HTTPException(status_code=403, detail="Workshop is currently pending review")

    is_privileged = current_user and (
        current_user.id == w.organizer_id or
        current_user.role == "admin"
    )

    return {
        "id": w.id,
        "title": w.title,
        "skillToTeach": w.skill_to_teach,
        "categoryId": w.category_id,
        "categoryName": w.category_name,
        "topicId": w.topic_id,
        "topicName": w.topic_name,
        "format": w.format.lower(),
        "formatLabel": w.format,
        "onlinePlatform": w.online_platform,
        # Only expose meeting link to privileged organizer or admin
        "onlineMeetingLink": w.online_meeting_link if is_privileged else None,
        "venueName": w.venue_name,
        "venueAddress": w.venue_address,
        "date": w.workshop_date,
        "time": f"{w.start_time} - {w.end_time}",
        "duration": w.duration_label or f"{w.duration_value} {w.duration_unit}",
        "price": w.price,
        "priceLabel": w.price_label,
        "level": w.skill_level.lower(),
        "levelLabel": w.skill_level,
        "coverImageUrl": w.cover_image_url,
        "instructor": {
            "name": w.organizer_name,
            "title": w.organizer_title or "Workshop Organizer",
            "email": w.organizer_email
        },
        "shortDescription": (w.description[:140] + "...") if len(w.description) > 140 else w.description,
        "fullDescription": w.description,
        "learningPoints": [p.strip() for p in (w.learning_outcomes or "").split("\n") if p.strip()],
        "prerequisites": w.prerequisites,
        "seatsTotal": w.max_participants or 30,
        "status": w.status,
        "adminNotes": w.admin_notes
    }


# ---------------------------------------------------------------------------
# Organizer Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/organizer/workshops")
def get_organizer_workshops(
    user: User = Depends(require_organizer),
    db: Session = Depends(get_db)
):
    """Retrieve all workshops submitted by the authenticated organizer."""
    # Match by organizer_id or organizer_email
    workshops = db.query(Workshop).filter(
        or_(
            Workshop.organizer_id == user.id,
            Workshop.organizer_email == user.email
        )
    ).order_by(Workshop.created_at.desc()).all()

    results = []
    for w in workshops:
        certs = db.query(Certification).filter(Certification.workshop_id == w.id).all()
        results.append({
            "id": w.id,
            "title": w.title,
            "skillToTeach": w.skill_to_teach,
            "categoryId": w.category_id,
            "categoryName": w.category_name,
            "topicId": w.topic_id,
            "topicName": w.topic_name,
            "format": w.format,
            "workshopDate": w.workshop_date,
            "startTime": w.start_time,
            "endTime": w.end_time,
            "price": w.price,
            "priceLabel": w.price_label,
            "status": w.status,
            "adminNotes": w.admin_notes,
            "coverImageUrl": w.cover_image_url,
            "certificationsCount": len(certs),
            "createdAt": w.created_at.isoformat() if w.created_at else None
        })
    return results


@app.post("/api/organizer/workshops")
def create_organizer_workshop(
    payload: WorkshopCreatePayload,
    user: User = Depends(require_organizer),
    db: Session = Depends(get_db)
):
    """Create a new workshop submitted by the authenticated organizer."""
    # 1. Validation: Category & Topic relationship
    category = db.query(Category).filter(Category.id == payload.categoryId).first()
    if not category:
        raise HTTPException(status_code=400, detail="Selected category does not exist.")

    topic = db.query(Topic).filter(Topic.id == payload.topicId, Topic.category_id == category.id).first()
    if not topic:
        raise HTTPException(status_code=400, detail="Selected topic does not belong to the selected category.")

    # 2. Date validation: Workshop date must not be in the past
    try:
        w_date = datetime.strptime(payload.workshopDate, "%Y-%m-%d").date()
        if w_date < datetime.utcnow().date():
            raise HTTPException(status_code=400, detail="Workshop date cannot be in the past.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid workshop date format (expected YYYY-MM-DD).")

    # 3. Pricing computation
    if payload.pricingType == "Free":
        price = 0.0
        price_label = "Free"
    else:
        price = max(0.0, float(payload.price))
        symbols = {"USD": "$", "EUR": "€", "GBP": "£", "INR": "₹"}
        sym = symbols.get(payload.currency, "$")
        price_label = f"{sym}{int(price) if price.is_integer() else price}"

    # 4. Status determination
    initial_status = "Draft" if payload.status == "Draft" else "Pending Review"

    ws_id = f"ws-{uuid.uuid4().hex[:8]}"

    workshop = Workshop(
        id=ws_id,
        organizer_id=user.id,
        organizer_name=user.full_name,
        organizer_title=user.professional_title or "Workshop Organizer",
        organizer_email=user.email,
        title=payload.title.strip(),
        skill_to_teach=payload.skillToTeach.strip(),
        category_id=category.id,
        category_name=category.name,
        topic_id=topic.id,
        topic_name=topic.name,
        description=payload.description.strip(),
        learning_outcomes=payload.learningOutcomes.strip() if payload.learningOutcomes else None,
        duration_value=payload.durationValue,
        duration_unit=payload.durationUnit,
        duration_label=f"{int(payload.durationValue) if payload.durationValue.is_integer() else payload.durationValue} {payload.durationUnit}",
        skill_level=payload.skillLevel,
        prerequisites=payload.prerequisites.strip() if payload.prerequisites else None,
        pricing_type=payload.pricingType,
        price=price,
        currency=payload.currency,
        price_label=price_label,
        format=payload.format,
        online_platform=payload.onlinePlatform.strip() if payload.onlinePlatform else None,
        online_meeting_link=payload.onlineMeetingLink.strip() if payload.onlineMeetingLink else None,
        venue_name=payload.venueName.strip() if payload.venueName else None,
        venue_address=payload.venueAddress.strip() if payload.venueAddress else None,
        workshop_date=payload.workshopDate,
        start_time=payload.startTime,
        end_time=payload.endTime,
        registration_deadline=payload.registrationDeadline,
        max_participants=payload.maxParticipants or 30,
        cover_image_url=payload.coverImageUrl,
        status=initial_status,
        admin_notes=None
    )

    db.add(workshop)
    db.flush()

    # 5. Attach optional certification details if provided
    if payload.certificationFileUrl:
        cert = Certification(
            workshop_id=ws_id,
            organizer_id=user.id,
            skills_summary=payload.skillsSummary,
            certification_name=payload.certificationName or "Skill Verification Document",
            issuing_organization=payload.issuingOrganization,
            year_issued=payload.yearIssued,
            file_url=payload.certificationFileUrl,
            file_name=payload.certificationFileName or "certification_doc",
            is_verified=False
        )
        db.add(cert)

    db.commit()
    db.refresh(workshop)

    return {
        "success": True,
        "message": "Your workshop has been submitted successfully!",
        "workshopId": workshop.id,
        "status": workshop.status
    }


@app.get("/api/organizer/workshops/{workshop_id}")
def get_organizer_single_workshop(
    workshop_id: str,
    user: User = Depends(require_organizer),
    db: Session = Depends(get_db)
):
    """Retrieve an organizer's own workshop for editing/viewing."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    if workshop.organizer_id != user.id and workshop.organizer_email != user.email and user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to view or edit this workshop")

    certs = db.query(Certification).filter(Certification.workshop_id == workshop.id).all()

    return {
        "id": workshop.id,
        "title": workshop.title,
        "skillToTeach": workshop.skill_to_teach,
        "categoryId": workshop.category_id,
        "categoryName": workshop.category_name,
        "topicId": workshop.topic_id,
        "topicName": workshop.topic_name,
        "description": workshop.description,
        "learningOutcomes": workshop.learning_outcomes,
        "durationValue": workshop.duration_value,
        "durationUnit": workshop.duration_unit,
        "skillLevel": workshop.skill_level,
        "prerequisites": workshop.prerequisites,
        "pricingType": workshop.pricing_type,
        "price": workshop.price,
        "currency": workshop.currency,
        "format": workshop.format,
        "onlinePlatform": workshop.online_platform,
        "onlineMeetingLink": workshop.online_meeting_link,
        "venueName": workshop.venue_name,
        "venueAddress": workshop.venue_address,
        "workshopDate": workshop.workshop_date,
        "startTime": workshop.start_time,
        "endTime": workshop.end_time,
        "registrationDeadline": workshop.registration_deadline,
        "maxParticipants": workshop.max_participants,
        "coverImageUrl": workshop.cover_image_url,
        "status": workshop.status,
        "adminNotes": workshop.admin_notes,
        "certifications": [
            {
                "id": c.id,
                "name": c.certification_name,
                "organization": c.issuing_organization,
                "year": c.year_issued,
                "fileUrl": c.file_url,
                "fileName": c.file_name,
                "isVerified": c.is_verified
            } for c in certs
        ]
    }


@app.put("/api/organizer/workshops/{workshop_id}")
def update_organizer_workshop(
    workshop_id: str,
    payload: WorkshopCreatePayload,
    user: User = Depends(require_organizer),
    db: Session = Depends(get_db)
):
    """Update a workshop owned by the authenticated organizer."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    if workshop.organizer_id != user.id and workshop.organizer_email != user.email and user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to modify this workshop")

    # Validate category & topic
    category = db.query(Category).filter(Category.id == payload.categoryId).first()
    if not category:
        raise HTTPException(status_code=400, detail="Selected category does not exist.")

    topic = db.query(Topic).filter(Topic.id == payload.topicId, Topic.category_id == category.id).first()
    if not topic:
        raise HTTPException(status_code=400, detail="Selected topic does not belong to the selected category.")

    # Pricing computation
    if payload.pricingType == "Free":
        price = 0.0
        price_label = "Free"
    else:
        price = max(0.0, float(payload.price))
        symbols = {"USD": "$", "EUR": "€", "GBP": "£", "INR": "₹"}
        sym = symbols.get(payload.currency, "$")
        price_label = f"{sym}{int(price) if price.is_integer() else price}"

    workshop.title = payload.title.strip()
    workshop.skill_to_teach = payload.skillToTeach.strip()
    workshop.category_id = category.id
    workshop.category_name = category.name
    workshop.topic_id = topic.id
    workshop.topic_name = topic.name
    workshop.description = payload.description.strip()
    workshop.learning_outcomes = payload.learningOutcomes.strip() if payload.learningOutcomes else None
    workshop.duration_value = payload.durationValue
    workshop.duration_unit = payload.durationUnit
    workshop.duration_label = f"{int(payload.durationValue) if payload.durationValue.is_integer() else payload.durationValue} {payload.durationUnit}"
    workshop.skill_level = payload.skillLevel
    workshop.prerequisites = payload.prerequisites.strip() if payload.prerequisites else None
    workshop.pricing_type = payload.pricingType
    workshop.price = price
    workshop.currency = payload.currency
    workshop.price_label = price_label
    workshop.format = payload.format
    workshop.online_platform = payload.onlinePlatform.strip() if payload.onlinePlatform else None
    workshop.online_meeting_link = payload.onlineMeetingLink.strip() if payload.onlineMeetingLink else None
    workshop.venue_name = payload.venueName.strip() if payload.venueName else None
    workshop.venue_address = payload.venueAddress.strip() if payload.venueAddress else None
    workshop.workshop_date = payload.workshopDate
    workshop.start_time = payload.startTime
    workshop.end_time = payload.endTime
    workshop.registration_deadline = payload.registrationDeadline
    workshop.max_participants = payload.maxParticipants or 30
    if payload.coverImageUrl:
        workshop.cover_image_url = payload.coverImageUrl

    # Re-submitting a rejected or draft workshop sets status back to Pending Review
    if payload.status == "Pending Review" or workshop.status == "Rejected":
        workshop.status = "Pending Review"
        workshop.admin_notes = None
    elif payload.status == "Draft":
        workshop.status = "Draft"

    # Attach certification if provided
    if payload.certificationFileUrl:
        cert = Certification(
            workshop_id=workshop.id,
            organizer_id=user.id,
            skills_summary=payload.skillsSummary,
            certification_name=payload.certificationName or "Skill Verification Document",
            issuing_organization=payload.issuingOrganization,
            year_issued=payload.yearIssued,
            file_url=payload.certificationFileUrl,
            file_name=payload.certificationFileName or "certification_doc",
            is_verified=False
        )
        db.add(cert)

    db.commit()
    return {
        "success": True,
        "message": "Workshop updated successfully!",
        "workshopId": workshop.id,
        "status": workshop.status
    }


@app.delete("/api/organizer/workshops/{workshop_id}")
def delete_organizer_workshop(
    workshop_id: str,
    user: User = Depends(require_organizer),
    db: Session = Depends(get_db)
):
    """Delete a draft workshop owned by current organizer."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    if workshop.organizer_id != user.id and workshop.organizer_email != user.email and user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to delete this workshop")

    db.delete(workshop)
    db.commit()
    return {"success": True, "message": "Workshop deleted successfully"}


@app.post("/api/organizer/upload")
async def upload_file(
    file: UploadFile = File(...),
    user: User = Depends(require_organizer)
):
    """Upload certification file or workshop image with mime-type and size validation."""
    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file_ext}'. Allowed formats: PDF, JPG, PNG."
        )

    # Max size: 10 MB
    MAX_FILE_SIZE = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the 10MB limit.")

    unique_filename = f"{uuid.uuid4().hex}_{file.filename.replace(' ', '_')}"
    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    file_url = f"/uploads/{unique_filename}"
    return {
        "success": True,
        "fileUrl": file_url,
        "fileName": file.filename,
        "fileSize": len(content),
        "fileType": file_ext
    }


# ---------------------------------------------------------------------------
# Admin Review & Publication Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/admin/workshops")
def get_admin_workshops(
    user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Retrieve all workshop submissions across organizers for administrator review."""
    workshops = db.query(Workshop).order_by(Workshop.created_at.desc()).all()
    results = []
    for w in workshops:
        certs = db.query(Certification).filter(Certification.workshop_id == w.id).all()
        results.append({
            "id": w.id,
            "title": w.title,
            "organizerName": w.organizer_name,
            "organizerTitle": w.organizer_title,
            "organizerEmail": w.organizer_email,
            "categoryName": w.category_name,
            "topicName": w.topic_name,
            "format": w.format,
            "date": w.workshop_date,
            "time": f"{w.start_time} - {w.end_time}",
            "price": w.price_label,
            "status": w.status,
            "adminNotes": w.admin_notes,
            "createdAt": w.created_at.isoformat() if w.created_at else None,
            "certifications": [
                {
                    "id": c.id,
                    "name": c.certification_name,
                    "organization": c.issuing_organization,
                    "year": c.year_issued,
                    "fileUrl": c.file_url,
                    "fileName": c.file_name,
                    "isVerified": c.is_verified
                } for c in certs
            ]
        })
    return results


@app.put("/api/admin/workshops/{workshop_id}/status")
def update_workshop_status(
    workshop_id: str,
    payload: WorkshopStatusUpdatePayload,
    user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin workflow action: approve & publish, reject with reason, or request corrections."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    action = payload.action.lower()
    if action == "approve":
        workshop.status = "Published"
        workshop.admin_notes = None
        # Verify certifications upon approval
        certs = db.query(Certification).filter(Certification.workshop_id == workshop.id).all()
        for c in certs:
            c.is_verified = True
    elif action == "reject":
        if not payload.reason:
            raise HTTPException(status_code=400, detail="Rejection reason is required")
        workshop.status = "Rejected"
        workshop.admin_notes = payload.reason.strip()
    elif action == "request_corrections":
        workshop.status = "Draft"
        workshop.admin_notes = payload.reason.strip() if payload.reason else "Please make necessary updates and resubmit."
    else:
        raise HTTPException(status_code=400, detail=f"Invalid action '{payload.action}'")

    db.commit()
    return {
        "success": True,
        "workshopId": workshop.id,
        "newStatus": workshop.status,
        "adminNotes": workshop.admin_notes
    }


# ---------------------------------------------------------------------------
# AI Curiosity Questions & AI Discovery Engine
# ---------------------------------------------------------------------------
AI_CURIOSITY_QUESTIONS = [
    {
        "id": "q1_weekend",
        "stepNumber": 1,
        "title": "When you have an unstructured morning with zero obligations, what naturally pulls your attention?",
        "hint": "Pick the choices that feel effortless or energizing, or type your own thoughts below.",
        "options": [
            {
                "id": "tactile_craft",
                "label": "Working with my hands",
                "desc": "Cooking, pottery, building, fixing, or organizing physical items",
                "weights": {"creativity-arts": 4, "emerging-practical": 2}
            },
            {
                "id": "digital_creation",
                "label": "Behind a screen exploring",
                "desc": "Coding, gaming, tinkering with software, digital tools, AI",
                "weights": {"tech-ai": 4, "emerging-practical": 2}
            },
            {
                "id": "nature_body",
                "label": "Being outdoors & moving",
                "desc": "Walking in nature, park strolls, sports, breathing fresh air",
                "weights": {"social-outdoor": 4, "lifestyle-wellness": 2}
            },
            {
                "id": "social_talk",
                "label": "Conversations & community",
                "desc": "Meeting people, sharing stories, discussing new ideas",
                "weights": {"career-professional": 3, "social-outdoor": 3}
            },
            {
                "id": "inner_calm",
                "label": "Unwinding & quiet focus",
                "desc": "Stretching, mindfulness, reading, calming music, journaling",
                "weights": {"lifestyle-wellness": 4}
            }
        ]
    },
    {
        "id": "q2_childhood",
        "stepNumber": 2,
        "title": "Think back to when you lost track of time. What kind of activity were you immersed in?",
        "hint": "Natural flow states hold the truest clues to our genuine, hidden interests.",
        "options": [
            {
                "id": "making_art",
                "label": "Drawing, sketching, sculpting, or coloring",
                "desc": "Creating visual compositions, admiring shapes & colors",
                "weights": {"creativity-arts": 4}
            },
            {
                "id": "puzzles_systems",
                "label": "Solving riddles, puzzles & building systems",
                "desc": "Legos, logic challenges, video game mechanics, curiosity about how things work",
                "weights": {"tech-ai": 4, "entrepreneurship-finance": 2}
            },
            {
                "id": "exploring_outside",
                "label": "Exploring neighborhoods & collecting things",
                "desc": "Observing animals, discovering hidden spots, outdoor adventures",
                "weights": {"social-outdoor": 4}
            },
            {
                "id": "acting_speaking",
                "label": "Expressing ideas & performing",
                "desc": "Putting on plays, public sharing, persuading others, storytelling",
                "weights": {"career-professional": 4}
            },
            {
                "id": "baking_sensory",
                "label": "Baking, tasting, & sensory kitchen fun",
                "desc": "Baking treats, mixing recipes, smelling fresh spices",
                "weights": {"lifestyle-wellness": 3, "creativity-arts": 2}
            }
        ]
    },
    {
        "id": "q3_tangible_outcome",
        "stepNumber": 3,
        "title": "At the end of a 3-hour learning experience, what reward would make you smile brightest?",
        "hint": "What feels most deeply satisfying to take away with you?",
        "options": [
            {
                "id": "physical_item",
                "label": "Holding a physical handcrafted object",
                "desc": "A ceramic cup, sculpted bowl, or handcrafted keepsake to display on your desk",
                "weights": {"creativity-arts": 4}
            },
            {
                "id": "digital_superpower",
                "label": "A working automated program or app",
                "desc": "A working Python script or AI workflow that solves real problems",
                "weights": {"tech-ai": 4, "emerging-practical": 2}
            },
            {
                "id": "calm_body",
                "label": "A relaxed body & crystal-clear mind",
                "desc": "Feeling tension melt away with breathwork and postural rejuvenation",
                "weights": {"lifestyle-wellness": 4}
            },
            {
                "id": "speaking_charisma",
                "label": "Confidence to speak and pitch anywhere",
                "desc": "Never fearing public speaking again and knowing how to captivate people",
                "weights": {"career-professional": 4}
            },
            {
                "id": "nature_photos",
                "label": "A gallery of stunning outdoor photography",
                "desc": "Visual memories capturing light, nature, and community perspective",
                "weights": {"social-outdoor": 4, "creativity-arts": 2}
            }
        ]
    },
    {
        "id": "q4_vibe",
        "stepNumber": 4,
        "title": "What setting and social vibe gives you the greatest learning energy?",
        "hint": "There are no wrong answers — this helps Orbito match your learning temperament.",
        "options": [
            {
                "id": "hands_on_cozy",
                "label": "Warm, hands-on studio with tactile materials",
                "desc": "Getting hands messy with clay, aprons, tools, and a friendly cohort",
                "weights": {"creativity-arts": 3, "lifestyle-wellness": 1}
            },
            {
                "id": "interactive_lab",
                "label": "Live virtual interactive lab with screen sharing",
                "desc": "Comfort of your desk with live instructor guidance and shared code sandbox",
                "weights": {"tech-ai": 3, "emerging-practical": 2}
            },
            {
                "id": "outdoor_walk",
                "label": "Fresh air outdoor expedition",
                "desc": "Moving together through green parks or urban architectural streets",
                "weights": {"social-outdoor": 4}
            },
            {
                "id": "supportive_cohort",
                "label": "Supportive small group sharing presentations",
                "desc": "Safe space to practice voice, body language, and constructive feedback",
                "weights": {"career-professional": 3}
            }
        ]
    },
    {
        "id": "q5_superpower",
        "stepNumber": 5,
        "title": "If you could wake up tomorrow with one brand new skill, which would you pick?",
        "hint": "Your intuitive impulse reveals what your brain is most eager to master right now.",
        "options": [
            {
                "id": "ai_coding",
                "label": "Building smart AI tools & writing code effortlessly",
                "desc": "Turning ideas into running software in minutes",
                "weights": {"tech-ai": 4}
            },
            {
                "id": "ceramic_craft",
                "label": "Mastering wheel pottery & sculpting with clay",
                "desc": "Translating pure imagination into tangible ceramic art",
                "weights": {"creativity-arts": 4}
            },
            {
                "id": "charismatic_speech",
                "label": "Commanding any room with magnetic storytelling",
                "desc": "Inspiring audiences, nailing pitches, and speaking with zero anxiety",
                "weights": {"career-professional": 4}
            },
            {
                "id": "inner_zen",
                "label": "Deep nervous system mastery, breath control & vitality",
                "desc": "Turning stress off on command and maintaining calm energy all day",
                "weights": {"lifestyle-wellness": 4}
            },
            {
                "id": "visual_lens",
                "label": "Eye of an artist: capturing breathtaking street & nature photography",
                "desc": "Seeing hidden beauty everywhere through light and composition",
                "weights": {"social-outdoor": 4, "creativity-arts": 2}
            },
            {
                "id": "nocode_apps",
                "label": "Building real web apps without code",
                "desc": "Launching functional interactive digital products overnight",
                "weights": {"emerging-practical": 4}
            }
        ]
    }
]


def generate_ai_micro_reflection(question_id: str, selected_options: List[str], custom_text: Optional[str]) -> str:
    """Generate empathetic, intelligent micro-reflection acknowledging user's quiz answer."""
    options_str = " ".join(selected_options).lower()
    custom_lower = (custom_text or "").lower()
    combined = options_str + " " + custom_lower

    if "tactile" in combined or "hands" in combined or "ceramic" in combined or "pottery" in combined or "clay" in combined:
        return "Fascinating choice! A strong tactile pull is a classic marker of tangible craftsmanship. Stepping away from digital screens to shape physical materials will deeply refresh your mental state."
    elif "digital" in combined or "code" in combined or "ai" in combined or "puzzles" in combined or "programming" in combined:
        return "Great instinct! Your curiosity leans toward digital architecture and leverage. Learning Python or Generative AI gives you immediate creative power to build automated solutions."
    elif "nature" in combined or "outdoor" in combined or "walk" in combined or "photo" in combined:
        return "Inspiring signal! You recharge through open horizons, natural light, and physical movement. Outdoor labs combining exploration with photography will be a natural match."
    elif "speaking" in combined or "speech" in combined or "social" in combined or "story" in combined:
        return "Powerful revelation! Developing vocal confidence and storytelling structure unlocks tremendous personal magnetism and professional influence."
    elif "calm" in combined or "zen" in combined or "breath" in combined or "yoga" in combined or "wellness" in combined:
        return "Deeply insightful! In our hyper-stimulated world, cultivating nervous system regulation and restorative mindfulness provides the vital foundation for all learning."
    elif "nocode" in combined or "app" in combined or "tool" in combined or "build" in combined:
        return "Exciting ambition! Rapid prototyping with modern no-code workflows allows you to turn concepts into functional products in a single afternoon."
    elif custom_text:
        return f"Thank you for sharing that nuance ('{custom_text[:40]}...'). Our AI engine incorporates this custom context to refine your personal archetype."
    else:
        return "Noted! Your answer adds key coordinates to your emerging curiosity map."


def execute_ai_matching(
    answers: List[AIQuizAnswerItem],
    preferred_format: str,
    budget: str,
    skill_level: str,
    db: Session
):
    """Deep AI matching algorithm synthesizing learner archetype and scoring workshops."""
    category_scores = {
        "creativity-arts": 0,
        "tech-ai": 0,
        "lifestyle-wellness": 0,
        "social-outdoor": 0,
        "career-professional": 0,
        "emerging-practical": 0,
        "entrepreneurship-finance": 0
    }

    keywords_detected = []

    # 1. Accumulate weights from answers
    for ans in answers:
        for opt_id in ans.selectedOptions:
            # Match option in questions database
            for q in AI_CURIOSITY_QUESTIONS:
                for opt in q["options"]:
                    if opt["id"] == opt_id:
                        for cat, weight in opt.get("weights", {}).items():
                            category_scores[cat] = category_scores.get(cat, 0) + weight

        if ans.customText:
            txt = ans.customText.lower()
            if any(w in txt for w in ["clay", "paint", "art", "draw", "pottery", "craft", "wood"]):
                category_scores["creativity-arts"] += 3
                keywords_detected.append("hands-on art")
            if any(w in txt for w in ["code", "python", "ai", "software", "tech", "data"]):
                category_scores["tech-ai"] += 3
                keywords_detected.append("software & AI")
            if any(w in txt for w in ["yoga", "stretch", "breath", "meditation", "relax", "cook", "bake"]):
                category_scores["lifestyle-wellness"] += 3
                keywords_detected.append("mindful living")
            if any(w in txt for w in ["nature", "walk", "hike", "photo", "birds", "outside"]):
                category_scores["social-outdoor"] += 3
                keywords_detected.append("nature exploration")
            if any(w in txt for w in ["speak", "lead", "pitch", "career", "people", "talk"]):
                category_scores["career-professional"] += 3
                keywords_detected.append("vocal communication")

    # Determine highest categories
    sorted_cats = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
    top_cat_id = sorted_cats[0][0] if sorted_cats and sorted_cats[0][1] > 0 else "creativity-arts"
    second_cat_id = sorted_cats[1][0] if len(sorted_cats) > 1 and sorted_cats[1][1] > 0 else "lifestyle-wellness"

    # Map archetype
    archetype_map = {
        "creativity-arts": {
            "name": "The Tactile Artisan & Visual Creator",
            "tagline": "Thrives in sensory flow states, hands-on crafting, and bringing visual imagination to physical reality."
        },
        "tech-ai": {
            "name": "The Curious Systems Builder & AI Pioneer",
            "tagline": "Driven by logic, puzzle-solving, scalable automation, and crafting intelligent digital tools."
        },
        "lifestyle-wellness": {
            "name": "The Mindful Vitality & Restorative Explorer",
            "tagline": "Seeks balance, somatic mindfulness, stress relief, and holistic mind-body vitality."
        },
        "social-outdoor": {
            "name": "The Naturalist & Community Chronicler",
            "tagline": "Recharged by open air, nature immersion, urban exploration, and visual storytelling."
        },
        "career-professional": {
            "name": "The Expressive Leader & Persuasive Storyteller",
            "tagline": "Passionate about human connection, vocal magnetism, confident presentation, and inspiring cohorts."
        },
        "emerging-practical": {
            "name": "The Applied Builder & Modern Craftsman",
            "tagline": "Focused on tangible, high-leverage practical skills and no-code rapid prototyping."
        },
        "entrepreneurship-finance": {
            "name": "The Strategic Venture Architect",
            "tagline": "Intrigued by business models, resource allocation, and turning concepts into sustainable ventures."
        }
    }

    archetype_info = archetype_map.get(top_cat_id, {
        "name": "The Versatile Polymath & Curious Explorer",
        "tagline": "Fascinated by multiple disciplines across crafts, technology, and mindful personal growth."
    })

    # Retrieve published workshops
    workshops = db.query(Workshop).filter(Workshop.status == "Published").all()
    scored = []

    cat_name_lookup = {c["id"]: c["name"] for c in MASTER_CATEGORIES}

    for idx, w in enumerate(workshops):
        base_score = 65
        rationales = []

        cat_weight = category_scores.get(w.category_id, 0)
        if w.category_id == top_cat_id:
            base_score += 26 + (cat_weight * 2)
            rationales.append(f"Direct match for your primary archetype in {w.category_name}")
        elif w.category_id == second_cat_id:
            base_score += 18 + cat_weight
            rationales.append(f"Aligns with your secondary affinity for {w.category_name}")
        elif cat_weight > 0:
            base_score += 10 + cat_weight
            rationales.append(f"Engages your latent interest in {w.category_name}")

        # Format match
        p_format = (preferred_format or "either").lower()
        if p_format == "either" or p_format in w.format.lower():
            base_score += 4

        # Budget match
        p_budget = (budget or "flexible").lower()
        if "free" in p_budget and w.price == 0:
            base_score += 5
            rationales.append("Free registration matching your budget preference")

        # Cap score between 72 and 99
        final_score = min(99, max(72, base_score - (idx * 2)))

        # Specific AI rationale
        if not rationales:
            rationales.append(f"Highly-rated introductory experience designed for newcomers in {w.category_name}")

        scored.append({
            "id": w.id,
            "title": w.title,
            "categoryId": w.category_id,
            "categoryName": w.category_name,
            "topicId": w.topic_id,
            "topicName": w.topic_name,
            "format": w.format.lower(),
            "formatLabel": w.format,
            "date": w.workshop_date,
            "time": f"{w.start_time} - {w.end_time}",
            "price": w.price,
            "priceLabel": w.price_label,
            "levelLabel": w.skill_level,
            "coverImageUrl": w.cover_image_url,
            "shortDescription": (w.description[:145] + "...") if len(w.description) > 145 else w.description,
            "instructor": {
                "name": w.organizer_name,
                "title": w.organizer_title or "Mentor"
            },
            "matchScore": final_score,
            "matchRationale": ". ".join(rationales[:2]) + "."
        })

    scored.sort(key=lambda x: x["matchScore"], reverse=True)

    summary_text = (
        f"Our AI Curiosity Engine identified your profile as '{archetype_info['name']}'. "
        f"Your responses reveal strong latent inclination toward {cat_name_lookup.get(top_cat_id, 'creative topics')}. "
        f"{archetype_info['tagline']}"
    )

    return {
        "archetype": archetype_info["name"],
        "archetypeTagline": archetype_info["tagline"],
        "primaryCategoryId": top_cat_id,
        "primaryCategoryName": cat_name_lookup.get(top_cat_id, "Featured"),
        "userProfileSummary": summary_text,
        "recommendations": scored[:6]
    }


# ---------------------------------------------------------------------------
# AI Quiz Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/ai/quiz/questions")
def get_ai_quiz_questions():
    """Retrieve adaptive curiosity questions designed for users exploring latent interests."""
    return {
        "title": "Orbito AI Curiosity Engine",
        "subtitle": "Discover your latent passions through adaptive curiosity questions",
        "totalQuestions": len(AI_CURIOSITY_QUESTIONS),
        "questions": AI_CURIOSITY_QUESTIONS
    }


@app.post("/api/ai/quiz/evaluate-step")
def evaluate_ai_quiz_step(payload: AIQuizStepEvaluationPayload):
    """Provide real-time empathetic AI micro-reflection for a single quiz step."""
    reflection = generate_ai_micro_reflection(
        payload.questionId,
        payload.selectedOptions,
        payload.customText
    )
    return {
        "questionId": payload.questionId,
        "aiFeedback": reflection
    }


@app.post("/api/ai/quiz/recommend")
def get_ai_quiz_recommendations(payload: AIQuizRecommendPayload, db: Session = Depends(get_db)):
    """Deep AI recommendation endpoint processing comprehensive quiz answers."""
    return execute_ai_matching(
        answers=payload.answers,
        preferred_format=payload.preferredFormat or "either",
        budget=payload.budget or "flexible",
        skill_level=payload.skillLevel or "Beginner",
        db=db
    )


# ---------------------------------------------------------------------------
# Quiz Recommendations & Registrations
# ---------------------------------------------------------------------------
@app.post("/api/recommendations")
def get_recommendations(payload: QuizPayload, db: Session = Depends(get_db)):
    """Compute personalized workshop recommendations from published database workshops.
    Supports both traditional category selection and AI curiosity answers."""
    # If client submitted AI curiosity answers, delegate to AI matching engine
    if payload.answers:
        return execute_ai_matching(
            answers=payload.answers,
            preferred_format=payload.format or "either",
            budget=payload.budget or "flexible",
            skill_level=payload.skillLevel or "Beginner",
            db=db
        )

    workshops = db.query(Workshop).filter(Workshop.status == "Published").all()
    scored = []
    interests = [i.lower() for i in payload.interests]

    for w in workshops:
        score = 50
        rationales = []

        # Category match
        if any(cat in w.category_id.lower() or cat in w.category_name.lower() for cat in interests):
            score += 25
            rationales.append(f"Directly matches your interest in {w.category_name}")

        # Format match
        pref_format = (payload.format or "either").lower()
        if pref_format == "either":
            score += 10
        elif pref_format in w.format.lower():
            score += 15
            rationales.append(f"Offered in your preferred {w.format} format")

        # Level match
        pref_level = (payload.skillLevel or "").lower()
        if pref_level and (pref_level in w.skill_level.lower() or ("beginner" in pref_level and w.skill_level == "Beginner")):
            score += 15
            rationales.append(f"Tailored for your current level ({w.skill_level})")

        # Budget match
        pref_budget = (payload.budget or "").lower()
        if "free" in pref_budget and w.price == 0:
            score += 15
            rationales.append("Free of cost, matching your budget preference")
        elif "low-cost" in pref_budget and w.price <= 35:
            score += 12
            rationales.append(f"Affordable access at {w.price_label}")

        final_score = min(99, max(65, score))
        if not rationales:
            rationales.append(f"High-rated hands-on workshop in {w.category_name}")

        scored.append({
            "id": w.id,
            "title": w.title,
            "categoryId": w.category_id,
            "categoryName": w.category_name,
            "topicId": w.topic_id,
            "topicName": w.topic_name,
            "format": w.format.lower(),
            "formatLabel": w.format,
            "date": w.workshop_date,
            "time": f"{w.start_time} - {w.end_time}",
            "price": w.price,
            "priceLabel": w.price_label,
            "levelLabel": w.skill_level,
            "coverImageUrl": w.cover_image_url,
            "shortDescription": (w.description[:140] + "...") if len(w.description) > 140 else w.description,
            "instructor": {
                "name": w.organizer_name,
                "title": w.organizer_title or "Mentor"
            },
            "matchScore": final_score,
            "matchRationale": ". ".join(rationales[:2]) + "."
        })

    scored.sort(key=lambda x: x["matchScore"], reverse=True)
    summary = f"Analyzed your profile with emphasis on {', '.join(payload.interests) or 'diverse topics'}."

    return {
        "recommendations": scored[:6],
        "userProfileSummary": summary
    }


@app.post("/api/registrations")
def create_registration(payload: RegistrationPayload, db: Session = Depends(get_db)):
    """Register for a workshop and return confirmation code."""
    workshop = db.query(Workshop).filter(Workshop.id == payload.workshopId, Workshop.status == "Published").first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Published workshop not found")

    reg_id = f"ORB-{uuid.uuid4().hex[:6].upper()}"
    reg = Registration(
        registration_id=reg_id,
        workshop_id=workshop.id,
        full_name=payload.fullName.strip(),
        email=payload.email.lower().strip(),
        phone=payload.phone.strip() if payload.phone else None,
        learning_goal=payload.learningGoal.strip() if payload.learningGoal else None,
        status="Confirmed"
    )
    db.add(reg)
    db.commit()

    return {
        "registrationId": reg.registration_id,
        "workshopId": workshop.id,
        "workshopTitle": workshop.title,
        "fullName": reg.full_name,
        "email": reg.email,
        "status": reg.status,
        "meetingAccess": workshop.online_meeting_link if workshop.format.lower() != "in person" else None,
        "venueLocation": f"{workshop.venue_name}, {workshop.venue_address}" if workshop.venue_name else None
    }
