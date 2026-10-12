/**
 * Orbito - API Client & Integration Layer
 * Connects to Python FastAPI backend with intelligent fallback to local demo data
 *
 * Configurable Base URL for FastAPI:
 * http://127.0.0.1:8000
 */

const API_BASE_URL = "http://127.0.0.1:8000";

// Set to false to strictly require the live backend without fallback
const ALLOW_MOCK_FALLBACK = true;

// Track active API mode for user transparency
const ApiState = {
  isLive: false,
  lastChecked: null,
  statusMessage: "Checking API connection..."
};

function getAuthToken() {
  try {
    return localStorage.getItem("orbito_token") || "";
  } catch (e) {
    return "";
  }
}

function setAuthToken(token) {
  try {
    if (token) localStorage.setItem("orbito_token", token);
    else localStorage.removeItem("orbito_token");
  } catch (e) {}
}

/**
 * Generic request helper with timeout and graceful fallback
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutMs = options.timeout || (options.body instanceof FormData ? 15000 : 5000);
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    Accept: "application/json",
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set application/json if not sending FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = (data && data.detail) || `API Error: ${response.status} ${response.statusText}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.detail = errorMsg;
      throw err;
    }

    ApiState.isLive = true;
    ApiState.statusMessage = "Connected to Live FastAPI Backend";
    return { data, isLive: true };
  } catch (err) {
    clearTimeout(timeoutId);

    // If it's an explicit 4xx error from the backend, don't mask it as "backend offline"
    if (err.status && err.status >= 400 && err.status < 500) {
      ApiState.isLive = true;
      throw err;
    }

    ApiState.isLive = false;
    ApiState.statusMessage = `Demo Mode (Backend offline: ${err.message || "Connection refused"})`;

    if (!ALLOW_MOCK_FALLBACK || options.strictLive) {
      throw err;
    }
    return { data: null, isLive: false, error: err };
  }
}

/**
 * Auth API: Sign Up
 * POST /api/auth/signup
 */
async function apiSignup(fullName, email, password, accountType = "participant", professionalTitle = "") {
  const payload = {
    fullName,
    email,
    password,
    accountType,
    professionalTitle: professionalTitle || null
  };

  const result = await apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
    strictLive: true
  });

  if (result.data && result.data.token) {
    setAuthToken(result.data.token);
  }
  return result.data;
}

/**
 * Auth API: Log In
 * POST /api/auth/login
 */
async function apiLogin(email, password) {
  const payload = { email, password };
  const result = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    strictLive: true
  });

  if (result.data && result.data.token) {
    setAuthToken(result.data.token);
  }
  return result.data;
}

/**
 * Auth API: Get Current Profile
 * GET /api/auth/me
 */
async function apiGetMe() {
  const result = await apiRequest("/api/auth/me", { method: "GET" });
  return result.data;
}

/**
 * Fetch all categories with topics
 * GET /api/categories
 */
async function fetchCategories() {
  const result = await apiRequest("/api/categories", { method: "GET" });
  if (result.isLive && result.data) {
    return { categories: result.data, isLive: true };
  }
  // Fallback to local master data
  return { categories: window.ORBITO_CATEGORIES || [], isLive: false };
}

/**
 * Fetch topics for category
 * GET /api/categories/{id}/topics
 */
async function fetchCategoryTopics(categoryId) {
  const result = await apiRequest(`/api/categories/${categoryId}/topics`, { method: "GET" });
  if (result.isLive && result.data) {
    return { topics: result.data, isLive: true };
  }
  const cat = (window.ORBITO_CATEGORIES || []).find(c => c.id === categoryId);
  return { topics: (cat && cat.topics) || [], isLive: false };
}

/**
 * Fetch workshops with optional filters
 * GET /api/workshops?category=...&format=...&level=...&price=...&search=...&sort=...
 */
