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

/**
 * Generic request helper with timeout and graceful fallback
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast fallback

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    ApiState.isLive = true;
    ApiState.statusMessage = "Connected to Live FastAPI Backend";
    return { data, isLive: true };
  } catch (err) {
    clearTimeout(timeoutId);
    ApiState.isLive = false;
    ApiState.statusMessage = `Demo Mode (Backend offline: ${err.message || "Connection refused"})`;

    if (!ALLOW_MOCK_FALLBACK) {
      throw err;
    }
    return { data: null, isLive: false, error: err };
  }
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
        w.instructor.name.toLowerCase().includes(q) ||
        (w.tags && w.tags.some(t => t.toLowerCase().includes(q)))
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

  if (filters.dateRange && filters.dateRange !== "all") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    workshops = workshops.filter(w => {
      const wDate = new Date(w.date);
      const diffDays = Math.ceil((wDate - today) / (1000 * 60 * 60 * 24));

      if (filters.dateRange === "today") return diffDays === 0;
      if (filters.dateRange === "weekend") {
        const dayOfWeek = wDate.getDay();
        return (dayOfWeek === 0 || dayOfWeek === 6) && diffDays >= 0 && diffDays <= 7;
      }
      if (filters.dateRange === "7days") return diffDays >= 0 && diffDays <= 7;
      if (filters.dateRange === "30days") return diffDays >= 0 && diffDays <= 30;
      return true;
    });
  }

  // Sorting
  if (filters.sort === "price-low") {
    workshops.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-high") {
    workshops.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "rating") {
    workshops.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // Default: upcoming by date
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

  // Fallback to local
  const workshop = (window.SAMPLE_WORKSHOPS || []).find(w => w.id === id);
  return { workshop: workshop || null, isLive: false };
}

/**
 * Submit quiz answers and get personalized recommendations
 * POST /api/recommendations
 *
 * Payload: {
 *   interests: string[],
 *   goals: string[],
 *   learningStyle: string,
 *   skillLevel: string,
 *   format: string,
 *   budget: string,
 *   availability: string
 * }
 */
async function fetchRecommendations(quizPayload) {
  const result = await apiRequest("/api/recommendations", {
    method: "POST",
    body: JSON.stringify(quizPayload)
  });

  if (result.isLive && result.data) {
    return { recommendations: result.data, isLive: true };
  }

  // High-fidelity local recommendation algorithm
  const allWorkshops = window.SAMPLE_WORKSHOPS || [];
  const scored = allWorkshops.map(workshop => {
    let score = 50; // base score
    const rationales = [];

    // Category match (+25 pts)
    const interests = quizPayload.interests || [];
    const categoryMatches = interests.some(interestCat => {
      return (
        workshop.categoryId.toLowerCase().includes(interestCat.toLowerCase()) ||
        workshop.categoryName.toLowerCase().includes(interestCat.toLowerCase())
      );
    });

    if (categoryMatches) {
      score += 25;
      rationales.push(`Directly matches your interest in ${workshop.categoryName}`);
    }

    // Format preference (+15 pts)
    const prefFormat = (quizPayload.format || "either").toLowerCase();
    if (prefFormat === "either" || prefFormat.includes("either")) {
      score += 10;
    } else if (workshop.format === prefFormat) {
      score += 15;
      rationales.push(`Offered in your preferred ${workshop.format === "online" ? "Online" : "In-Person"} format`);
    } else {
      score -= 10;
    }

    // Skill level (+15 pts)
    const prefLevel = (quizPayload.skillLevel || "").toLowerCase();
    if (prefLevel.includes(workshop.level) || (prefLevel.includes("beginner") && workshop.level === "beginner")) {
      score += 15;
      rationales.push(`Tailored for your current experience level (${workshop.levelLabel})`);
    }

    // Budget preference (+10 pts)
    const prefBudget = (quizPayload.budget || "").toLowerCase();
    if (prefBudget.includes("free") && workshop.price === 0) {
      score += 15;
      rationales.push("Free of cost, matching your budget preference");
    } else if (prefBudget.includes("low-cost") && workshop.price <= 35) {
      score += 12;
      rationales.push(`Affordable access at ${workshop.priceLabel}`);
    } else if (prefBudget.includes("flexible")) {
      score += 10;
    }

    // Goals alignment (+10 pts)
    const goals = quizPayload.goals || [];
    if (goals.some(g => g.toLowerCase().includes("career")) && workshop.categoryId === "career-professional") {
      score += 10;
      rationales.push("Accelerates your professional and career advancement goals");
    }
    if (goals.some(g => g.toLowerCase().includes("hobby") || g.toLowerCase().includes("relax")) &&
       (workshop.categoryId === "creativity-arts" || workshop.categoryId === "lifestyle-wellness")) {
      score += 10;
      rationales.push("Perfect for exploring creative hobbies and mindful well-being");
    }
    if (goals.some(g => g.toLowerCase().includes("build")) &&
       (workshop.categoryId === "tech-ai" || workshop.categoryId === "emerging-practical" || workshop.categoryId === "entrepreneurship-finance")) {
      score += 10;
      rationales.push("Empowers you to build tangible projects and launch your ideas");
    }

    // Clamp score between 65 and 99
    score = Math.min(99, Math.max(65, Math.round(score)));

    // Fallback rationale if empty
    if (rationales.length === 0) {
      rationales.push(`Top-rated discovery in ${workshop.categoryName} with practical hands-on exercises`);
    }

    return {
      ...workshop,
      matchScore: score,
      matchRationale: rationales.slice(0, 2).join(". ") + "."
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.matchScore - a.matchScore);

  return {
    recommendations: scored.slice(0, 6),
    isLive: false,
    userProfileSummary: generateProfileSummary(quizPayload)
  };
}

/**
 * Generate human-friendly profile explanation based on quiz selections
 */
function generateProfileSummary(answers) {
  const interestList = (answers.interests || []).join(", ") || "Diverse Disciplines";
  const goalList = (answers.goals || []).join(" and ") || "broad learning";
  const formatText = answers.format || "flexible format";

  return `We analyzed your profile: interested in ${interestList}, aiming to ${goalList.toLowerCase()}, with a preference for ${formatText.toLowerCase()} learning. Here are your top personalized workshop matches.`;
}

/**
 * Register for a workshop
 * POST /api/registrations
 *
 * Payload: {
 *   workshopId: string,
 *   fullName: string,
 *   email: string,
 *   phone?: string,
 *   learningGoal?: string
 * }
 */
async function submitRegistration(payload) {
  const result = await apiRequest("/api/registrations", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (result.isLive && result.data) {
    return { success: true, registration: result.data, isLive: true };
  }

  // Graceful demo confirmation
  const confirmationNumber = "ORB-" + Math.floor(100000 + Math.random() * 900000);
  const demoRecord = {
    registrationId: confirmationNumber,
    workshopId: payload.workshopId,
    fullName: payload.fullName,
    email: payload.email,
    registeredAt: new Date().toISOString(),
    status: "Confirmed (Demo Mode)",
    notes: "Demo registration recorded locally. In production, this syncs with the FastAPI backend."
  };

  return {
    success: true,
    registration: demoRecord,
    isLive: false
  };
}

// Global export
if (typeof window !== "undefined") {
  window.OrbitoAPI = {
    API_BASE_URL,
    ApiState,
    fetchCategories,
    fetchWorkshops,
    fetchWorkshopById,
    fetchRecommendations,
    submitRegistration
  };
}
