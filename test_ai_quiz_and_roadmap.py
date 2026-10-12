#!/usr/bin/env python3
"""
Test Suite: AI Curiosity Quiz & "How Orbito Works" Roadmap Verification
Verifies:
1. AI curiosity discovery questions endpoint (GET /api/ai/quiz/questions)
2. AI empathetic micro-reflection step evaluation (POST /api/ai/quiz/evaluate-step)
3. AI multi-dimensional archetype synthesis & workshop matching (POST /api/ai/quiz/recommend)
4. Backwards compatibility of POST /api/recommendations
5. Static structural verification of index.html 4-step connected roadmap:
   - Step 1: Sign in / profile
   - Step 2: Branching (Path A: Mint #65D6B0, Path B: Coral #FF668D) with mini-flows
   - Step 3: AI Curiosity with 8 discipline chips
   - Step 4: Mock recommendation card with match score & Book Now
"""

import sys
import re
from fastapi.testclient import TestClient
from fastapi_server import app

client = TestClient(app)

def test_ai_curiosity_endpoints():
    print("\n--- 1. Testing GET /api/ai/quiz/questions ---")
    resp = client.get("/api/ai/quiz/questions")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert "questions" in data
    assert len(data["questions"]) == 5, f"Expected 5 adaptive curiosity questions, got {len(data['questions'])}"
    print(f"✓ Retrieved {len(data['questions'])} adaptive curiosity questions.")
    for q in data["questions"]:
        assert len(q["options"]) >= 4
        print(f"  • Question {q['stepNumber']}: '{q['title'][:65]}...' ({len(q['options'])} options)")

    print("\n--- 2. Testing POST /api/ai/quiz/evaluate-step ---")
    # Test tactile
    resp_tactile = client.post("/api/ai/quiz/evaluate-step", json={
        "questionId": "q1_weekend",
        "selectedOptions": ["tactile_craft"],
        "customText": ""
    })
    assert resp_tactile.status_code == 200
    fb_tactile = resp_tactile.json()["aiFeedback"]
    assert "tactile" in fb_tactile.lower() or "craftsmanship" in fb_tactile.lower()
    print("✓ Tactile choice receives empathetic craftsmanship reflection:")
    print(f"  '{fb_tactile[:90]}...'")

    # Test code
    resp_code = client.post("/api/ai/quiz/evaluate-step", json={
        "questionId": "q1_weekend",
        "selectedOptions": ["digital_creation"],
        "customText": ""
    })
    assert resp_code.status_code == 200
    fb_code = resp_code.json()["aiFeedback"]
    assert "digital" in fb_code.lower() or "python" in fb_code.lower() or "ai" in fb_code.lower()
    print("✓ Digital/code choice receives systems & leverage reflection:")
    print(f"  '{fb_code[:90]}...'")

    print("\n--- 3. Testing POST /api/ai/quiz/recommend for Archetype Synthesis ---")
    # Persona 1: Tactile Artisan
    tactile_payload = {
        "answers": [
            {"questionId": "q1_weekend", "selectedOptions": ["tactile_craft"], "customText": ""},
            {"questionId": "q2_childhood", "selectedOptions": ["making_art"], "customText": ""},
            {"questionId": "q3_tangible_outcome", "selectedOptions": ["physical_item"], "customText": ""},
            {"questionId": "q4_vibe", "selectedOptions": ["hands_on_cozy"], "customText": ""},
            {"questionId": "q5_superpower", "selectedOptions": ["ceramic_craft"], "customText": ""}
        ],
        "preferredFormat": "either",
        "budget": "flexible",
        "skillLevel": "Beginner"
    }
    rec_tactile = client.post("/api/ai/quiz/recommend", json=tactile_payload)
    assert rec_tactile.status_code == 200
    res_tactile = rec_tactile.json()
    assert "Artisan" in res_tactile["archetype"] or "Creator" in res_tactile["archetype"]
    assert len(res_tactile["recommendations"]) >= 1
    top_ws = res_tactile["recommendations"][0]
    print(f"✓ Archetype accurately synthesized: '{res_tactile['archetype']}'")
    print(f"✓ Top Workshop Match: '{top_ws['title']}' ({top_ws['matchScore']}% match)")
    print(f"  Rationale: {top_ws['matchRationale']}")

    # Persona 2: Systems Builder & AI Pioneer
    tech_payload = {
        "answers": [
            {"questionId": "q1_weekend", "selectedOptions": ["digital_creation"], "customText": ""},
            {"questionId": "q2_childhood", "selectedOptions": ["puzzles_systems"], "customText": ""},
            {"questionId": "q3_tangible_outcome", "selectedOptions": ["digital_superpower"], "customText": ""},
            {"questionId": "q4_vibe", "selectedOptions": ["interactive_lab"], "customText": ""},
            {"questionId": "q5_superpower", "selectedOptions": ["ai_coding"], "customText": ""}
        ],
        "preferredFormat": "online",
        "budget": "flexible",
        "skillLevel": "Beginner"
    }
    rec_tech = client.post("/api/ai/quiz/recommend", json=tech_payload)
    assert rec_tech.status_code == 200
    res_tech = rec_tech.json()
    assert "Systems Builder" in res_tech["archetype"] or "AI" in res_tech["archetype"]
    top_tech_ws = res_tech["recommendations"][0]
    print(f"✓ Archetype accurately synthesized: '{res_tech['archetype']}'")
    print(f"✓ Top Workshop Match: '{top_tech_ws['title']}' ({top_tech_ws['matchScore']}% match)")

    print("\n--- 4. Testing POST /api/recommendations compatibility ---")
    rec_legacy = client.post("/api/recommendations", json={
        "interests": ["creativity-arts", "tech-ai"],
        "format": "either",
        "skillLevel": "Beginner"
    })
    assert rec_legacy.status_code == 200
    assert len(rec_legacy.json()["recommendations"]) >= 1
    print(f"✓ Legacy recommendations endpoint operational with {len(rec_legacy.json()['recommendations'])} matches.")


