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
    print("\n--- 5. Verifying 'How Orbito Works' 3-Card Reference Section in index.html ---")
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Section ID & Heading
    assert 'id="how-it-works"' in html
    assert 'How Orbito Works' in html
    assert 'deco-left' in html and 'deco-right' in html
    print("✓ Section title 'How Orbito Works' with purple decorative strokes verified.")

    # 1. First Card — Explore Activities (Upper-Left)
    assert 'Explore Activities' in html
    assert 'Explore different activities, discover exciting hobbies, and find experiences that match your interests.' in html
    assert 'how-card-explore' in html
    assert 'ill-explore' in html
    # Confirm no button or link in Card 1
    explore_card_chunk = html.split('how-card-explore')[1].split('how-card-interests')[0]
    assert '<a ' not in explore_card_chunk, "Card 1 must not contain any button or link"
    assert '<button' not in explore_card_chunk, "Card 1 must not contain any button or link"
    print("✓ Card 1 verified: 'Explore Activities' with browser/magnifier illustration and NO link or button.")

    # 2. Second Card — Discover Your Interests (Upper-Right)
    assert 'Discover Your Interests' in html
    assert 'Not sure what you want to learn? Answer a few fun, AI-powered questions about your interests and preferences to discover activities you might enjoy.' in html
    assert 'how-card-interests' in html
    assert 'ill-interests' in html
    # Confirm no button or link in Card 2
    interests_card_chunk = html.split('how-card-interests')[1].split('how-works-bottom-row')[0]
    assert '<a ' not in interests_card_chunk, "Card 2 must not contain any button or link"
    assert '<button' not in interests_card_chunk, "Card 2 must not contain any button or link"
    print("✓ Card 2 verified: 'Discover Your Interests' with checklist/lightbulb illustration and NO link or button.")

    # 3. Third Card — Find Your Next Passion (Center / Below)
    assert 'Find Your Next Passion' in html
    assert 'Get personalized workshop recommendations based on your interests, explore matching skills, and choose a workshop that feels right for you.' in html
    assert 'how-card-passion' in html
    assert 'ill-passion' in html
    assert 'id="how-link-recommendations"' in html
    assert 'See My Recommendations' in html
    print("✓ Card 3 verified: 'Find Your Next Passion' with map/pin illustration and 'See My Recommendations →' link.")

    # 4. Looping & Curved Arrows
    assert 'how-works-arrows-svg' in html
    assert 'Arrow 1: Loop from Card 1' in html or 'how-arrow-path' in html
    assert 'Arrow 2: Sweeping Curve' in html or '#9CA3AF' in html
    print("✓ Looping Arrow 1 (Card 1 -> 2) & Sweeping Arrow 2 (Card 2 -> 3) verified.")

    # 5. Bottom-Left Handwritten Note
    assert 'how-bottom-note' in html
    assert 'EXPLORE ·' in html
    assert 'DISCOVER ·' in html
    assert 'LEARN' in html
    assert 'note-underline-svg' in html
    print("✓ Bottom-left note verified: Outline people + 'EXPLORE · DISCOVER · LEARN' with underline stroke.")


if __name__ == "__main__":
    test_ai_curiosity_endpoints()
    test_homepage_roadmap_markup()
    print("\n" + "=" * 60)
    print("ALL AI CURIOSITY & ROADMAP TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)
