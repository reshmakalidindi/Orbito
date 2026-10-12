"""
Comprehensive verification suite for all 50 Course Images, Mappings, Details Pages, and Navigation across Orbito.
"""
import os
import re

COURSE_MAPPINGS = {
    1: ("Python Programming for Beginners", "assets/images/courses/python-programming.png"),
    2: ("Generative AI and Prompt Engineering", "assets/images/courses/generative-ai.jpg"),
    3: ("Machine Learning Fundamentals", "assets/images/courses/machine-learning.jpg"),
    4: ("Web Development Bootcamp", "assets/images/courses/web-development.png"),
    5: ("Cloud Computing and AWS Basics", "assets/images/courses/cloud-computing.jpg"),
    6: ("Cybersecurity Awareness", "assets/images/courses/cybersecurity.jpg"),
    7: ("Robotics and Arduino", "assets/images/courses/robotics-arduino.jpg"),
    8: ("Data Analytics with Excel and Python", "assets/images/courses/data-analytics.jpg"),
    9: ("Pottery and Clay Modelling", "assets/images/courses/pottery-clay.jpg"),
    10: ("Photography for Beginners", "assets/images/courses/photography.jpg"),
    11: ("Digital Art and Illustration", "assets/images/courses/digital-art.jpg"),
    12: ("Painting and Canvas Art", "assets/images/courses/painting-canvas.jpg"),
    13: ("Graphic Design with Canva", "assets/images/courses/graphic-design-canva.png"),
    14: ("Creative Writing and Storytelling", "assets/images/courses/creative-writing.jpg"),
    15: ("Dance for Beginners", "assets/images/courses/dance-beginners.jpg"),
    16: ("Music and Guitar Basics", "assets/images/courses/music-guitar.jpg"),
    17: ("Public Speaking and Communication", "assets/images/courses/public-speaking.jpg"),
    18: ("Interview Skills and Mock Interviews", "assets/images/courses/interview-skills.jpg"),
    19: ("Resume and LinkedIn Building", "assets/images/courses/resume-linkedin.jpg"),
    20: ("Teamwork and Leadership", "assets/images/courses/teamwork-leadership.jpg"),
    21: ("English Communication Skills", "assets/images/courses/english-communication.jpg"),
    22: ("Time Management and Productivity", "assets/images/courses/time-management.jpg"),
    23: ("Competitive Programming Basics", "assets/images/courses/competitive-programming.jpg"),
    24: ("Design Thinking and Problem-Solving", "assets/images/courses/design-thinking.jpg"),
    25: ("Startup Idea Validation", "assets/images/courses/startup-validation.jpg"),
    26: ("Entrepreneurship and Pitching", "assets/images/courses/entrepreneurship-pitching.jpg"),
    27: ("Personal Finance for Students", "assets/images/courses/personal-finance.jpg"),
    28: ("Digital Marketing Fundamentals", "assets/images/courses/digital-marketing.jpg"),
    29: ("Build a Small Online Business", "assets/images/courses/online-business.jpg"),
    30: ("Negotiation and Decision-Making", "assets/images/courses/negotiation-decision.jpg"),
    31: ("Yoga for Beginners", "assets/images/courses/yoga-beginners.jpg"),
    32: ("Mindfulness and Meditation", "assets/images/courses/mindfulness-meditation.jpg"),
    33: ("Cooking for Beginners", "assets/images/courses/cooking-beginners.jpg"),
    34: ("Baking and Cake Decoration", "assets/images/courses/baking-cake-decoration.jpg"),
    35: ("Home Gardening and Plant Care", "assets/images/courses/home-gardening.jpg"),
    36: ("DIY Crafts and Jewellery Making", "assets/images/courses/diy-crafts-jewellery.jpg"),
    37: ("Personal Styling and Fashion Basics", "assets/images/courses/personal-styling-fashion.jpg"),
    38: ("First Aid and Emergency Preparedness", "assets/images/courses/first-aid-emergency.jpg"),
    39: ("Nature Walk and Birdwatching", "assets/images/courses/nature-walk-birdwatching.jpg"),
    40: ("Beginner Hiking and Trekking", "assets/images/courses/hiking-trekking.jpg"),
    41: ("Community Volunteering", "assets/images/courses/community-volunteering.jpg"),
    42: ("Board Games and Strategy Challenges", "assets/images/courses/board-games.jpg"),
    43: ("Quiz and Trivia Challenge", "assets/images/courses/quiz-trivia.jpg"),
    44: ("Theatre and Improvisation", "assets/images/courses/theatre-improvisation.jpg"),
    45: ("Video Editing and Content Creation", "assets/images/courses/video-editing.jpg"),
    46: ("3D Modelling and Printing", "assets/images/courses/3d-modelling-printing.jpg"),
    47: ("No-Code App Development", "assets/images/courses/no-code-app.jpg"),
    48: ("Basic Electronics and Gadget Repair", "assets/images/courses/electronics-gadget-repair.jpg"),
    49: ("Foreign Language Discovery", "assets/images/courses/foreign-language.jpg"),
    50: ("Everyday DIY and Repair Skills", "assets/images/courses/everyday-diy-repair.jpg")
}

