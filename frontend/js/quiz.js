/**
 * Orbito - AI Curiosity Quiz Engine
 * Interactive AI-powered interest discovery designed specifically for users exploring
 * latent passions and unknown interests. Includes adaptive curiosity questions,
 * real-time empathetic AI micro-reflections, AI persona synthesis, and tailored workshop suggestions.
 */

const AI_QUIZ_STORAGE_KEY = "orbito_ai_quiz_answers";
const AI_QUIZ_STEP_KEY = "orbito_ai_quiz_step";

const DEFAULT_AI_QUESTIONS = [
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
];

const QuizEngine = {
  questions: DEFAULT_AI_QUESTIONS,
  currentStep: 0,
  answers: {}, // map questionId -> { selectedOptions: [], customText: "" }
  aiReflections: {}, // map questionId -> reflection string
  analysisResult: null,
  isAnalyzing: false,

  async init() {
    this.restoreState();

    // Try fetching latest questions from backend
    try {
      if (window.OrbitoAPI && window.OrbitoAPI.fetchAIQuizQuestions) {
        const res = await window.OrbitoAPI.fetchAIQuizQuestions();
        if (res && res.questions && res.questions.length > 0) {
          this.questions = res.questions;
        }
      }
    } catch (e) {
      console.warn("Using offline fallback curiosity questions", e);
    }

    this.render();
  },

  restoreState() {
    try {
      const savedAnswers = sessionStorage.getItem(AI_QUIZ_STORAGE_KEY);
      if (savedAnswers) {
        this.answers = JSON.parse(savedAnswers);
      }

      const savedStep = sessionStorage.getItem(AI_QUIZ_STEP_KEY);
      if (savedStep !== null) {
        const stepNum = parseInt(savedStep, 10);
        if (!isNaN(stepNum) && stepNum >= 0 && stepNum <= this.questions.length) {
          this.currentStep = stepNum;
        }
      }

      const cachedResult = sessionStorage.getItem("orbito_latest_recommendations");
      if (cachedResult && this.currentStep === this.questions.length) {
        this.analysisResult = JSON.parse(cachedResult);
      }
    } catch (e) {
      console.warn("Could not read quiz state", e);
    }
  },

  saveState() {
    try {
      sessionStorage.setItem(AI_QUIZ_STORAGE_KEY, JSON.stringify(this.answers));
      sessionStorage.setItem(AI_QUIZ_STEP_KEY, String(this.currentStep));
    } catch (e) {
      console.warn("Could not save quiz state", e);
    }
  },

  render() {
    const container = document.getElementById("quiz-app");
    if (!container) return;

    // Check if on results step
    if (this.currentStep === this.questions.length && this.analysisResult) {
      container.innerHTML = this.renderResultsScreen();
      this.bindResultsEvents();
      return;
    }

    if (this.isAnalyzing) {
      container.innerHTML = this.renderAnalyzingScreen();
      return;
    }

    const currentQ = this.questions[this.currentStep] || this.questions[0];
    const totalSteps = this.questions.length;
    const progressPercent = Math.round(((this.currentStep + 1) / totalSteps) * 100);

    const stepAnswer = this.answers[currentQ.id] || { selectedOptions: [], customText: "" };
    const currentReflection = this.aiReflections[currentQ.id];

    container.innerHTML = `
      <div class="quiz-card">
        <!-- Progress Header -->
        <div class="quiz-progress-bar-wrapper">
          <div class="quiz-progress-meta">
            <span>Question ${this.currentStep + 1} of ${totalSteps}</span>
            <span>${progressPercent}% Complete</span>
          </div>
          <div class="quiz-progress-track">
            <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <div class="quiz-step-content" id="quiz-step-container">
          <span class="quiz-step-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
            AI Curiosity Engine · Step ${this.currentStep + 1}
          </span>

          <h2 class="quiz-question-title">${escapeHTML(currentQ.title)}</h2>
          <p class="quiz-question-desc">${escapeHTML(currentQ.hint || "")}</p>

          <!-- Options Grid -->
          <div class="quiz-options-grid" role="group" aria-label="Question choices">
            ${currentQ.options.map(opt => {
              const isSelected = (stepAnswer.selectedOptions || []).includes(opt.id);
              return `
                <div class="quiz-option-card ${isSelected ? 'selected' : ''}" data-value="${escapeHTML(opt.id)}" role="checkbox" aria-checked="${isSelected}" tabindex="0">
                  <div class="quiz-option-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div class="quiz-option-text">
                    ${escapeHTML(opt.label)}
                    <span class="quiz-option-desc">${escapeHTML(opt.desc)}</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Free-form Write-In Option -->
          <div class="quiz-custom-input-wrap">
            <label class="quiz-custom-label" for="quiz-custom-text">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Have another thought? Share in your own words:</span>
            </label>
            <input 
              type="text" 
              class="quiz-custom-input" 
              id="quiz-custom-text" 
              placeholder="e.g. 'I enjoy making physical craft models' or 'I want to build apps that help people'"
              value="${escapeHTML(stepAnswer.customText || '')}"
            >
          </div>

          <!-- Live Empathetic AI Micro-Reflection Box (if triggered) -->
          ${currentReflection ? `
            <div class="ai-live-reflection-box" role="status">
              <div class="ai-reflection-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div class="ai-reflection-content">
                <h4>AI Curiosity Insight</h4>
                <p>${escapeHTML(currentReflection)}</p>
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Navigation Controls -->
        <div class="quiz-nav-footer">
          <button type="button" class="btn btn-secondary" id="quiz-btn-back" ${this.currentStep === 0 ? 'disabled style="visibility: hidden;"' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span>Back</span>
          </button>

          <button type="button" class="btn btn-primary btn-lg" id="quiz-btn-next">
            <span>${this.currentStep === totalSteps - 1 ? 'Analyze My Passions with AI' : 'Continue'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              ${this.currentStep === totalSteps - 1 ?
                '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>' :
                '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>'}
            </svg>
          </button>
        </div>
      </div>
    `;

    this.bindQuestionEvents();
  },

  renderAnalyzingScreen() {
    return `
      <div class="quiz-card ai-analyzing-screen">
        <div class="ai-pulse-orb" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>

        <h2 class="ai-analyzing-title">Orbito AI is Discovering Your Passions...</h2>
        <p class="ai-analyzing-subtitle">Connecting your answers across 8 curiosity disciplines to uncover matching workshops.</p>

        <div class="ai-step-list">
          <div class="ai-step-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Analyzing sensory preferences &amp; flow state signals</span>
          </div>
          <div class="ai-step-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Synthesizing your curiosity archetype persona</span>
          </div>
          <div class="ai-step-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Scoring matching workshops across catalog in New York &amp; Online</span>
          </div>
        </div>
      </div>
    `;
  },

  renderResultsScreen() {
    const res = this.analysisResult || {};
    const archetype = res.archetype || "The Tactile Artisan & Visual Creator";
    const tagline = res.archetypeTagline || "Thrives in sensory flow states and hands-on crafting.";
    const summary = res.userProfileSummary || "Our AI Engine analyzed your answers to find your top workshops.";
    const workshops = res.recommendations || [];

    return `
      <div class="quiz-results-wrapper">
        <!-- AI Archetype Unlocked Card -->
        <div class="ai-archetype-card">
          <span class="ai-archetype-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            AI Discovery Result · Persona Unlocked
          </span>
          <h2 class="ai-archetype-name">${escapeHTML(archetype)}</h2>
          <div class="ai-archetype-tagline">${escapeHTML(tagline)}</div>
          <div class="ai-synthesis-text">${escapeHTML(summary)}</div>
        </div>

        <!-- Matched Workshops Section -->
        <div class="quiz-matched-section-header">
          <div>
            <h3 class="quiz-matched-title">Recommended Workshops Tailored For You</h3>
            <p class="quiz-matched-subtitle">Matched specifically based on your curiosity answers and scored by relevance.</p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <a href="recommendations.html" class="btn btn-secondary btn-sm">
              <span>View Full Breakdown</span>
            </a>
            <button type="button" class="btn btn-outline btn-sm" id="btn-retake-ai-quiz">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>

        <!-- Workshop Cards Grid -->
        <div class="quiz-results-grid">
          ${workshops.map(w => this.renderWorkshopCard(w)).join("")}
        </div>

        <!-- Bottom Actions Banner -->
        <div style="background: #FFFFFF; border: 1.5px solid #E8E8EE; border-radius: 24px; padding: 2.5rem; text-align: center; box-shadow: 0 4px 20px rgba(36, 36, 40, 0.05); margin-top: 2rem;">
          <h4 style="font-size: 1.35rem; font-weight: 800; color: #242428; margin-bottom: 0.5rem;">
            Ready to dive into hands-on learning?
          </h4>
          <p style="color: #55555D; max-width: 540px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
            Book an upcoming session above, or browse all 50 workshop topics across technology, art, wellness, and practical skills.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="explore.html" class="btn btn-primary btn-lg">Explore All Workshops</a>
            <a href="recommendations.html" class="btn btn-secondary btn-lg">View Recommendations Page</a>
          </div>
        </div>
      </div>
    `;
  },

  renderWorkshopCard(w) {
    const isFree = w.price === 0;
    const priceDisplay = isFree ? "Free" : (w.priceLabel || `$${w.price}`);
    const isOnline = (w.format || "").toLowerCase() === "online";

    return `
      <article class="workshop-card" data-id="${escapeHTML(w.id)}" style="background: #FFFFFF; border: 1.5px solid #E8E8EE; border-radius: 22px; padding: 1.65rem; box-shadow: 0 4px 16px rgba(36, 36, 40, 0.04); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
            <span class="badge" style="background: #FFF7ED; color: #EA580C; font-weight: 800; font-size: 0.76rem; border: 1px solid #FFEDD5;">
              ★ ${w.matchScore || 95}% Relevance Match
            </span>
            <span class="badge" style="background: ${isOnline ? '#EFF6FF' : '#F0FDF4'}; color: ${isOnline ? '#2563EB' : '#16A34A'}; font-weight: 700; font-size: 0.72rem;">
              ${isOnline ? 'ONLINE' : 'IN PERSON'}
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span style="font-size: 0.76rem; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.04em;">
              ${escapeHTML(w.categoryName || 'Workshop')}
            </span>
            <span style="font-weight: 800; font-size: 0.95rem; color: #242428;">
              ${escapeHTML(priceDisplay)}
            </span>
          </div>

          <h4 style="font-size: 1.18rem; font-weight: 800; color: #242428; line-height: 1.3; margin-bottom: 0.5rem;">
            <a href="workshop-details.html?id=${encodeURIComponent(w.id)}" style="color: inherit; text-decoration: none;">
              ${escapeHTML(w.title)}
            </a>
          </h4>

          <p style="font-size: 0.88rem; color: #55555D; line-height: 1.5; margin-bottom: 0.75rem;">
            ${escapeHTML(w.shortDescription || '')}
          </p>

          <!-- Why AI Matched This Rationale Box -->
          ${w.matchRationale ? `
            <div class="ai-match-rationale-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span><strong>Why AI matched this:</strong> ${escapeHTML(w.matchRationale)}</span>
            </div>
          ` : ''}

          <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.82rem; color: #64748B; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>${escapeHTML(w.date || 'Upcoming')} · ${escapeHTML(w.time || '')}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Instructor: ${escapeHTML(w.instructor ? w.instructor.name : 'Orbito Mentor')}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.65rem; border-top: 1px solid #F1F5F9; padding-top: 1rem;">
          <a href="workshop-details.html?id=${encodeURIComponent(w.id)}" class="btn btn-secondary btn-sm" style="flex: 1; text-align: center; justify-content: center;">
            View Details
          </a>
          <button type="button" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center;" onclick="window.openRegistrationModal && window.openRegistrationModal('${escapeHTML(w.id)}')">
            Book Workshop
          </button>
        </div>
      </article>
    `;
  },

  bindQuestionEvents() {
    const currentQ = this.questions[this.currentStep];
    if (!currentQ) return;

    if (!this.answers[currentQ.id]) {
      this.answers[currentQ.id] = { selectedOptions: [], customText: "" };
    }

    // Option Cards Click
    const cards = document.querySelectorAll(".quiz-option-card");
    cards.forEach(card => {
      card.addEventListener("click", async () => {
        const val = card.dataset.value;
        let selected = [...(this.answers[currentQ.id].selectedOptions || [])];

        if (selected.includes(val)) {
          selected = selected.filter(v => v !== val);
          card.classList.remove("selected");
          card.setAttribute("aria-checked", "false");
        } else {
          selected.push(val);
          card.classList.add("selected");
          card.setAttribute("aria-checked", "true");
        }

        this.answers[currentQ.id].selectedOptions = selected;
        this.saveState();

        // Fetch live micro-reflection when user selects
        if (selected.length > 0 && window.OrbitoAPI && window.OrbitoAPI.evaluateAIQuizStep) {
          try {
            const evalRes = await window.OrbitoAPI.evaluateAIQuizStep({
              questionId: currentQ.id,
              questionTitle: currentQ.title,
              selectedOptions: selected,
              customText: this.answers[currentQ.id].customText
            });
            if (evalRes && evalRes.aiFeedback) {
              this.aiReflections[currentQ.id] = evalRes.aiFeedback;
              // update existing reflection box or re-render
              let refBox = document.querySelector(".ai-live-reflection-box");
              if (!refBox) {
                const container = document.getElementById("quiz-step-container");
                if (container) {
                  const div = document.createElement("div");
                  div.className = "ai-live-reflection-box";
                  div.setAttribute("role", "status");
                  div.innerHTML = `
                    <div class="ai-reflection-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <div class="ai-reflection-content">
                      <h4>AI Curiosity Insight</h4>
                      <p>${escapeHTML(evalRes.aiFeedback)}</p>
                    </div>
                  `;
                  container.appendChild(div);
                }
              } else {
                const p = refBox.querySelector("p");
                if (p) p.textContent = evalRes.aiFeedback;
              }
            }
          } catch (e) {
            console.warn("AI reflection error", e);
          }
        }
      });

      // Keyboard accessibility
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Custom Write-in input
    const customInput = document.getElementById("quiz-custom-text");
    if (customInput) {
      customInput.addEventListener("input", (e) => {
        this.answers[currentQ.id].customText = e.target.value.trim();
        this.saveState();
      });
    }

    // Back Button
    const backBtn = document.getElementById("quiz-btn-back");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (this.currentStep > 0) {
          this.currentStep--;
          this.saveState();
          this.render();
        }
      });
    }

    // Continue / Submit Button
    const nextBtn = document.getElementById("quiz-btn-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", async () => {
        const ans = this.answers[currentQ.id] || { selectedOptions: [], customText: "" };
        const hasOptions = (ans.selectedOptions && ans.selectedOptions.length > 0);
        const hasText = Boolean(ans.customText && ans.customText.trim().length > 0);

        if (!hasOptions && !hasText) {
          if (window.showToast) {
            window.showToast("Please choose at least one option or share your thought", "error");
          } else {
            alert("Please choose at least one option or share your thought to continue.");
          }
          return;
        }

        if (this.currentStep < this.questions.length - 1) {
          this.currentStep++;
          this.saveState();
          this.render();
          window.scrollTo({ top: 120, behavior: "smooth" });
        } else {
          // Final Submit: Trigger AI Recommendation Synthesis
          await this.processFinalSubmission();
        }
      });
    }
  },

  async processFinalSubmission() {
    this.isAnalyzing = true;
    this.render();
    window.scrollTo({ top: 120, behavior: "smooth" });

    // Format answers array
    const formattedAnswers = Object.entries(this.answers).map(([qId, val]) => ({
      questionId: qId,
      selectedOptions: val.selectedOptions || [],
      customText: val.customText || ""
    }));

    try {
      // Allow brief moment for analyzing animations
      await new Promise(r => setTimeout(r, 900));

      let result = null;
      if (window.OrbitoAPI && window.OrbitoAPI.fetchAIQuizRecommendations) {
        result = await window.OrbitoAPI.fetchAIQuizRecommendations({
          answers: formattedAnswers,
          preferredFormat: "either",
          budget: "flexible",
          skillLevel: "Beginner"
        });
      }

      this.analysisResult = result;
      sessionStorage.setItem("orbito_latest_recommendations", JSON.stringify(result));
      sessionStorage.setItem("orbito_quiz_answers", JSON.stringify({
        interests: result.primaryCategoryId ? [result.primaryCategoryId] : [],
        answers: formattedAnswers
      }));

      this.currentStep = this.questions.length;
      this.isAnalyzing = false;
      this.saveState();
      this.render();
      window.scrollTo({ top: 80, behavior: "smooth" });
    } catch (err) {
      this.isAnalyzing = false;
      console.error("AI recommendation error", err);
      if (window.showToast) window.showToast("Could not complete AI analysis: " + err.message, "error");
      this.render();
    }
  },

  bindResultsEvents() {
    const retakeBtn = document.getElementById("btn-retake-ai-quiz");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        sessionStorage.removeItem(AI_QUIZ_STORAGE_KEY);
        sessionStorage.removeItem(AI_QUIZ_STEP_KEY);
        sessionStorage.removeItem("orbito_latest_recommendations");
        this.currentStep = 0;
        this.answers = {};
        this.aiReflections = {};
        this.analysisResult = null;
        this.render();
        window.scrollTo({ top: 120, behavior: "smooth" });
      });
    }
  }
};

window.QuizEngine = QuizEngine;
