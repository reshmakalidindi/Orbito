"""
Orbito - Python FastAPI Backend Reference Implementation
Provides full endpoints for workshop categories, search/filters,
recommendation matching algorithm, and registration logging.

Run with:
    pip install fastapi uvicorn
    uvicorn fastapi_server:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(
    title="Orbito Workshop Discovery API",
    description="Backend API powering the Orbito Workshop Discovery Platform",
    version="1.0.0"
)

# Enable CORS for local frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Master Data: 7 Categories & 50 Topics
# ---------------------------------------------------------------------------
CATEGORIES = [
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

WORKSHOPS = [
    {
        "id": "ws-101",
        "title": "Python for Absolute Beginners: Build Your First Mini Projects",
        "categoryId": "tech-ai",
        "categoryName": "Technology and AI",
        "topicId": 1,
        "topicName": "Python Programming for Beginners",
        "format": "online",
        "location": "Zoom Interactive Lab (Live Link Sent Upon Registration)",
        "date": "2026-10-24",
        "time": "10:00 AM - 1:00 PM EST",
        "duration": "3 hours",
        "price": 0,
        "priceLabel": "Free",
        "level": "beginner",
        "levelLabel": "Beginner",
        "featured": True,
        "seatsTotal": 40,
        "seatsLeft": 8,
        "registrationDeadline": "2026-10-23",
        "rating": 4.9,
        "reviewsCount": 124,
        "instructor": {
            "name": "Dr. Elena Rostova",
            "title": "Senior AI Researcher & Computer Science Educator",
            "bio": "12+ years of software engineering and academic mentorship. Passionate about making computing intuitive for non-programmers.",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
        },
        "shortDescription": "Write your first Python scripts from scratch without overwhelming jargon. Build a calculator, word counter, and interactive game.",
        "fullDescription": "Python is universally recognized as the friendliest programming language for newcomers. In this intensive live session, you'll install your coding environment, understand variables, functions, and control flow, and produce three tangible mini-projects before the clock runs out. No prior technical experience required.",
        "learningPoints": [
            "Set up Python 3 and VS Code on Windows or macOS seamlessly",
            "Grasp variables, data types, conditionals, and repetitive loops",
            "Build a command-line expense tracker and a dice simulator",
            "Learn debugging techniques and how to read error messages like a pro",
            "Receive a structured 30-day learning roadmap and code templates"
        ],
        "prerequisites": "A laptop with an internet connection. No coding background expected.",
        "tags": ["Python", "Coding", "Beginner", "Software"],
        "isDemo": True
    },
    {
        "id": "ws-102",
        "title": "Generative AI & Prompt Engineering Studio",
        "categoryId": "tech-ai",
        "categoryName": "Technology and AI",
        "topicId": 2,
        "topicName": "Generative AI and Prompt Engineering",
        "format": "online",
        "location": "Google Meet & Live Prompt Sandbox",
        "date": "2026-10-26",
        "time": "2:00 PM - 5:30 PM EST",
        "duration": "3.5 hours",
        "price": 29,
        "priceLabel": "$29",
        "level": "beginner",
        "levelLabel": "Beginner",
        "featured": True,
        "seatsTotal": 50,
        "seatsLeft": 14,
        "registrationDeadline": "2026-10-25",
        "rating": 4.95,
        "reviewsCount": 88,
        "instructor": {
            "name": "Marcus Vance",
            "title": "AI Solutions Architect & Tech Columnist",
            "bio": "Advises Fortune 500 teams on generative AI workflows. Former product lead at prompt-engineering startups.",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
        },
        "shortDescription": "Supercharge your productivity, creative writing, and research using modern LLMs, reasoning chains, and prompt frameworks.",
        "fullDescription": "Unlock the real capabilities of Generative AI beyond generic answers. In this masterclass, you'll learn systematic prompt design methodologies, zero-shot/few-shot techniques, output formatting hacks, and how to automate everyday knowledge work.",
        "learningPoints": [
            "Master the CREATE framework for precise prompt specifications",
            "Use system instructions and structured schemas (JSON/Markdown)",
            "Automate document summaries, synthesis, and email triage",
            "Avoid hallucinations and establish factual grounding",
            "Hands-on prompt laboratory with personalized instructor feedback"
        ],
        "prerequisites": "Curiosity and access to any modern web browser.",
        "tags": ["AI", "Prompting", "Productivity", "Innovation"],
        "isDemo": True
    },
    {
        "id": "ws-103",
        "title": "Urban Clay & Wheel Pottery Masterclass",
        "categoryId": "creativity-arts",
        "categoryName": "Creativity and Arts",
        "topicId": 9,
        "topicName": "Pottery and Clay Modelling",
        "format": "offline",
        "location": "Artisan Loft Studios, 452 Broadway, New York, NY",
        "date": "2026-10-31",
        "time": "11:00 AM - 3:00 PM EST",
        "duration": "4 hours",
        "price": 65,
        "priceLabel": "$65",
        "level": "beginner",
        "levelLabel": "Beginner",
        "featured": True,
        "seatsTotal": 16,
        "seatsLeft": 3,
        "registrationDeadline": "2026-10-29",
        "rating": 4.88,
        "reviewsCount": 76,
        "instructor": {
            "name": "Sophia Chen",
            "title": "Ceramicist & Sculptor",
            "bio": "Exhibited across New York and Tokyo. Teaches centering, throwing, and meditative glazing in her Manhattan studio.",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
        },
        "shortDescription": "Get your hands dirty and discover the calming art of wheel-throwing and hand-building your own ceramic mug and bowl.",
        "fullDescription": "Step away from screens and connect with tactile craftsmanship. This workshop introduces clay preparation, wheel centering, wall pulling, and surface carving. Includes kiln firing and glazing for two finished pieces you get to keep.",
        "learningPoints": [
            "Clay wedging and moisture management techniques",
            "Wheel centering fundamentals and foot pedal control",
            "Shaping cylinders, cups, and curved rim vessels",
            "Texture sculpting using carving loops and wooden ribs",
            "Glazing basics and ceramic firing timelines"
        ],
        "prerequisites": "None! Wear clothes you don't mind getting clay on (aprons provided).",
        "tags": ["Pottery", "Crafts", "In-Person", "Art"],
        "isDemo": True
    },
    {
        "id": "ws-104",
        "title": "Executive Public Speaking & Confident Storytelling",
        "categoryId": "career-professional",
        "categoryName": "Career and Professional Skills",
        "topicId": 17,
        "topicName": "Public Speaking and Communication",
        "format": "online",
        "location": "Orbito Virtual Auditorium (Interactive Breakout Rooms)",
        "date": "2026-11-02",
        "time": "6:00 PM - 8:30 PM EST",
        "duration": "2.5 hours",
        "price": 35,
        "priceLabel": "$35",
        "level": "intermediate",
        "levelLabel": "Intermediate",
        "featured": True,
        "seatsTotal": 30,
        "seatsLeft": 9,
        "registrationDeadline": "2026-10-31",
        "rating": 4.92,
        "reviewsCount": 94,
        "instructor": {
            "name": "Jonathan Reyes",
            "title": "TEDx Speaker & Executive Speech Coach",
            "bio": "Trained 300+ keynote speakers and startup founders. Author of 'Voice in the Room'.",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
        },
        "shortDescription": "Transform presentation anxiety into commanding charisma. Master vocal inflection, body language, and hook architectures.",
        "fullDescription": "Whether presenting to an executive board, leading an all-hands meeting, or pitching clients, your communication determines your impact. Learn how to craft irresistible narratives, project vocal warmth, and answer difficult questions on the spot.",
        "learningPoints": [
            "Tame stage fright using physiological breathing protocols",
            "Structure high-impact talks using the 3-Act Persuasion Arc",
            "Vocal variety: pacing, strategic pauses, and tonal range",
            "Executive posture and virtual camera presence",
            "Receive live on-the-spot coaching during micro-speeches"
        ],
        "prerequisites": "Willingness to turn on your webcam and deliver a 60-second micro-speech.",
        "tags": ["Communication", "Career", "Leadership", "Speaking"],
        "isDemo": True
    }
]

# In-memory registration store
REGISTRATIONS = []

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class QuizPayload(BaseModel):
    interests: List[str] = []
    goals: List[str] = []
    learningStyle: Optional[str] = None
    skillLevel: Optional[str] = None
    format: Optional[str] = None
    budget: Optional[str] = None
    availability: Optional[str] = None

class RegistrationPayload(BaseModel):
    workshopId: str
    fullName: str
    email: EmailStr
    phone: Optional[str] = None
    learningGoal: Optional[str] = None

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/categories")
def get_categories():
    """Return all 7 categories with their 50 topics."""
    return CATEGORIES

@app.get("/api/workshops")
def get_workshops(
    category: Optional[str] = None,
    topic: Optional[str] = None,
    format: Optional[str] = None,
    level: Optional[str] = None,
    price: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "upcoming"
):
    """Retrieve and filter workshops."""
    results = list(WORKSHOPS)

    if search:
        q = search.lower().strip()
        results = [
            w for w in results
            if q in w["title"].lower()
            or q in w["topicName"].lower()
            or q in w["categoryName"].lower()
            or q in w["shortDescription"].lower()
            or q in w["instructor"]["name"].lower()
        ]

    if category and category != "all":
        results = [w for w in results if w["categoryId"] == category]

    if topic:
        results = [w for w in results if w["topicName"].lower() == topic.lower()]

    if format and format != "all":
        results = [w for w in results if w["format"] == format]

    if level and level != "all":
        results = [w for w in results if w["level"] == level]

    if price and price != "all":
        if price == "free":
            results = [w for w in results if w["price"] == 0]
        elif price == "paid":
            results = [w for w in results if w["price"] > 0]

    # Sorting
    if sort == "price-low":
        results.sort(key=lambda x: x["price"])
    elif sort == "price-high":
        results.sort(key=lambda x: x["price"], reverse=True)
    elif sort == "rating":
        results.sort(key=lambda x: x.get("rating", 0), reverse=True)
    else:
        results.sort(key=lambda x: x["date"])

    return results

@app.get("/api/workshops/{workshop_id}")
def get_workshop(workshop_id: str):
    """Get single workshop details."""
    for w in WORKSHOPS:
        if w["id"] == workshop_id:
            return w
    raise HTTPException(status_code=404, detail="Workshop not found")

@app.post("/api/recommendations")
def get_recommendations(payload: QuizPayload):
    """Compute personalized workshop recommendations with match scores and rationales."""
    scored = []
    interests = [i.lower() for i in payload.interests]

    for w in WORKSHOPS:
        score = 50
        rationales = []

        # Category match
        if any(cat in w["categoryId"].lower() or cat in w["categoryName"].lower() for cat in interests):
            score += 25
            rationales.append(f"Directly matches your interest in {w['categoryName']}")

        # Format match
        pref_format = (payload.format or "either").lower()
        if pref_format == "either":
            score += 10
        elif w["format"] == pref_format:
            score += 15
            rationales.append(f"Offered in your preferred {w['format'].capitalize()} format")

        # Level match
        pref_level = (payload.skillLevel or "").lower()
        if pref_level and (pref_level in w["level"] or ("beginner" in pref_level and w["level"] == "beginner")):
            score += 15
            rationales.append(f"Tailored for your current level ({w['levelLabel']})")

        # Budget match
        pref_budget = (payload.budget or "").lower()
        if "free" in pref_budget and w["price"] == 0:
            score += 15
            rationales.append("Free of cost, matching your budget preference")
        elif "low-cost" in pref_budget and w["price"] <= 35:
            score += 12
            rationales.append(f"Affordable access at {w['priceLabel']}")

        # Clamp between 65 and 99
        final_score = min(99, max(65, score))
        if not rationales:
            rationales.append(f"High-rated hands-on workshop in {w['categoryName']}")

        entry = dict(w)
        entry["matchScore"] = final_score
        entry["matchRationale"] = ". ".join(rationales[:2]) + "."
        scored.append(entry)

    scored.sort(key=lambda x: x["matchScore"], reverse=True)

    summary = (
        f"We analyzed your profile: interested in {', '.join(payload.interests) or 'diverse topics'}, "
        f"with a preference for {(payload.format or 'flexible').lower()} learning."
    )

    return {
        "recommendations": scored[:6],
        "userProfileSummary": summary
    }

@app.post("/api/registrations")
def create_registration(payload: RegistrationPayload):
    """Register for a workshop and return a confirmation code."""
    # Verify workshop exists
    workshop = next((w for w in WORKSHOPS if w["id"] == payload.workshopId), None)
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    reg_id = f"ORB-{uuid.uuid4().hex[:6].upper()}"
    record = {
        "registrationId": reg_id,
        "workshopId": payload.workshopId,
        "workshopTitle": workshop["title"],
        "fullName": payload.fullName,
        "email": payload.email,
        "phone": payload.phone,
        "learningGoal": payload.learningGoal,
        "registeredAt": datetime.utcnow().isoformat(),
        "status": "Confirmed"
    }

    REGISTRATIONS.append(record)
    return record