def test_all_50_course_images_exist():
    assert len(COURSE_MAPPINGS) == 50
    for cid, (name, img_rel) in COURSE_MAPPINGS.items():
        img_name = os.path.basename(img_rel)
        path_root = os.path.join("assets", "images", "courses", img_name)
        path_fe = os.path.join("frontend", "assets", "images", "courses", img_name)
        assert os.path.isfile(path_root), f"Missing image in assets: {path_root} for course #{cid} ({name})"
        assert os.path.isfile(path_fe), f"Missing image in frontend: {path_fe} for course #{cid} ({name})"
        assert os.path.getsize(path_root) > 5000, f"Image {img_name} is too small or corrupted (<5KB)"
        assert os.path.getsize(path_fe) > 5000, f"Frontend image {img_name} is too small (<5KB)"
    print("✓ All 50 course images exist and are valid (>5KB) in both root assets and frontend directories.")

def test_all_50_data_mappings():
    for base in ["", "frontend/"]:
        path = os.path.join(base, "js/data.js")
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        assert "COURSE_IMAGE_MAP" in content, f"Missing COURSE_IMAGE_MAP in {path}"
        assert "ORBITO_CATEGORIES" in content, f"Missing ORBITO_CATEGORIES in {path}"

        for cid, (name, img_rel) in COURSE_MAPPINGS.items():
            # Check ID and Name in COURSE_IMAGE_MAP
            assert f'{cid}: "{img_rel}"' in content, f"Missing course ID {cid} mapping in {path}"
            assert f'"{name}": "{img_rel}"' in content, f"Missing course title '{name}' mapping in {path}"
            # Check in ORBITO_CATEGORIES topics
            assert f'image: "{img_rel}"' in content, f"Missing topic image {img_rel} in ORBITO_CATEGORIES in {path}"

    print("✓ All 50 course IDs, titles, and image paths verified in COURSE_IMAGE_MAP and ORBITO_CATEGORIES in js/data.js and frontend/js/data.js.")

def test_index_html_structure_and_all_tech_images():
    for base in ["", "frontend/"]:
        path = os.path.join(base, "index.html")
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        assert "domain-courses-section" in content
        assert "domain-courses-grid" in content
        
        # Verify courses 1 through 8 in Technology and AI all have explicit image tags
        tech_courses = [
            (1, "assets/images/courses/python-programming.png"),
            (2, "assets/images/courses/generative-ai.jpg"),
            (3, "assets/images/courses/machine-learning.jpg"),
            (4, "assets/images/courses/web-development.png"),
            (5, "assets/images/courses/cloud-computing.jpg"),
            (6, "assets/images/courses/cybersecurity.jpg"),
            (7, "assets/images/courses/robotics-arduino.jpg"),
            (8, "assets/images/courses/data-analytics.jpg")
        ]
        for cid, img_path in tech_courses:
            assert f'data-course-id="{cid}"' in content, f"Course card #{cid} missing in {path}"
            assert f'src="{img_path}"' in content, f"Image {img_path} missing from course #{cid} in {path}"

    print("✓ index.html and frontend/index.html contain domain courses with extracted images for courses 1-8.")

def test_explore_html_header_and_footer():
    for base_path in ["", "frontend/"]:
        path = os.path.join(base_path, "explore.html")
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        assert "demo-banner" not in content, f"demo-banner should be removed from {path}"
        assert "orbito-site-footer" in content, f"{path} should have the dark charcoal orbito-site-footer"
        
        # Header navigation checks: contains ONLY Home, Domains, How It Works, Join Now
        header_match = re.search(r'<header[^>]*class="site-header"[^>]*>(.*?)</header>', content, re.DOTALL)
        assert header_match, f"site-header not found in {path}"
        header_html = header_match.group(1)

        assert "Home" in header_html, f"Home link missing in header of {path}"
        assert "Domains" in header_html, f"Domains link missing in header of {path}"
        assert "How It Works" in header_html, f"How It Works link missing in header of {path}"
        assert "Join Now" in header_html, f"Join Now link missing in header of {path}"
        assert 'href="index.html#join-orbito"' in header_html, f"Join Now should redirect to index.html#join-orbito in {path}"

        # Must NOT contain extra links in header
        assert "Explore Workshops" not in header_html, f"Explore Workshops should be removed from header in {path}"
        assert "Discover My Interest" not in header_html, f"Discover My Interest should be removed from header in {path}"
        assert "Browse All" not in header_html, f"Browse All should be removed from header in {path}"

        # Filter bar checks: search bar and 4 pills beside it
        assert "explore-search-input" in content, f"Missing explore-search-input in {path}"
        assert "All Courses" in content, f"Missing 'All Courses' pill in {path}"
        assert "Popular" in content, f"Missing 'Popular' pill in {path}"
        assert "Beginner Friendly" in content, f"Missing 'Beginner Friendly' pill in {path}"
        assert "Live Online" in content, f"Missing 'Live Online' pill in {path}"

    print("✓ explore.html header (only Home, Domains, How It Works, Join Now) and filter toolbar verified in root and frontend.")