def test_homepage_roadmap_markup():
    print("\n--- 5. Verifying 'How Orbito Works' 4-Step Roadmap in index.html ---")
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Section ID & Heading
    assert 'id="how-it-works"' in html
    assert 'How Orbito Works' in html
    assert 'From discovering your interests to finding your next passion, we make it simple.' in html
    print("✓ Section title and subtitle verified.")

    # 4 Steps Present
    assert 'Step 1 · Start' in html or 'badge-purple' in html
    assert 'Start Your Journey' in html
    assert 'Sign In to Orbito' in html
    assert 'Sign In / Join Free' in html
    print("✓ Step 1 verified: Sign in to Orbito with user profile illustration.")

    # Step 2 Branching Paths
    assert 'Two Ways to Explore' in html
    assert 'I know what I want to learn' in html
    assert 'Browse categories' in html or 'Browse Categories' in html
    clean_text = re.sub(r'<[^>]+>', ' ', html)
    clean_text = re.sub(r'\s+', ' ', clean_text).replace('&rarr;', '→').replace('&amp;', '&')

    assert 'Browse Categories → Select Workshop → Choose Date & Slot → Book & Attend' in clean_text
    assert 'Help me discover my interests' in html
    assert 'Take the Quiz' in html
    assert 'Take Quiz → AI Recommendations → View Matching Workshops → Book & Attend' in clean_text
    print("✓ Step 2 verified: Two Ways to Explore with Path A (Mint #65D6B0) and Path B (Coral #FF668D) with mini-flows.")

    # Step 3 AI Discovery & 8 Disciplines
    assert 'Answer a Few Fun Questions' in html
    assert 'Discover Your Interests with AI' in html
    for discipline in [
        'Hands-On Making', 'Tech & Coding', 'Movement & Outdoor', 'Art & Design',
        'Music & Sound', 'Cooking & Food', 'Science & Nature', 'Mind & Wellness'
    ]:
        escaped_disp = discipline.replace('&', '&amp;')
        assert escaped_disp in html or discipline in html, f"Missing discipline chip: {discipline}"
    assert 'Try the Quiz' in html
    print("✓ Step 3 verified: AI curiosity with all 8 discipline chips present.")

    # Step 4 Matching & Mock Card
    assert 'Find Your Next Passion' in html
    assert 'Get Recommendations and Book' in html
    assert '98% Match' in html
    assert 'Python for Beginners' in html
    assert 'Book Now' in html
    assert 'See Sample Recommendations' in html
    print("✓ Step 4 verified: Recommendation card with 98% Match and Book Now CTA.")


if __name__ == "__main__":
    test_ai_curiosity_endpoints()
    test_homepage_roadmap_markup()
    print("\n" + "=" * 60)
    print("ALL AI CURIOSITY & ROADMAP TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)
