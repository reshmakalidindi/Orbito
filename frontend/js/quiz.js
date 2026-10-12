/**
 * Orbito - Interactive Interest Discovery Quiz Engine
 * Multi-step form with validation, progress indicator, answer persistence,
 * summary review, and direct hand-off to recommendation scoring
 */

const QUIZ_STORAGE_KEY = "orbito_quiz_answers";
const QUIZ_CURRENT_STEP_KEY = "orbito_quiz_step";

const QUIZ_QUESTIONS = [
  {
    id: "interests",
    title: "What types of activities interest you?",
    description: "Select one or more topics that spark your curiosity.",
    type: "multi",
    options: [
      { id: "tech-ai", label: "Technology and AI", desc: "Coding, machine learning, robotics, cloud architecture" },
      { id: "creativity-arts", label: "Art and Creativity", desc: "Pottery, illustration, photography, canvas painting" },
      { id: "career-professional", label: "Career and Professional Skills", desc: "Public speaking, leadership, resume building" },
      { id: "entrepreneurship-finance", label: "Entrepreneurship and Finance", desc: "Startup validation, personal finance, investing" },
      { id: "lifestyle-wellness", label: "Lifestyle and Wellness", desc: "Yoga, mindfulness, artisan baking, gardening" },
      { id: "social-outdoor", label: "Social and Outdoor Activities", desc: "Birdwatching, hiking, board games, community" },
      { id: "emerging-practical", label: "Practical Life Skills", desc: "No-code apps, video editing, DIY fixes, 3D printing" }
    ]
  },
  {
    id: "goals",
    title: "What do you want to achieve?",
    description: "Choose your primary motivations (select all that apply).",
    type: "multi",
    options: [
      { id: "new-skill", label: "Learn a new skill", desc: "Gain hands-on capability in an unfamiliar domain" },
      { id: "career-growth", label: "Improve my career", desc: "Earn promotions, change roles, or stand out at work" },
      { id: "hobby", label: "Explore a hobby", desc: "Express creativity and enjoy personal fulfillment" },
      { id: "wellbeing", label: "Relax and improve well-being", desc: "Unplug, de-stress, and cultivate mental balance" },
      { id: "social", label: "Meet people and participate in activities", desc: "Connect with a like-minded community" },
      { id: "build", label: "Build something of my own", desc: "Create a side project, startup, or physical artwork" }
    ]
  },
  {
    id: "learningStyle",
    title: "How do you prefer learning?",
    description: "Select the format that resonates best with your learning style.",
    type: "single",
    options: [
      { id: "hands-on", label: "Hands-on practice", desc: "Interactive exercises, coding live, building directly" },
      { id: "listening", label: "Watching and listening", desc: "Visual presentations, lecture breakdowns, expert demos" },
      { id: "experimentation", label: "Creative experimentation", desc: "Open-ended tinkering, trial-and-error discovery" },
      { id: "group", label: "Group activities", desc: "Collaborative breakout rooms, peer discussions" },
      { id: "combination", label: "A combination of methods", desc: "Blended mix of lecture, breakout, and practice" }
    ]
  },
  {
    id: "skillLevel",
    title: "What is your current skill level?",
    description: "Helps us ensure workshop prerequisites match your background.",
    type: "single",
    options: [
      { id: "beginner", label: "Complete beginner", desc: "Zero prior exposure, starting from ground zero" },
      { id: "some-experience", label: "Some experience", desc: "Familiar with fundamentals, need structured practice" },
      { id: "intermediate", label: "Intermediate", desc: "Solid grasp of concepts, ready for applied projects" },
      { id: "advanced", label: "Advanced", desc: "Seasoned practitioner seeking cutting-edge mastery" }
    ]
  },
  {
    id: "format",
    title: "What is your preferred format?",
    description: "Choose whether you prefer virtual or local in-person sessions.",
    type: "single",
    options: [
      { id: "online", label: "Online", desc: "Learn from home via live interactive video labs" },
      { id: "offline", label: "In person", desc: "Physical venue with hands-on studios and social gatherings" },
      { id: "either", label: "Either is fine", desc: "Open to both online webinars and offline meetups" }
    ]
  },
  {
    id: "budget",
    title: "What is your budget?",
    description: "Filter workshops according to your spending preference.",
    type: "single",
    options: [
      { id: "free", label: "Free only", desc: "Only show zero-cost community and sponsor sessions" },
      { id: "low-cost", label: "Low-cost (Under $35)", desc: "Affordable workshops with certified materials" },
      { id: "flexible", label: "Flexible", desc: "Include masterclasses with premium equipment and kits" }
    ]
  },
  {
    id: "availability",
    title: "When are you available to attend?",
    description: "Select when you have time for sessions.",
    type: "single",
    options: [
      { id: "weekdays", label: "Weekdays", desc: "Evening weekday sessions after work/study" },
      { id: "weekends", label: "Weekends", desc: "Saturday and Sunday immersive workshops" },
      { id: "flexible", label: "Flexible", desc: "Available throughout the week and weekend" }
    ]
  }
];

