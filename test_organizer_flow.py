"""
End-to-End Test Suite for Orbito Workshop Organizer System
Tests authentication, role-based access, workshop creation wizard,
certification uploads, admin approval/rejection workflows, and category integration.
"""

import sys
import io
import uuid
from fastapi.testclient import TestClient

from fastapi_server import app
from database import SessionLocal, Workshop, User

client = TestClient(app)

def run_tests():
    print("=" * 70)
    print("RUNNING ORBITO ORGANIZER END-TO-END TEST SUITE")
    print("=" * 70)

    # 1. Test Categories & Topics
    print("\n[1] Testing GET /api/categories...")
    res = client.get("/api/categories")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    categories = res.json()
    assert len(categories) == 7, f"Expected 7 categories, got {len(categories)}"
    print(f"✓ Retrieved 7 official categories with topics.")

    # 2. Test Sign Up as Organizer
    print("\n[2] Testing POST /api/auth/signup (Workshop Organizer)...")
    uid = uuid.uuid4().hex[:6]
    org_email = f"test_organizer_{uid}@orbito.io"
    signup_payload = {
        "fullName": "Prof. Alan Turing",
        "email": org_email,
        "password": "SecurePassword123!",
        "accountType": "organizer",
        "professionalTitle": "Foundational Computer Scientist"
    }
    res = client.post("/api/auth/signup", json=signup_payload)
    assert res.status_code == 200, f"Signup failed: {res.text}"
    org_data = res.json()
    org_token = org_data["token"]
    assert org_data["user"]["role"] == "organizer"
    print(f"✓ Successfully registered Workshop Organizer: {org_data['user']['fullName']} (role: {org_data['user']['role']})")

    # 3. Test Sign Up as Participant
    print("\n[3] Testing POST /api/auth/signup (Workshop Participant)...")
    part_email = f"test_participant_{uid}@orbito.io"
    res = client.post("/api/auth/signup", json={
        "fullName": "Grace Hopper",
        "email": part_email,
        "password": "SecurePassword123!",
        "accountType": "participant"
    })
    assert res.status_code == 200
    part_data = res.json()
    part_token = part_data["token"]
    assert part_data["user"]["role"] == "participant"
    print(f"✓ Successfully registered Workshop Participant (role: {part_data['user']['role']})")

    # 4. Test Log In
    print("\n[4] Testing POST /api/auth/login...")
    res = client.post("/api/auth/login", json={
        "email": org_email,
        "password": "SecurePassword123!"
    })
    assert res.status_code == 200
    login_data = res.json()
    assert login_data["user"]["role"] == "organizer"
    print(f"✓ Logged in organizer, token verified.")

    # Test Invalid Login
    res = client.post("/api/auth/login", json={
        "email": org_email,
        "password": "WrongPassword!"
    })
    assert res.status_code == 401
    print(f"✓ Invalid credentials properly rejected with 401.")

    # 5. Test File Upload (Certification document)
    print("\n[5] Testing POST /api/organizer/upload (PDF Certification)...")
    fake_pdf = io.BytesIO(b"%PDF-1.4 Fake PDF Certification Data for Testing...")
    res = client.post(
        "/api/organizer/upload",
        headers={"Authorization": f"Bearer {org_token}"},
        files={"file": ("credential_award.pdf", fake_pdf, "application/pdf")}
    )
    assert res.status_code == 200, f"Upload failed: {res.text}"
    upload_res = res.json()
    assert upload_res["fileUrl"].startswith("/uploads/")
    cert_url = upload_res["fileUrl"]
    print(f"✓ Uploaded certification file successfully: {cert_url}")

    # 6. Test Workshop Submission with Validation
    print("\n[6] Testing POST /api/organizer/workshops (Workshop Creation Wizard)...")
    # A) Test past date rejection
    res = client.post(
        "/api/organizer/workshops",
        headers={"Authorization": f"Bearer {org_token}"},
        json={
            "title": "Quantum Computing",
            "skillToTeach": "Quantum Logic",
            "categoryId": "tech-ai",
            "topicId": 1,
            "description": "A deep dive into quantum gates.",
            "workshopDate": "2020-01-01",  # Past date!
            "startTime": "10:00",
            "endTime": "12:00"
        }
    )
    assert res.status_code == 400
    print(f"✓ Past workshop date correctly rejected.")

    # B) Test valid workshop creation
    workshop_payload = {
        "title": "Autonomous AI Agents & Reasoning Systems",
        "skillToTeach": "LLM Agents & Multi-Agent Design",
        "categoryId": "tech-ai",
        "topicId": 2,  # Generative AI and Prompt Engineering
        "description": "Learn to design, orchestrate, and evaluate autonomous AI agent networks with tool execution.",
        "learningOutcomes": "Architect multi-agent systems\nImplement function calling loops\nBenchmark reasoning accuracy",
        "durationValue": 3.0,
        "durationUnit": "hours",
        "skillLevel": "Intermediate",
        "pricingType": "Paid",
        "price": 49.0,
        "currency": "USD",
        "format": "Online",
        "onlinePlatform": "Orbito Virtual Lab",
        "onlineMeetingLink": "https://meet.orbito.io/agent-lab-private-link",
        "workshopDate": "2026-11-20",
        "startTime": "14:00",
        "endTime": "17:00",
        "maxParticipants": 25,
        "status": "Pending Review",
        "skillsSummary": "10+ years designing AI cognitive architectures and LLM reasoning pipelines.",
        "certificationName": "Lead AI Architect Certification",
        "issuingOrganization": "AI Standards Council",
        "yearIssued": "2025",
        "certificationFileUrl": cert_url,
        "certificationFileName": "credential_award.pdf"
    }

    res = client.post(
        "/api/organizer/workshops",
        headers={"Authorization": f"Bearer {org_token}"},
        json=workshop_payload
    )
    assert res.status_code == 200, f"Create workshop failed: {res.text}"
    created_ws = res.json()
    ws_id = created_ws["workshopId"]
    assert created_ws["status"] == "Pending Review"
    print(f"✓ Workshop created: ID {ws_id}, Status: {created_ws['status']}")

    # 7. Check Organizer Dashboard List
    print("\n[7] Testing GET /api/organizer/workshops...")
    res = client.get(
        "/api/organizer/workshops",
        headers={"Authorization": f"Bearer {org_token}"}
    )
    assert res.status_code == 200
    my_workshops = res.json()
    assert any(w["id"] == ws_id for w in my_workshops)
    print(f"✓ Organizer retrieves their submitted workshops (Total: {len(my_workshops)}).")

    # 8. Verify Workshop is NOT visible in public listings while Pending Review
    print("\n[8] Verifying privacy: Pending workshop must NOT appear in public catalog...")
    res = client.get("/api/workshops?category=tech-ai")
    assert res.status_code == 200
    public_ws = res.json()
    assert not any(w["id"] == ws_id for w in public_ws)
    print(f"✓ Confirmed: Public catalog does NOT show pending workshop.")

    # 9. Admin Review Workflow
    print("\n[9] Testing Admin Review & Publication Workflow...")
    # Admin login
    res = client.post("/api/auth/login", json={
        "email": "admin@orbito.com",
        "password": "admin123"
    })
    assert res.status_code == 200
    admin_token = res.json()["token"]

    # Admin lists submissions
    res = client.get("/api/admin/workshops", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    admin_submissions = res.json()
    assert any(w["id"] == ws_id for w in admin_submissions)
    print(f"✓ Admin retrieved submissions list and located {ws_id}.")

    # Admin approves and publishes workshop
    print("Approving and publishing workshop...")
    res = client.put(
        f"/api/admin/workshops/{ws_id}/status",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"action": "approve"}
    )
    assert res.status_code == 200
    assert res.json()["newStatus"] == "Published"
    print(f"✓ Status updated to Published!")

    # 10. Verify Automatic Category Integration: now visible publicly!
    print("\n[10] Testing Automatic Category Integration in Public API...")
    res = client.get("/api/workshops?category=tech-ai")
    assert res.status_code == 200
    public_tech_workshops = res.json()
    matched = next((w for w in public_tech_workshops if w["id"] == ws_id), None)
    assert matched is not None, "Newly published workshop should appear in Category Tech & AI!"
    assert matched["title"] == "Autonomous AI Agents & Reasoning Systems"
    assert matched["categoryName"] == "Technology and AI"
    assert matched["topicName"] == "Generative AI and Prompt Engineering"
    print(f"✓ SUCCESS: Workshop automatically appears under '{matched['categoryName']}' and '{matched['topicName']}'!")

    # 11. Test Rejection with Feedback Workflow
    print("\n[11] Testing Rejection with Reason Workflow...")
    # Create second workshop
    res = client.post(
        "/api/organizer/workshops",
        headers={"Authorization": f"Bearer {org_token}"},
        json={
            "title": "Improv Theatre for Beginners",
            "skillToTeach": "Improvisation",
            "categoryId": "social-outdoor",
            "topicId": 44,
            "description": "Have fun and master spontaneous acting.",
            "workshopDate": "2026-11-28",
            "startTime": "18:00",
            "endTime": "20:00",
            "status": "Pending Review"
        }
    )
    assert res.status_code == 200
    ws2_id = res.json()["workshopId"]

    # Admin rejects it
    rejection_reason = "Please provide verified acting or teaching credentials and more venue info."
    res = client.put(
        f"/api/admin/workshops/{ws2_id}/status",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"action": "reject", "reason": rejection_reason}
    )
    assert res.status_code == 200
    assert res.json()["newStatus"] == "Rejected"

    # Organizer retrieves it and inspects notes
    res = client.get(f"/api/organizer/workshops/{ws2_id}", headers={"Authorization": f"Bearer {org_token}"})
    assert res.status_code == 200
    ws2_data = res.json()
    assert ws2_data["status"] == "Rejected"
    assert ws2_data["adminNotes"] == rejection_reason
    print(f"✓ Rejection workflow verified: organizer receives rejection reason: '{ws2_data['adminNotes']}'.")

    # 12. Non-owner permission check
    print("\n[12] Testing Authorization Guards: Non-owner cannot modify workshop...")
    res = client.put(
        f"/api/organizer/workshops/{ws_id}",
        headers={"Authorization": f"Bearer {part_token}"},  # Grace Hopper (participant)
        json=workshop_payload
    )
    assert res.status_code == 403
    print(f"✓ Unauthorized modification blocked with 403 Forbidden.")

    print("\n" + "=" * 70)
    print("ALL TESTS PASSED! WORKSHOP ORGANIZER SYSTEM FULLY VERIFIED.")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
