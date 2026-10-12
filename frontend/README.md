# Orbito — Workshop & Passion Discovery Platform

**Orbito** is a modern, responsive website frontend that helps curious learners discover live workshops, webinars, hobbies, and activities tailored directly to their interests.

The platform organizes **50 predefined topics** across **7 core categories** and caters to two primary journeys:
1. **Direct Discovery**: Fast search, filtering, and sorting across dates, formats, pricing, and difficulty levels.
2. **Interest Discovery Quiz**: An interactive 7-step guided questionnaire that calculates personalized workshop recommendations with transparent matching rationales.

---

## 📁 Project Architecture

```
orbito/
├── frontend/                     # Ready-to-deploy frontend directory
│   ├── index.html                # Page A: Homepage (Hero, Search, 50 Topics Directory, Featured Events)
│   ├── explore.html              # Page B: Workshop Directory (Filters, Search, Sorting, Grid)
│   ├── workshop-details.html     # Page C: Workshop Detail View & Registration Flow
│   ├── quiz.html                 # Page D: Multi-step Interest Discovery Quiz Engine
│   ├── recommendations.html      # Page E: Personalized Recommended Cohorts & Rationale
│   ├── css/
│   │   ├── style.css             # Design tokens, typography, cards, modal dialogs, toasts
│   │   └── responsive.css        # Breakpoint optimization for desktop, tablet, and mobile
│   ├── js/
│   │   ├── data.js               # 7 categories, 50 master topics, and rich sample workshop records
│   │   ├── api.js                # FastAPI client layer with graceful demo fallback
│   │   ├── app.js                # Global helpers, SVG icon library, toasts, registration modal
│   │   ├── workshops.js          # Workshop card rendering, filter state & query string sync
│   │   ├── quiz.js               # Interactive multi-step quiz engine with sessionStorage persistence
│   │   └── recommendations.js    # Recommendation scoring presentation & preference editor
│   └── assets/
│       ├── images/
│       └── icons/
├── fastapi_server.py             # Reference Python FastAPI backend server with all 5 endpoints
└── README.md                     # Documentation & setup guide
```

---

## 🎨 Visual Design System

- **Color Palette**:
  - Warm Luxury Off-White Canvas: `#FAF9F6` / `#F4F3EF`
  - High-Contrast Navy Typography: `#0F172A` / `#334155`
  - Vibrant Accents: Indigo `#4F46E5` & Purple `#7C3AED`
  - Semantic Status: Emerald `#059669` (Free / Confirmed), Amber `#D97706` (Ratings / Limited Seats)
- **Zero Heavy Dependencies**: Pure semantic HTML5, modern CSS3 (Flexbox & Grid), and Vanilla ES6+ JavaScript. No React, Bootstrap, or Tailwind required.
- **Embedded SVG Icons**: Crisp vector icons included directly without external CDN font dependencies, guaranteeing 100% offline reliability.
- **Micro-Interactions**: Smooth card elevations, responsive hamburger navigation drawer, and animated feedback toasts.

---

## 🚀 How to Run the Frontend Locally

### Option 1: Instant Local Python Server (Recommended)

From the project folder, start a lightweight HTTP server:

```bash
cd /Users/sravanthikalavakunta/.gemini/antigravity/scratch/orbito
python3 -m http.server 3000
```

Now open your browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)** or **[http://localhost:3000/frontend/](http://localhost:3000/frontend/)**

### Option 2: Direct File Launch
Double-click `index.html` or open it directly in Google Chrome, Safari, Firefox, or Edge. All styles and scripts use relative paths.

---

## 🔌 FastAPI Backend Integration

The frontend client in `js/api.js` is pre-configured to communicate with FastAPI at:
```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

### Running the Included FastAPI Backend

1. Install the required Python packages:
```bash
pip install fastapi uvicorn pydantic
```

2. Start the FastAPI server:
```bash
uvicorn fastapi_server:app --reload --port 8000
```

3. Interactive Swagger documentation will be available at:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

### Supported Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Returns the 7 categories and 50 predefined topics |
| `GET` | `/api/workshops` | Returns workshop records filtered by category, format, level, date, price, or search query |
| `GET` | `/api/workshops/{id}` | Returns complete syllabus, instructor bio, and seat counts for a single workshop |
| `POST` | `/api/recommendations` | Accepts quiz preferences payload and returns ranked workshops with match percentages and rationales |
| `POST` | `/api/registrations` | Submits workshop enrollment and generates a unique confirmation code (`ORB-XXXXXX`) |

> **Graceful Fallback Mode**: If the FastAPI server is not currently running, `js/api.js` automatically activates **Demo Fallback Mode** with transparent notification banners. Quiz scoring, filtering, and registration will continue working seamlessly.

---

## 📚 Complete 50 Predefined Topics Directory

### 1. Technology and AI (8 Topics)
1. Python Programming for Beginners
2. Generative AI and Prompt Engineering
3. Machine Learning Fundamentals
4. Web Development Bootcamp
5. Cloud Computing and AWS Basics
6. Cybersecurity Awareness
7. Robotics and Arduino
8. Data Analytics with Excel and Python

### 2. Creativity and Arts (8 Topics)
9. Pottery and Clay Modelling
10. Photography for Beginners
11. Digital Art and Illustration
12. Painting and Canvas Art
13. Graphic Design with Canva
14. Creative Writing and Storytelling
15. Dance for Beginners
16. Music and Guitar Basics

### 3. Career and Professional Skills (8 Topics)
17. Public Speaking and Communication
18. Interview Skills and Mock Interviews
19. Resume and LinkedIn Building
20. Teamwork and Leadership
21. English Communication Skills
22. Time Management and Productivity
23. Competitive Programming Basics
24. Design Thinking and Problem-Solving

### 4. Entrepreneurship and Finance (6 Topics)
25. Startup Idea Validation
26. Entrepreneurship and Pitching
27. Personal Finance for Students
28. Digital Marketing Fundamentals
29. Build a Small Online Business
30. Negotiation and Decision-Making

### 5. Lifestyle, Wellness and Personal Development (8 Topics)
31. Yoga for Beginners
32. Mindfulness and Meditation
33. Cooking for Beginners
34. Baking and Cake Decoration
35. Home Gardening and Plant Care
36. DIY Crafts and Jewellery Making
37. Personal Styling and Fashion Basics
38. First Aid and Emergency Preparedness

### 6. Social, Outdoor and Community Activities (6 Topics)
39. Nature Walk and Birdwatching
40. Beginner Hiking and Trekking
41. Community Volunteering
42. Board Games and Strategy Challenges
43. Quiz and Trivia Challenge
44. Theatre and Improvisation

### 7. Emerging Skills and Practical Life Skills (6 Topics)
45. Video Editing and Content Creation
46. 3D Modelling and Printing
47. No-Code App Development
48. Basic Electronics and Gadget Repair
49. Foreign Language Discovery
50. Everyday DIY and Repair Skills

---

## 🔒 Security & Safe DOM Rendering
- All dynamic text insertions utilize `escapeHTML()` to neutralize potential XSS vectors.
- No API keys, secret credentials, or LLM tokens are bundled in client-side code.
- Inputs are validated on both single-select and multi-select steps in the quiz interface.
