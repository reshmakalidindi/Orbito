"""
Script to update js/data.js and frontend/js/data.js with all 50 course images and detailed course metadata.
"""
import os
import re

COURSE_IMAGE_MAP_STR = """const COURSE_IMAGE_MAP = {
  // Domain 1: Technology and AI
  1: "assets/images/courses/python-programming.png",
  "Python Programming for Beginners": "assets/images/courses/python-programming.png",
  2: "assets/images/courses/generative-ai.jpg",
  "Generative AI and Prompt Engineering": "assets/images/courses/generative-ai.jpg",
  3: "assets/images/courses/machine-learning.jpg",
  "Machine Learning Fundamentals": "assets/images/courses/machine-learning.jpg",
  4: "assets/images/courses/web-development.png",
  "Web Development Bootcamp": "assets/images/courses/web-development.png",
  5: "assets/images/courses/cloud-computing.jpg",
  "Cloud Computing and AWS Basics": "assets/images/courses/cloud-computing.jpg",
  6: "assets/images/courses/cybersecurity.jpg",
  "Cybersecurity Awareness": "assets/images/courses/cybersecurity.jpg",
  7: "assets/images/courses/robotics-arduino.jpg",
  "Robotics and Arduino": "assets/images/courses/robotics-arduino.jpg",
  8: "assets/images/courses/data-analytics.jpg",
  "Data Analytics with Excel and Python": "assets/images/courses/data-analytics.jpg",

  // Domain 2: Creativity and Arts
  9: "assets/images/courses/pottery-clay.jpg",
  "Pottery and Clay Modelling": "assets/images/courses/pottery-clay.jpg",
  10: "assets/images/courses/photography.jpg",
  "Photography for Beginners": "assets/images/courses/photography.jpg",
  11: "assets/images/courses/digital-art.jpg",
  "Digital Art and Illustration": "assets/images/courses/digital-art.jpg",
  12: "assets/images/courses/painting-canvas.jpg",
  "Painting and Canvas Art": "assets/images/courses/painting-canvas.jpg",
  13: "assets/images/courses/graphic-design-canva.png",
  "Graphic Design with Canva": "assets/images/courses/graphic-design-canva.png",
  14: "assets/images/courses/creative-writing.jpg",
  "Creative Writing and Storytelling": "assets/images/courses/creative-writing.jpg",
  15: "assets/images/courses/dance-beginners.jpg",
  "Dance for Beginners": "assets/images/courses/dance-beginners.jpg",
  16: "assets/images/courses/music-guitar.jpg",
  "Music and Guitar Basics": "assets/images/courses/music-guitar.jpg",

  // Domain 3: Career and Professional Skills
  17: "assets/images/courses/public-speaking.jpg",
  "Public Speaking and Communication": "assets/images/courses/public-speaking.jpg",
  18: "assets/images/courses/interview-skills.jpg",
  "Interview Skills and Mock Interviews": "assets/images/courses/interview-skills.jpg",
  19: "assets/images/courses/resume-linkedin.jpg",
  "Resume and LinkedIn Building": "assets/images/courses/resume-linkedin.jpg",
  20: "assets/images/courses/teamwork-leadership.jpg",
  "Teamwork and Leadership": "assets/images/courses/teamwork-leadership.jpg",
  21: "assets/images/courses/english-communication.jpg",
  "English Communication Skills": "assets/images/courses/english-communication.jpg",
  22: "assets/images/courses/time-management.jpg",
  "Time Management and Productivity": "assets/images/courses/time-management.jpg",
  23: "assets/images/courses/competitive-programming.jpg",
  "Competitive Programming Basics": "assets/images/courses/competitive-programming.jpg",
  24: "assets/images/courses/design-thinking.jpg",
  "Design Thinking and Problem-Solving": "assets/images/courses/design-thinking.jpg",

  // Domain 4: Entrepreneurship and Finance
  25: "assets/images/courses/startup-validation.jpg",
  "Startup Idea Validation": "assets/images/courses/startup-validation.jpg",
  26: "assets/images/courses/entrepreneurship-pitching.jpg",
  "Entrepreneurship and Pitching": "assets/images/courses/entrepreneurship-pitching.jpg",
  27: "assets/images/courses/personal-finance.jpg",
  "Personal Finance for Students": "assets/images/courses/personal-finance.jpg",
  28: "assets/images/courses/digital-marketing.jpg",
  "Digital Marketing Fundamentals": "assets/images/courses/digital-marketing.jpg",
  29: "assets/images/courses/online-business.jpg",
  "Build a Small Online Business": "assets/images/courses/online-business.jpg",
  30: "assets/images/courses/negotiation-decision.jpg",
  "Negotiation and Decision-Making": "assets/images/courses/negotiation-decision.jpg",

  // Domain 5: Lifestyle, Wellness and Personal Development
  31: "assets/images/courses/yoga-beginners.jpg",
  "Yoga for Beginners": "assets/images/courses/yoga-beginners.jpg",
  32: "assets/images/courses/mindfulness-meditation.jpg",
  "Mindfulness and Meditation": "assets/images/courses/mindfulness-meditation.jpg",
  33: "assets/images/courses/cooking-beginners.jpg",
  "Cooking for Beginners": "assets/images/courses/cooking-beginners.jpg",
  34: "assets/images/courses/baking-cake-decoration.jpg",
  "Baking and Cake Decoration": "assets/images/courses/baking-cake-decoration.jpg",
  35: "assets/images/courses/home-gardening.jpg",
  "Home Gardening and Plant Care": "assets/images/courses/home-gardening.jpg",
  36: "assets/images/courses/diy-crafts-jewellery.jpg",
  "DIY Crafts and Jewellery Making": "assets/images/courses/diy-crafts-jewellery.jpg",
  37: "assets/images/courses/personal-styling-fashion.jpg",
  "Personal Styling and Fashion Basics": "assets/images/courses/personal-styling-fashion.jpg",
  38: "assets/images/courses/first-aid-emergency.jpg",
  "First Aid and Emergency Preparedness": "assets/images/courses/first-aid-emergency.jpg",

  // Domain 6: Social, Outdoor and Community Activities
  39: "assets/images/courses/nature-walk-birdwatching.jpg",
  "Nature Walk and Birdwatching": "assets/images/courses/nature-walk-birdwatching.jpg",
  40: "assets/images/courses/hiking-trekking.jpg",
  "Beginner Hiking and Trekking": "assets/images/courses/hiking-trekking.jpg",
  41: "assets/images/courses/community-volunteering.jpg",
  "Community Volunteering": "assets/images/courses/community-volunteering.jpg",
  42: "assets/images/courses/board-games.jpg",
  "Board Games and Strategy Challenges": "assets/images/courses/board-games.jpg",
  43: "assets/images/courses/quiz-trivia.jpg",
  "Quiz and Trivia Challenge": "assets/images/courses/quiz-trivia.jpg",
  44: "assets/images/courses/theatre-improvisation.jpg",
  "Theatre and Improvisation": "assets/images/courses/theatre-improvisation.jpg",

  // Domain 7: Emerging Skills and Practical Life Skills
  45: "assets/images/courses/video-editing.jpg",
  "Video Editing and Content Creation": "assets/images/courses/video-editing.jpg",
  46: "assets/images/courses/3d-modelling-printing.jpg",
  "3D Modelling and Printing": "assets/images/courses/3d-modelling-printing.jpg",
  47: "assets/images/courses/no-code-app.jpg",
  "No-Code App Development": "assets/images/courses/no-code-app.jpg",
  48: "assets/images/courses/electronics-gadget-repair.jpg",
  "Basic Electronics and Gadget Repair": "assets/images/courses/electronics-gadget-repair.jpg",
  49: "assets/images/courses/foreign-language.jpg",
  "Foreign Language Discovery": "assets/images/courses/foreign-language.jpg",
  50: "assets/images/courses/everyday-diy-repair.jpg",
  "Everyday DIY and Repair Skills": "assets/images/courses/everyday-diy-repair.jpg"
};"""