async function fetchWorkshops(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") params.append("category", filters.category);
  if (filters.format && filters.format !== "all") params.append("format", filters.format);
  if (filters.level && filters.level !== "all") params.append("level", filters.level);
  if (filters.price && filters.price !== "all") params.append("price", filters.price);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.topic) params.append("topic", filters.topic);

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  const result = await apiRequest(`/api/workshops${queryStr}`, { method: "GET" });

  if (result.isLive && result.data) {
    return { workshops: result.data, isLive: true };
  }

  // Local fallback filtering
  let workshops = [...(window.SAMPLE_WORKSHOPS || [])];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    workshops = workshops.filter(
      w =>
        w.title.toLowerCase().includes(q) ||
        w.topicName.toLowerCase().includes(q) ||
        w.categoryName.toLowerCase().includes(q) ||
        w.shortDescription.toLowerCase().includes(q) ||
        (w.instructor && w.instructor.name && w.instructor.name.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== "all") {
    workshops = workshops.filter(w => w.categoryId === filters.category);
  }

  if (filters.topic) {
    const topicNorm = filters.topic.toLowerCase().trim();
    workshops = workshops.filter(
      w =>
        w.topicName.toLowerCase() === topicNorm ||
        String(w.topicId) === String(filters.topic)
    );
  }

  if (filters.format && filters.format !== "all") {
    workshops = workshops.filter(w => w.format === filters.format);
  }

  if (filters.level && filters.level !== "all") {
    workshops = workshops.filter(w => w.level === filters.level);
  }

  if (filters.price && filters.price !== "all") {
    if (filters.price === "free") {
      workshops = workshops.filter(w => w.price === 0);
    } else if (filters.price === "paid") {
      workshops = workshops.filter(w => w.price > 0);
    }
  }

  // Sorting
  if (filters.sort === "price-low") {
    workshops.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-high") {
    workshops.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "rating") {
    workshops.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    workshops.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return { workshops, isLive: false };
}

/**
 * Fetch single workshop by ID
 * GET /api/workshops/{id}
 */
async function fetchWorkshopById(id) {
  const result = await apiRequest(`/api/workshops/${id}`, { method: "GET" });
  if (result.isLive && result.data) {
    return { workshop: result.data, isLive: true };
  }

  const workshop = (window.SAMPLE_WORKSHOPS || []).find(w => w.id === id);
  return { workshop: workshop || null, isLive: false };
}

/**
 * Submit quiz answers and get personalized recommendations
 * POST /api/recommendations
 */
async function fetchRecommendations(payload) {
  const result = await apiRequest("/api/recommendations", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (result.isLive && result.data) {
    return { ...result.data, isLive: true };
  }

  return {
    recommendations: (window.SAMPLE_WORKSHOPS || []).slice(0, 4).map(w => ({
      ...w,
      matchScore: 92,
      matchRationale: `Matches your chosen focus on ${w.categoryName}.`
    })),
    userProfileSummary: "Analyzed your interests across selected workshop disciplines.",
    isLive: false
  };
}

/**
 * Fetch AI curiosity quiz questions for users discovering latent interests
 * GET /api/ai/quiz/questions
 */
async function fetchAIQuizQuestions() {
  const result = await apiRequest("/api/ai/quiz/questions", { method: "GET" });
  if (result.isLive && result.data && result.data.questions) {
    return { ...result.data, isLive: true };
  }

  // Graceful local fallback questions
  return {
    title: "Orbito AI Curiosity Engine",
    subtitle: "Discover your latent passions through adaptive curiosity questions",
    totalQuestions: 5,
    questions: [
      {
        id: "q1_weekend",
        stepNumber: 1,
        title: "When you have an unstructured morning with zero obligations, what naturally pulls your attention?",
        hint: "Pick the choices that feel effortless or energizing, or type your own thoughts below.",
        options: [
          { id: "tactile_craft", label: "Working with my hands", desc: "Cooking, pottery, building, fixing, or organizing physical items" },
          { id: "digital_creation", label: "Behind a screen exploring", desc: "Coding, gaming, tinkering with software, digital tools, AI" },
          { id: "nature_body", label: "Being outdoors & moving", desc: "Walking in nature, park strolls, sports, breathing fresh air" },
          { id: "social_talk", label: "Conversations & community", desc: "Meeting people, sharing stories, discussing new ideas" },
          { id: "inner_calm", label: "Unwinding & quiet focus", desc: "Stretching, mindfulness, reading, calming music, journaling" }
        ]
      },
      {
        id: "q2_childhood",
        stepNumber: 2,
        title: "Think back to when you lost track of time. What kind of activity were you immersed in?",
        hint: "Natural flow states hold the truest clues to our genuine, hidden interests.",
        options: [
          { id: "making_art", label: "Drawing, sketching, sculpting, or coloring", desc: "Creating visual compositions, admiring shapes & colors" },
          { id: "puzzles_systems", label: "Solving riddles, puzzles & building systems", desc: "Legos, logic challenges, video game mechanics, curiosity about how things work" },
          { id: "exploring_outside", label: "Exploring neighborhoods & collecting things", desc: "Observing animals, discovering hidden spots, outdoor adventures" },
          { id: "acting_speaking", label: "Expressing ideas & performing", desc: "Putting on plays, public sharing, persuading others, storytelling" },
          { id: "baking_sensory", label: "Baking, tasting, & sensory kitchen fun", desc: "Baking treats, mixing recipes, smelling fresh spices" }
        ]
      },
      {
        id: "q3_tangible_outcome",
        stepNumber: 3,
        title: "At the end of a 3-hour learning experience, what reward would make you smile brightest?",
        hint: "What feels most deeply satisfying to take away with you?",
        options: [
          { id: "physical_item", label: "Holding a physical handcrafted object", desc: "A ceramic cup, sculpted bowl, or handcrafted keepsake to display on your desk" },
          { id: "digital_superpower", label: "A working automated program or app", desc: "A working Python script or AI workflow that solves real problems" },
          { id: "calm_body", label: "A relaxed body & crystal-clear mind", desc: "Feeling tension melt away with breathwork and postural rejuvenation" },
          { id: "speaking_charisma", label: "Confidence to speak and pitch anywhere", desc: "Never fearing public speaking again and knowing how to captivate people" },
          { id: "nature_photos", label: "A gallery of stunning outdoor photography", desc: "Visual memories capturing light, nature, and community perspective" }
        ]
      },
      {
        id: "q4_vibe",
        stepNumber: 4,
        title: "What setting and social vibe gives you the greatest learning energy?",
        hint: "There are no wrong answers — this helps Orbito match your learning temperament.",
        options: [
          { id: "hands_on_cozy", label: "Warm, hands-on studio with tactile materials", desc: "Getting hands messy with clay, aprons, tools, and a friendly cohort" },
          { id: "interactive_lab", label: "Live virtual interactive lab with screen sharing", desc: "Comfort of your desk with live instructor guidance and shared code sandbox" },
          { id: "outdoor_walk", label: "Fresh air outdoor expedition", desc: "Moving together through green parks or urban architectural streets" },
          { id: "supportive_cohort", label: "Supportive small group sharing presentations", desc: "Safe space to practice voice, body language, and constructive feedback" }
        ]
      },
      {
        id: "q5_superpower",
        stepNumber: 5,
        title: "If you could wake up tomorrow with one brand new skill, which would you pick?",
        hint: "Your intuitive impulse reveals what your brain is most eager to master right now.",
        options: [
          { id: "ai_coding", label: "Building smart AI tools & writing code effortlessly", desc: "Turning ideas into running software in minutes" },
          { id: "ceramic_craft", label: "Mastering wheel pottery & sculpting with clay", desc: "Translating pure imagination into tangible ceramic art" },
          { id: "charismatic_speech", label: "Commanding any room with magnetic storytelling", desc: "Inspiring audiences, nailing pitches, and speaking with zero anxiety" },
          { id: "inner_zen", label: "Deep nervous system mastery, breath control & vitality", desc: "Turning stress off on command and maintaining calm energy all day" },
          { id: "visual_lens", label: "Eye of an artist: capturing breathtaking street & nature photography", desc: "Seeing hidden beauty everywhere through light and composition" },
          { id: "nocode_apps", label: "Building real web apps without code", desc: "Launching functional interactive digital products overnight" }
        ]
      }
    ],
    isLive: false
  };
}

/**
 * Provide real-time AI micro-reflection for a single answer step
 * POST /api/ai/quiz/evaluate-step
 */
async function evaluateAIQuizStep(payload) {
  const result = await apiRequest("/api/ai/quiz/evaluate-step", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (result.isLive && result.data && result.data.aiFeedback) {
    return { aiFeedback: result.data.aiFeedback, isLive: true };
  }

  // Local fallback micro-reflection
  const combined = (payload.selectedOptions || []).join(" ") + " " + (payload.customText || "");
  const lower = combined.toLowerCase();

  let feedback = "Noted! Your answer adds key coordinates to your emerging curiosity map.";
  if (lower.includes("tactile") || lower.includes("hands") || lower.includes("ceramic") || lower.includes("pottery") || lower.includes("clay")) {
    feedback = "Fascinating choice! A strong tactile pull is a classic marker of tangible craftsmanship. Stepping away from digital screens to shape physical materials will deeply refresh your mental state.";
  } else if (lower.includes("digital") || lower.includes("code") || lower.includes("ai") || lower.includes("puzzles")) {
    feedback = "Great instinct! Your curiosity leans toward digital architecture and leverage. Learning Python or Generative AI gives you immediate creative power to build automated solutions.";
  } else if (lower.includes("nature") || lower.includes("outdoor") || lower.includes("walk") || lower.includes("photo")) {
    feedback = "Inspiring signal! You recharge through open horizons, natural light, and physical movement. Outdoor labs combining exploration with photography will be a natural match.";
  } else if (lower.includes("speaking") || lower.includes("speech") || lower.includes("social") || lower.includes("story")) {
    feedback = "Powerful revelation! Developing vocal confidence and storytelling structure unlocks tremendous personal magnetism and professional influence.";
  } else if (lower.includes("calm") || lower.includes("zen") || lower.includes("breath") || lower.includes("yoga") || lower.includes("wellness")) {
    feedback = "Deeply insightful! In our hyper-stimulated world, cultivating nervous system regulation and restorative mindfulness provides the vital foundation for all learning.";
  }

  return { aiFeedback: feedback, isLive: false };
}

/**
 * Send full AI quiz session to AI matching engine
 * POST /api/ai/quiz/recommend
 */
async function fetchAIQuizRecommendations(payload) {
  const result = await apiRequest("/api/ai/quiz/recommend", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (result.isLive && result.data && result.data.recommendations) {
    return { ...result.data, isLive: true };
  }

  // Local fallback recommendation generation
  const allChoices = (payload.answers || []).flatMap(a => a.selectedOptions || []);
  let archetype = "The Tactile Artisan & Visual Creator";
  let tagline = "Thrives in sensory flow states, hands-on crafting, and bringing visual imagination to physical reality.";
  let primaryCat = "Creativity and Arts";

  if (allChoices.some(c => c.includes("ai") || c.includes("digital") || c.includes("puzzles"))) {
    archetype = "The Curious Systems Builder & AI Pioneer";
    tagline = "Driven by logic, puzzle-solving, scalable automation, and crafting intelligent digital tools.";
    primaryCat = "Technology and AI";
  } else if (allChoices.some(c => c.includes("nature") || c.includes("outdoor") || c.includes("photo"))) {
    archetype = "The Naturalist & Community Chronicler";
    tagline = "Recharged by open air, nature immersion, urban exploration, and visual storytelling.";
    primaryCat = "Social and Outdoor Activities";
  } else if (allChoices.some(c => c.includes("speaking") || c.includes("speech") || c.includes("social"))) {
    archetype = "The Expressive Leader & Persuasive Storyteller";
    tagline = "Passionate about human connection, vocal magnetism, confident presentation, and inspiring cohorts.";
    primaryCat = "Career and Professional Skills";
  } else if (allChoices.some(c => c.includes("calm") || c.includes("zen") || c.includes("body"))) {
    archetype = "The Mindful Vitality & Restorative Explorer";
    tagline = "Seeks balance, somatic mindfulness, stress relief, and holistic mind-body vitality.";
    primaryCat = "Lifestyle and Wellness";
  }

  const sampleWorkshops = window.SAMPLE_WORKSHOPS || [];
  const scored = sampleWorkshops.map((w, idx) => ({
    ...w,
    matchScore: 98 - (idx * 4),
    matchRationale: `Recommended based on your discovered archetype '${archetype}' and affinity for ${w.categoryName}.`
  }));

  return {
    archetype,
    archetypeTagline: tagline,
    primaryCategoryName: primaryCat,
    userProfileSummary: `Our AI Curiosity Engine identified your profile as '${archetype}'. ${tagline}`,
    recommendations: scored.slice(0, 6),
    isLive: false
  };
}

/**
 * Register for workshop
 * POST /api/registrations
 */
async function submitRegistration(payload) {
  const result = await apiRequest("/api/registrations", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (result.isLive && result.data) {
    return { success: true, registration: result.data, isLive: true };
  }

  const confirmationNumber = "ORB-" + Math.floor(100000 + Math.random() * 900000);
  return {
    success: true,
    registration: {
      registrationId: confirmationNumber,
      workshopId: payload.workshopId,
      fullName: payload.fullName,
      email: payload.email,
      registeredAt: new Date().toISOString(),
      status: "Confirmed (Demo Mode)"
    },
    isLive: false
  };
}

// ---------------------------------------------------------------------------
// Organizer API Methods
// ---------------------------------------------------------------------------
async function apiFetchOrganizerWorkshops() {
  const result = await apiRequest("/api/organizer/workshops", {
    method: "GET",
    strictLive: true
  });
  return result.data || [];
}

async function apiCreateWorkshop(workshopData) {
  const result = await apiRequest("/api/organizer/workshops", {
    method: "POST",
    body: JSON.stringify(workshopData),
    strictLive: true
  });
  return result.data;
}

async function apiGetWorkshopForEdit(workshopId) {
  const result = await apiRequest(`/api/organizer/workshops/${workshopId}`, {
    method: "GET",
    strictLive: true
  });
  return result.data;
}

async function apiUpdateWorkshop(workshopId, workshopData) {
  const result = await apiRequest(`/api/organizer/workshops/${workshopId}`, {
    method: "PUT",
    body: JSON.stringify(workshopData),
    strictLive: true
  });
  return result.data;
}

async function apiDeleteWorkshop(workshopId) {
  const result = await apiRequest(`/api/organizer/workshops/${workshopId}`, {
    method: "DELETE",
    strictLive: true
  });
  return result.data;
}

async function apiUploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiRequest("/api/organizer/upload", {
    method: "POST",
    body: formData,
    strictLive: true
  });
  return result.data;
}

// ---------------------------------------------------------------------------
// Admin API Methods
// ---------------------------------------------------------------------------
async function apiFetchAdminWorkshops() {
  const result = await apiRequest("/api/admin/workshops", {
    method: "GET",
    strictLive: true
  });
  return result.data || [];
}

async function apiUpdateWorkshopStatus(workshopId, action, reason = "") {
  const result = await apiRequest(`/api/admin/workshops/${workshopId}/status`, {
    method: "PUT",
    body: JSON.stringify({ action, reason }),
    strictLive: true
  });
  return result.data;
}

// Global export
if (typeof window !== "undefined") {
  window.OrbitoAPI = {
    API_BASE_URL,
    ApiState,
    getAuthToken,
    setAuthToken,
    apiSignup,
    apiLogin,
    apiGetMe,
    fetchCategories,
    fetchCategoryTopics,
    fetchWorkshops,
    fetchWorkshopById,
    fetchRecommendations,
    fetchAIQuizQuestions,
    evaluateAIQuizStep,
    fetchAIQuizRecommendations,
    submitRegistration,
    apiFetchOrganizerWorkshops,
    apiCreateWorkshop,
    apiGetWorkshopForEdit,
    apiUpdateWorkshop,
    apiDeleteWorkshop,
    apiUploadFile,
    apiFetchAdminWorkshops,
    apiUpdateWorkshopStatus
  };
}
