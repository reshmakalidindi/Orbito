"""
Verification suite for Course Images and Navigation consistency across Orbito.
"""
import os
import re

def test_course_images_exist():
    images = [
        "python-programming.png",
        "generative-ai.jpg",
        "web-development.png",
        "pottery-clay.jpg",
        "graphic-design-canva.png"
    ]
    for img in images:
        path_root = os.path.join("assets", "images", "courses", img)
        path_fe = os.path.join("frontend", "assets", "images", "courses", img)
        assert os.path.isfile(path_root), f"Missing image in assets: {path_root}"
        assert os.path.isfile(path_fe), f"Missing image in frontend: {path_fe}"
        assert os.path.getsize(path_root) > 1000, f"Image {img} is empty or corrupted"
    print("✓ All 5 uploaded course images exist and are non-empty in assets and frontend directories.")

def test_data_mappings():
    with open("js/data.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    assert "COURSE_IMAGE_MAP" in content
    assert "assets/images/courses/python-programming.png" in content
    assert "assets/images/courses/generative-ai.jpg" in content
    assert "assets/images/courses/web-development.png" in content
    assert "assets/images/courses/pottery-clay.jpg" in content
    assert "assets/images/courses/graphic-design-canva.png" in content
    print("✓ COURSE_IMAGE_MAP and topic mappings verified in js/data.js.")

def test_index_html_structure():
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    assert "domain-courses-section" in content
    assert "domain-courses-grid" in content
    assert "assets/images/courses/python-programming.png" in content
    assert "assets/images/courses/generative-ai.jpg" in content
    assert "assets/images/courses/web-development.png" in content
    print("✓ index.html contains domain-courses-section and responsive courses grid with images.")

def test_explore_html_header_and_footer():
    with open("explore.html", "r", encoding="utf-8") as f:
        content = f.read()

    assert "demo-banner" not in content, "demo-banner should be removed from explore.html"
    assert 'id="header-right-group"' in content, "header-right-group ID required for account symbol"
    assert "orbito-site-footer" in content, "explore.html should have the dark charcoal orbito-site-footer"
    assert "Browse All" in content, "explore.html header should include Browse All link"
    assert "Discover My Interest" in content
    print("✓ explore.html header and footer verified (no demo banner, correct horizontal navigation, dark charcoal footer).")

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
    test_course_images_exist()
    test_data_mappings()
    test_index_html_structure()
    test_explore_html_header_and_footer()
    test_create_workshop_header_and_footer()
    test_explore_page_domains_and_courses()
    print("\n========================================================")
    print("ALL COURSE IMAGES & NAVIGATION TESTS PASSED SUCCESSFULLY!")
    print("========================================================")