ORBITO_CATEGORIES_STR = """const ORBITO_CATEGORIES = [
  {
    id: "tech-ai",
    name: "Technology and AI",
    icon: "code",
    color: "#4F46E5",
    description: "Master modern software, artificial intelligence, robotics, and cloud engineering.",
    topics: [
      { id: 1, name: "Python Programming for Beginners", popular: true, image: "assets/images/courses/python-programming.png", duration: "4 Weeks", level: "Beginner", format: "Hands-on Cohort", description: "Learn coding basics, variables, loops, and build your first real mini projects." },
      { id: 2, name: "Generative AI and Prompt Engineering", popular: true, image: "assets/images/courses/generative-ai.jpg", duration: "3.5 Hours", level: "Beginner", format: "Interactive AI Lab", description: "Harness LLMs, craft professional prompts, automate tasks, and build generative workflows." },
      { id: 3, name: "Machine Learning Fundamentals", popular: true, image: "assets/images/courses/machine-learning.jpg", duration: "6 Weeks", level: "Beginner to Intermediate", format: "Live Cohort", description: "Explore predictive models, algorithms, and practical datasets step-by-step." },
      { id: 4, name: "Web Development Bootcamp", popular: true, image: "assets/images/courses/web-development.png", duration: "8 Weeks", level: "Beginner Friendly", format: "Project Studio", description: "Build modern responsive websites from scratch using HTML5, CSS3, modern JavaScript, and React." },
      { id: 5, name: "Cloud Computing and AWS Basics", popular: false, image: "assets/images/courses/cloud-computing.jpg", duration: "3 Weeks", level: "Beginner", format: "Cloud Sandbox", description: "Understand cloud architecture, serverless deployments, and core AWS services." },
      { id: 6, name: "Cybersecurity Awareness", popular: false, image: "assets/images/courses/cybersecurity.jpg", duration: "2-Day Workshop", level: "All Levels", format: "Interactive Webinar", description: "Protect digital identities, recognize cyber threats, and practice web safety." },
      { id: 7, name: "Robotics and Arduino", popular: false, image: "assets/images/courses/robotics-arduino.jpg", duration: "4 Sessions", level: "Beginner", format: "Maker Lab", description: "Tinker with microcontrollers, sensors, circuits, and physical computing." },
      { id: 8, name: "Data Analytics with Excel and Python", popular: true, image: "assets/images/courses/data-analytics.jpg", duration: "4 Weeks", level: "Beginner", format: "Data Studio", description: "Clean data, extract business insights, and create interactive dashboards." }
    ]
  },
  {
    id: "creativity-arts",
    name: "Creativity and Arts",
    icon: "palette",
    color: "#EC4899",
    description: "Unleash your visual, tactile, and musical expressions through hands-on creative arts.",
    topics: [
      { id: 9, name: "Pottery and Clay Modelling", popular: true, image: "assets/images/courses/pottery-clay.jpg", duration: "3-Hour Studio", level: "Beginner", format: "In-Person Studio", description: "Shape clay by hand and master wheel throwing in an authentic artisan studio." },
      { id: 10, name: "Photography for Beginners", popular: true, image: "assets/images/courses/photography.jpg", duration: "Weekend Workshop", level: "Beginner", format: "Studio & Outdoor Walk", description: "Master camera exposure, lighting, framing, and visual storytelling." },
      { id: 11, name: "Digital Art and Illustration", popular: true, image: "assets/images/courses/digital-art.jpg", duration: "4 Weeks", level: "Beginner to Intermediate", format: "Live Digital Canvas", description: "Draw stunning illustrations using digital tablets, layers, and color theory." },
      { id: 12, name: "Painting and Canvas Art", popular: false, image: "assets/images/courses/painting-canvas.jpg", duration: "Half-Day Masterclass", level: "All Levels", format: "Art Studio", description: "Express emotion through acrylics, color blending, and textural brushwork." },
      { id: 13, name: "Graphic Design with Canva", popular: true, image: "assets/images/courses/graphic-design-canva.png", duration: "2-Day Intensive", level: "Beginner", format: "Live Design Lab", description: "Create eye-catching social posts, presentations, and professional branding." },
      { id: 14, name: "Creative Writing and Storytelling", popular: false, image: "assets/images/courses/creative-writing.jpg", duration: "3 Weeks", level: "Beginner", format: "Writers Circle", description: "Craft memorable characters, write engaging narratives, and find your voice." },
      { id: 15, name: "Dance for Beginners", popular: false, image: "assets/images/courses/dance-beginners.jpg", duration: "4 Sessions", level: "Beginner", format: "Dance Studio", description: "Learn expressive choreography, rhythm, and body movement fundamentals." },
      { id: 16, name: "Music and Guitar Basics", popular: true, image: "assets/images/courses/music-guitar.jpg", duration: "4 Weeks", level: "Beginner", format: "Live Acoustic Lab", description: "Strum your first chords, understand rhythm tabs, and play favorite melodies." }
    ]
  },
  {
    id: "career-professional",
    name: "Career and Professional Skills",
    icon: "briefcase",
    color: "#2563EB",
    description: "Elevate your professional trajectory, leadership presence, and workplace performance.",
    topics: [
      { id: 17, name: "Public Speaking and Communication", popular: true, image: "assets/images/courses/public-speaking.jpg", duration: "3 Weeks", level: "Beginner to Intermediate", format: "Interactive Cohort", description: "Master vocal confidence, speech structuring, and overcome presentation anxiety." },
      { id: 18, name: "Interview Skills and Mock Interviews", popular: true, image: "assets/images/courses/interview-skills.jpg", duration: "2-Day Intensive", level: "All Levels", format: "Live Mock Lab", description: "Ace behavioral and technical questions with realistic mock simulations and expert feedback." },
      { id: 19, name: "Resume and LinkedIn Building", popular: true, image: "assets/images/courses/resume-linkedin.jpg", duration: "1-Day Workshop", level: "Beginner Friendly", format: "Career Clinic", description: "Craft ATS-optimized resumes and build a commanding personal brand on LinkedIn." },
      { id: 20, name: "Teamwork and Leadership", popular: false, image: "assets/images/courses/teamwork-leadership.jpg", duration: "3 Weeks", level: "Intermediate", format: "Leadership Cohort", description: "Develop empathetic collaboration, effective delegation, and high-impact project leadership." },
      { id: 21, name: "English Communication Skills", popular: false, image: "assets/images/courses/english-communication.jpg", duration: "4 Weeks", level: "Beginner Friendly", format: "Conversation Circle", description: "Enhance spoken fluency, business vocabulary, and clear professional expression." },
      { id: 22, name: "Time Management and Productivity", popular: true, image: "assets/images/courses/time-management.jpg", duration: "1-Week Sprint", level: "All Levels", format: "Productivity Masterclass", description: "Eliminate procrastination, structure deep work sessions, and master daily focus rituals." },
      { id: 23, name: "Competitive Programming Basics", popular: false, image: "assets/images/courses/competitive-programming.jpg", duration: "6 Weeks", level: "Beginner to Intermediate", format: "Code Studio", description: "Master foundational data structures, algorithmic paradigms, and speed problem-solving." },
      { id: 24, name: "Design Thinking and Problem-Solving", popular: true, image: "assets/images/courses/design-thinking.jpg", duration: "2-Day Workshop", level: "All Levels", format: "Innovation Studio", description: "Apply user-centric empathy, rapid prototyping, and creative iterative problem-solving." }
    ]
  },
  {
    id: "entrepreneurship-finance",
    name: "Entrepreneurship and Finance",
    icon: "trending-up",
    color: "#059669",
    description: "Build viable ventures, master marketing, and take control of personal wealth.",
    topics: [
      { id: 25, name: "Startup Idea Validation", popular: true, image: "assets/images/courses/startup-validation.jpg", duration: "3 Weeks", level: "Beginner", format: "Founder Lab", description: "Test customer hypotheses, conduct discovery interviews, and validate real market demand." },
      { id: 26, name: "Entrepreneurship and Pitching", popular: true, image: "assets/images/courses/entrepreneurship-pitching.jpg", duration: "2-Day Masterclass", level: "All Levels", format: "Pitch Clinic", description: "Design compelling pitch decks and pitch angel investors with executive presence." },
      { id: 27, name: "Personal Finance for Students", popular: true, image: "assets/images/courses/personal-finance.jpg", duration: "2 Weeks", level: "Beginner Friendly", format: "Wealth Lab", description: "Learn student budgeting, index fund investing, compound interest, and credit building." },
      { id: 28, name: "Digital Marketing Fundamentals", popular: true, image: "assets/images/courses/digital-marketing.jpg", duration: "4 Weeks", level: "Beginner", format: "Growth Cohort", description: "Run SEO, performance ads, email sequences, and social media growth funnels." },
      { id: 29, name: "Build a Small Online Business", popular: false, image: "assets/images/courses/online-business.jpg", duration: "4 Weeks", level: "Beginner", format: "E-Commerce Incubator", description: "Launch an online store, set up payment gateways, and win your first paying customers." },
      { id: 30, name: "Negotiation and Decision-Making", popular: false, image: "assets/images/courses/negotiation-decision.jpg", duration: "2-Day Intensive", level: "All Levels", format: "Negotiation Arena", description: "Master win-win negotiation strategies, cognitive bias awareness, and deal structuring." }
    ]
  },
  {
    id: "lifestyle-wellness",
    name: "Lifestyle, Wellness and Personal Development",
    icon: "heart",
    color: "#E11D48",
    description: "Nurture physical vitality, mental clarity, culinary delight, and mindful living.",
    topics: [
      { id: 31, name: "Yoga for Beginners", popular: true, image: "assets/images/courses/yoga-beginners.jpg", duration: "4 Weeks", level: "Beginner Friendly", format: "Mindful Studio", description: "Learn foundational yoga postures, gentle alignment, breathwork, and full-body flexibility." },
      { id: 32, name: "Mindfulness and Meditation", popular: true, image: "assets/images/courses/mindfulness-meditation.jpg", duration: "2 Weeks", level: "All Levels", format: "Guided Retreat", description: "Cultivate inner stillness, emotional resilience, and daily guided meditation practices." },
      { id: 33, name: "Cooking for Beginners", popular: true, image: "assets/images/courses/cooking-beginners.jpg", duration: "3-Hour Studio", level: "Beginner", format: "Culinary Kitchen", description: "Master essential kitchen knife skills, pan searing, and delicious wholesome everyday recipes." },
      { id: 34, name: "Baking and Cake Decoration", popular: true, image: "assets/images/courses/baking-cake-decoration.jpg", duration: "Half-Day Workshop", level: "Beginner to Intermediate", format: "Bake Studio", description: "Learn artisan doughs, delicate pastries, and creative buttercream piping techniques." },
      { id: 35, name: "Home Gardening and Plant Care", popular: false, image: "assets/images/courses/home-gardening.jpg", duration: "Weekend Workshop", level: "All Levels", format: "Botanical Garden", description: "Grow vibrant indoor houseplants, nurture soil health, and cultivate organic herbs." },
      { id: 36, name: "DIY Crafts and Jewellery Making", popular: false, image: "assets/images/courses/diy-crafts-jewellery.jpg", duration: "3-Hour Studio", level: "Beginner", format: "Artisan Craft Table", description: "Design handmade beaded necklaces, wire-wrapped earrings, and custom artisan accessories." },
      { id: 37, name: "Personal Styling and Fashion Basics", popular: false, image: "assets/images/courses/personal-styling-fashion.jpg", duration: "2-Day Workshop", level: "All Levels", format: "Style Studio", description: "Curate an intentional wardrobe, discover flattering color palettes, and dress with confidence." },
      { id: 38, name: "First Aid and Emergency Preparedness", popular: true, image: "assets/images/courses/first-aid-emergency.jpg", duration: "1-Day Certified Course", level: "All Levels", format: "Practical Simulation", description: "Learn hands-on CPR, AED operation, wound care, and decisive emergency response." }
    ]
  },
  {
    id: "social-outdoor",
    name: "Social, Outdoor and Community Activities",
    icon: "compass",
    color: "#D97706",
    description: "Connect with nature, bond through social challenges, and give back to society.",
    topics: [
      { id: 39, name: "Nature Walk and Birdwatching", popular: true, image: "assets/images/courses/nature-walk-birdwatching.jpg", duration: "Half-Day Trail", level: "All Levels", format: "Outdoor Field Excursion", description: "Spot native wildlife, identify bird species by call, and connect with local ecology." },
      { id: 40, name: "Beginner Hiking and Trekking", popular: true, image: "assets/images/courses/hiking-trekking.jpg", duration: "Full-Day Expedition", level: "Beginner", format: "Guided Mountain Trail", description: "Prepare outdoor gear, master pacing and trail navigation, and explore scenic trails safely." },
      { id: 41, name: "Community Volunteering", popular: false, image: "assets/images/courses/community-volunteering.jpg", duration: "Weekend Drive", level: "All Levels", format: "Community Impact Event", description: "Join local community initiatives, environmental restoration, and social impact projects." },
      { id: 42, name: "Board Games and Strategy Challenges", popular: true, image: "assets/images/courses/board-games.jpg", duration: "Evening Social", level: "All Levels", format: "Tabletop Lounge", description: "Explore tactical modern board games, solve social deduction puzzles, and make new friends." },
      { id: 43, name: "Quiz and Trivia Challenge", popular: false, image: "assets/images/courses/quiz-trivia.jpg", duration: "2-Hour Event", level: "All Levels", format: "Live Pub Trivia", description: "Test your wit across science, pop culture, and history in spirited team trivia rounds." },
      { id: 44, name: "Theatre and Improvisation", popular: true, image: "assets/images/courses/theatre-improvisation.jpg", duration: "4 Sessions", level: "Beginner Friendly", format: "Black Box Theatre", description: "Embrace spontaneity, master comedic timing, and build stage presence through improv." }
    ]
  },
  {
    id: "emerging-practical",
    name: "Emerging Skills and Practical Life Skills",
    icon: "tool",
    color: "#7C3AED",
    description: "Acquire modern technological crafts, no-code workflows, and everyday hands-on mastery.",
    topics: [
      { id: 45, name: "Video Editing and Content Creation", popular: true, image: "assets/images/courses/video-editing.jpg", duration: "3 Weeks", level: "Beginner to Intermediate", format: "Creator Lab", description: "Edit cinematic reels, craft viral hooks, mix audio, and color grade professional videos." },
      { id: 46, name: "3D Modelling and Printing", popular: true, image: "assets/images/courses/3d-modelling-printing.jpg", duration: "Weekend Intensive", level: "Beginner", format: "Fab Lab Studio", description: "Create 3D models in CAD software and transform ideas into real physical objects." },
      { id: 47, name: "No-Code App Development", popular: true, image: "assets/images/courses/no-code-app.jpg", duration: "3 Weeks", level: "Beginner Friendly", format: "Product Sprint", description: "Build full-fledged web and mobile apps using modern no-code databases and UI builders." },
      { id: 48, name: "Basic Electronics and Gadget Repair", popular: false, image: "assets/images/courses/electronics-gadget-repair.jpg", duration: "2-Day Workshop", level: "Beginner Friendly", format: "Hardware Workbench", description: "Learn circuit soldering, multimeter testing, and safely repair common household gadgets." },
      { id: 49, name: "Foreign Language Discovery", popular: false, image: "assets/images/courses/foreign-language.jpg", duration: "4 Weeks", level: "Beginner", format: "Language Exchange", description: "Learn conversational pronunciation, travel greetings, and cultural etiquette." },
      { id: 50, name: "Everyday DIY and Repair Skills", popular: true, image: "assets/images/courses/everyday-diy-repair.jpg", duration: "1-Day Workshop", level: "All Levels", format: "Practical Workshop", description: "Fix plumbing drips, anchor heavy shelves, use power tools, and tackle essential home repairs." }
    ]
  }
];"""

def update_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace COURSE_IMAGE_MAP
    content = re.sub(
        r'const COURSE_IMAGE_MAP = \{.*?\};',
        COURSE_IMAGE_MAP_STR,
        content,
        flags=re.DOTALL
    )

    # Replace ORBITO_CATEGORIES
    content = re.sub(
        r'const ORBITO_CATEGORIES = \[.*?\];',
        ORBITO_CATEGORIES_STR,
        content,
        flags=re.DOTALL
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {filepath} successfully.")

update_file("js/data.js")
update_file("frontend/js/data.js")