const QuizEngine = {
  currentStep: 0, // 0 to 6 are questions; step 7 is the review summary step
  answers: {
    interests: [],
    goals: [],
    learningStyle: "",
    skillLevel: "",
    format: "",
    budget: "",
    availability: ""
  },

  init() {
    this.restoreState();
    this.render();
  },

  restoreState() {
    try {
      const savedAnswers = sessionStorage.getItem(QUIZ_STORAGE_KEY);
      if (savedAnswers) {
        this.answers = { ...this.answers, ...JSON.parse(savedAnswers) };
      }

      const savedStep = sessionStorage.getItem(QUIZ_CURRENT_STEP_KEY);
      if (savedStep !== null) {
        const stepNum = parseInt(savedStep, 10);
        if (!isNaN(stepNum) && stepNum >= 0 && stepNum <= QUIZ_QUESTIONS.length) {
          this.currentStep = stepNum;
        }
      }
    } catch (e) {
      console.warn("Could not read quiz state from storage", e);
    }
  },

  saveState() {
    try {
      sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(this.answers));
      sessionStorage.setItem(QUIZ_CURRENT_STEP_KEY, String(this.currentStep));
    } catch (e) {
      console.warn("Could not save quiz state", e);
    }
  },

  render() {
    const container = document.getElementById("quiz-app");
    if (!container) return;

    const totalSteps = QUIZ_QUESTIONS.length + 1; // +1 for summary review
    const progressPercent = Math.round(((this.currentStep + 1) / totalSteps) * 100);

    const isSummaryStep = this.currentStep === QUIZ_QUESTIONS.length;

    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress-bar-wrapper">
          <div class="quiz-progress-meta">
            <span>${isSummaryStep ? "Review & Confirm" : `Question ${this.currentStep + 1} of ${QUIZ_QUESTIONS.length}`}</span>
            <span>${progressPercent}% Complete</span>
          </div>
          <div class="quiz-progress-track">
            <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <div id="quiz-step-container">
          ${isSummaryStep ? this.renderSummaryStep() : this.renderQuestionStep(QUIZ_QUESTIONS[this.currentStep])}
        </div>

        <div class="quiz-nav-footer">
          <button type="button" class="btn btn-secondary" id="quiz-btn-back" ${this.currentStep === 0 ? 'disabled style="visibility: hidden;"' : ''}>
            ${getIcon("arrowLeft")}
            <span>Back</span>
          </button>

          <div style="display: flex; gap: 0.75rem;">
            ${isSummaryStep ? `
              <button type="button" class="btn btn-accent btn-lg" id="quiz-btn-submit">
                <span>Find My Workshops</span>
                ${getIcon("sparkles")}
              </button>
            ` : `
              <button type="button" class="btn btn-primary" id="quiz-btn-next">
                <span>Continue</span>
                ${getIcon("arrowRight")}
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  renderQuestionStep(question) {
    const isMulti = question.type === "multi";
    const selectedValues = isMulti
      ? (this.answers[question.id] || [])
      : [this.answers[question.id]];

    return `
      <div class="quiz-step-content active">
        <h2 class="quiz-question-title">${escapeHTML(question.title)}</h2>
        <p class="quiz-question-desc">
          ${escapeHTML(question.description)} ${isMulti ? '<span style="font-weight: 600; color: var(--primary);">(Multiple choice allowed)</span>' : ''}
        </p>

        <div class="quiz-options-grid">
          ${question.options.map(opt => {
            const isSelected = selectedValues.includes(opt.id);
            return `
              <div class="quiz-option-card ${isSelected ? 'selected' : ''}" data-value="${escapeHTML(opt.id)}" role="button" tabindex="0">
                <div class="quiz-option-indicator">
                  ${getIcon("check")}
                </div>
                <div class="quiz-option-text">
                  ${escapeHTML(opt.label)}
                  <span class="quiz-option-desc">${escapeHTML(opt.desc)}</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  renderSummaryStep() {
    return `
      <div class="quiz-step-content active">
        <h2 class="quiz-question-title">Review Your Preferences</h2>
        <p class="quiz-question-desc">
          Double-check your choices before we match you with personalized workshops.
        </p>

        <table class="quiz-summary-table">
          <tbody>
            <tr>
              <td class="quiz-summary-question">Interests</td>
              <td class="quiz-summary-answer">
                ${(this.answers.interests || []).map(id => {
                  const opt = QUIZ_QUESTIONS[0].options.find(o => o.id === id);
                  return `<span class="badge badge-primary" style="margin: 0.15rem;">${escapeHTML(opt ? opt.label : id)}</span>`;
                }).join(" ") || "None selected"}
              </td>
            </tr>
            <tr>
              <td class="quiz-summary-question">Goals</td>
              <td class="quiz-summary-answer">
                ${(this.answers.goals || []).map(id => {
                  const opt = QUIZ_QUESTIONS[1].options.find(o => o.id === id);
                  return `<span class="badge badge-category" style="margin: 0.15rem;">${escapeHTML(opt ? opt.label : id)}</span>`;
                }).join(" ") || "None selected"}
              </td>
            </tr>
            <tr>
              <td class="quiz-summary-question">Learning Style</td>
              <td class="quiz-summary-answer">
                ${this.getOptionLabel(2, this.answers.learningStyle)}
              </td>
            </tr>
            <tr>
              <td class="quiz-summary-question">Skill Level</td>
              <td class="quiz-summary-answer">
                <span class="badge badge-category" style="text-transform: capitalize;">${escapeHTML(this.answers.skillLevel || "Beginner")}</span>
              </td>
            </tr>
            <tr>
              <td class="quiz-summary-question">Format</td>
              <td class="quiz-summary-answer">
                <span style="text-transform: capitalize;">${escapeHTML(this.answers.format || "Either")}</span>
              </td>
            </tr>
            <tr>
              <td class="quiz-summary-question">Budget</td>
              <td class="quiz-summary-answer">
                <span style="text-transform: capitalize;">${escapeHTML(this.answers.budget || "Flexible")}</span>
              </td>
            </tr>
            <tr>
              <td class="quiz-summary-question">Availability</td>
              <td class="quiz-summary-answer">
                <span style="text-transform: capitalize;">${escapeHTML(this.answers.availability || "Flexible")}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="text-align: right; margin-bottom: 1rem;">
          <button type="button" class="btn-clear-filters" id="btn-edit-answers" style="font-size: 0.9rem;">
            Edit Preferences from Beginning
          </button>
        </div>
      </div>
    `;
  },

  getOptionLabel(questionIdx, optionId) {
    const q = QUIZ_QUESTIONS[questionIdx];
    if (!q) return optionId || "—";
    const opt = q.options.find(o => o.id === optionId);
    return opt ? opt.label : (optionId || "—");
  },

  bindEvents() {
    // Option Card Selection
    const optionCards = document.querySelectorAll(".quiz-option-card");
    optionCards.forEach(card => {
      card.addEventListener("click", () => {
        const val = card.dataset.value;
        const currentQ = QUIZ_QUESTIONS[this.currentStep];
        if (!currentQ) return;

        if (currentQ.type === "multi") {
          let list = [...(this.answers[currentQ.id] || [])];
          if (list.includes(val)) {
            list = list.filter(item => item !== val);
            card.classList.remove("selected");
          } else {
            list.push(val);
            card.classList.add("selected");
          }
          this.answers[currentQ.id] = list;
        } else {
          // Single select
          this.answers[currentQ.id] = val;
          optionCards.forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
        }

        this.saveState();
      });

      // Keyboard accessible selection
      card.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          card.click();
        }
      });
    });

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

    // Next Button
    const nextBtn = document.getElementById("quiz-btn-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const currentQ = QUIZ_QUESTIONS[this.currentStep];
        const ans = this.answers[currentQ.id];

        // Validation
        if (currentQ.type === "multi" && (!ans || ans.length === 0)) {
          showToast("Please choose at least one option to continue", "error");
          return;
        }
        if (currentQ.type === "single" && !ans) {
          showToast("Please select an option to proceed", "error");
          return;
        }

        this.currentStep++;
        this.saveState();
        this.render();
      });
    }

    // Edit answers button on review screen
    const editBtn = document.getElementById("btn-edit-answers");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        this.currentStep = 0;
        this.saveState();
        this.render();
      });
    }

    // Submit Button
    const submitBtn = document.getElementById("quiz-btn-submit");
    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Matching Your Passions...</span>`;

        try {
          // Pre-fetch recommendations and cache in sessionStorage
          const recResult = await window.OrbitoAPI.fetchRecommendations(this.answers);
          sessionStorage.setItem("orbito_latest_recommendations", JSON.stringify(recResult));
          window.location.href = "recommendations.html";
        } catch (err) {
          showToast("Could not compute recommendations: " + err.message, "error");
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Find My Workshops</span>`;
        }
      });
    }
  }
};

window.QuizEngine = QuizEngine;