def test_workshop_details_cover_image():
    for base in ["", "frontend/"]:
        path = os.path.join(base, "workshop-details.html")
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        assert "COURSE_IMAGE_MAP" in content or "coverImg" in content, f"Cover image resolution missing in {path}"
        assert "workshop-details-media" in content, f"workshop-details-media banner missing in {path}"
        assert "object-fit: cover" in content, f"object-fit: cover styling missing in {path}"

    print("✓ workshop-details.html renders top cover image with object-fit: cover in root and frontend.")

def test_create_workshop_header_and_footer():
    with open("create-workshop.html", "r", encoding="utf-8") as f:
        content = f.read()

    assert 'id="header-right-group"' in content, "header-right-group ID required for account symbol"
    assert "Organizer Dashboard" in content
    assert "Create Workshop" in content
    assert "orbito-site-footer" in content
    assert "footer-main-grid" in content
    print("✓ create-workshop.html header and footer verified (horizontal navigation, account symbol anchor, dark charcoal footer).")

def test_explore_page_domains_and_courses():
    for base_path in ["", "frontend/"]:
        html_file = os.path.join(base_path, "explore.html")
        js_file = os.path.join(base_path, "js/workshops.js")
        css_file = os.path.join(base_path, "css/style.css")

        with open(html_file, "r", encoding="utf-8") as f:
            html = f.read()
        with open(js_file, "r", encoding="utf-8") as f:
            js = f.read()
        with open(css_file, "r", encoding="utf-8") as f:
            css = f.read()

        # HTML elements
        assert "explore-domain-hero" in html, f"Missing explore-domain-hero in {html_file}"
        assert "domain-tabs-track" in html, f"Missing domain-tabs-track in {html_file}"
        assert "explore-filter-bar" in html, f"Missing explore-filter-bar in {html_file}"
        assert "explore-courses-grid" in html, f"Missing explore-courses-grid in {html_file}"
        assert "explore-workshops-grid" in html, f"Missing explore-workshops-grid in {html_file}"

        # JS functions and domain coverage
        assert "COURSE_IMAGE_MAP" in js, f"Missing COURSE_IMAGE_MAP in {js_file}"
        assert "renderCoursesAndWorkshops" in js, f"Missing renderCoursesAndWorkshops in {js_file}"
        assert "renderDomainTabs" in js, f"Missing renderDomainTabs in {js_file}"
        assert "renderCoursePlaceholder" in js, f"Missing renderCoursePlaceholder in {js_file}"
        assert "renderWorkshopCard" in js, f"Missing renderWorkshopCard in {js_file}"
        for cat_slug in ["tech-ai", "creativity-arts", "career-professional", "entrepreneurship-finance", "lifestyle-wellness", "social-outdoor", "emerging-practical"]:
            assert cat_slug in js, f"Domain {cat_slug} not referenced in {js_file}"

        # CSS classes
        assert ".explore-domain-hero" in css, f"Missing .explore-domain-hero in {css_file}"
        assert ".domain-courses-grid" in css, f"Missing .domain-courses-grid in {css_file}"
        assert ".course-card-media" in css, f"Missing .course-card-media in {css_file}"

    print("✓ Explore page layout, 7 domain tabs, course image rendering, and responsive CSS verified in root and frontend.")

if __name__ == "__main__":
    test_all_50_course_images_exist()
    test_all_50_data_mappings()
    test_index_html_structure_and_all_tech_images()
    test_explore_html_header_and_footer()
    test_workshop_details_cover_image()
    test_create_workshop_header_and_footer()
    test_explore_page_domains_and_courses()
    print("\n========================================================")
    print("ALL 50 COURSE IMAGES & NAVIGATION TESTS PASSED SUCCESSFULLY!")
    print("========================================================")
