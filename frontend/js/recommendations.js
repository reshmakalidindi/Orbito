/**
 * Orbito - Personalized Recommendations Controller (Page E)
 * Displays top tailored workshop matches, relevance match scores,
 * customized "Why we recommend this" rationale, and controls to retake or edit preferences
 */

const RecommendationsController = {
  async init() {
    const container = document.getElementById("recommendations-container");
    const summaryTextEl = document.getElementById("profile-summary-text");
    if (!container) return;

    let quizAnswers = null;
    let recData = null;

    try {
      const savedAnswers = sessionStorage.getItem("orbito_quiz_answers");
      if (savedAnswers) quizAnswers = JSON.parse(savedAnswers);

      const cachedRecs = sessionStorage.getItem("orbito_latest_recommendations");
      if (cachedRecs) recData = JSON.parse(cachedRecs);
    } catch (e) {
      console.warn("Storage read error", e);
    }

    // If no quiz taken yet, provide helpful guidance or fallback
    if (!quizAnswers && !recData) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            ${getIcon("sparkles")}
          </div>
          <h3>Take the Quiz First</h3>
          <p>We haven't received your learning preferences yet. Take our 2-minute interest discovery quiz to unlock tailored recommendations!</p>
          <a href="quiz.html" class="btn btn-primary">
            Start Interest Quiz
          </a>
        </div>
      `;
      if (summaryTextEl) {
        summaryTextEl.textContent = "Take our 2-minute interest quiz to receive personalized recommendations.";
      }
      return;
    }

    // If we need to fetch fresh recommendations
    if (!recData && quizAnswers) {
      try {
        recData = await window.OrbitoAPI.fetchRecommendations(quizAnswers);
        sessionStorage.setItem("orbito_latest_recommendations", JSON.stringify(recData));
      } catch (err) {
        showToast("Error retrieving recommendations", "error");
      }
    }

    const workshops = (recData && recData.recommendations) || [];

    if (summaryTextEl && recData && recData.userProfileSummary) {
      summaryTextEl.textContent = recData.userProfileSummary;
    }

    if (workshops.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${getIcon("search")}</div>
          <h3>No direct matches found</h3>
          <p>We couldn't find workshops matching your exact criteria right now. Try expanding your preferences.</p>
          <a href="quiz.html" class="btn btn-primary">Retake Quiz</a>
        </div>
      `;
      return;
    }

    // Render recommendation cards with match percentage and rationale
    container.innerHTML = workshops.map(w => this.renderRecommendationCard(w)).join("");

    this.bindActionButtons();
  },

  renderRecommendationCard(workshop) {
    const isFree = workshop.price === 0;
    const priceDisplay = isFree ? "Free" : workshop.priceLabel;
    const formatBadgeClass = workshop.format === "online" ? "badge-format-online" : "badge-format-offline";
    const formatIconName = workshop.format === "online" ? "video" : "mapPin";

    return `
      <article class="workshop-card" data-id="${escapeHTML(workshop.id)}">
        <div class="card-match-banner">
          <div class="card-match-score">
            ${getIcon("sparkles")}
            <span>${workshop.matchScore || 95}% Relevance Match</span>
          </div>
          <span class="badge ${formatBadgeClass}">${escapeHTML(workshop.format.toUpperCase())}</span>
        </div>

        ${workshop.matchRationale ? `
          <div class="card-match-rationale">
            <strong>Why we recommend this:</strong>
            ${escapeHTML(workshop.matchRationale)}
          </div>
        ` : ''}

        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="card-category-tag">${escapeHTML(workshop.categoryName)}</span>
            <span class="card-price-tag ${isFree ? 'free' : ''}">${escapeHTML(priceDisplay)}</span>
          </div>

          <h3 class="card-title">
            <a href="workshop-details.html?id=${encodeURIComponent(workshop.id)}">
              ${escapeHTML(workshop.title)}
            </a>
          </h3>

          <div class="card-topic">
            ${getIcon("compass")}
            <span>${escapeHTML(workshop.topicName)}</span>
          </div>

          <p class="card-description">${escapeHTML(workshop.shortDescription)}</p>

          <div class="card-meta-list">
            <div class="card-meta-item">
              ${getIcon("calendar")}
              <span>${escapeHTML(workshop.date)} • ${escapeHTML(workshop.time)}</span>
            </div>
            <div class="card-meta-item">
              ${getIcon(formatIconName)}
              <span>${escapeHTML(workshop.location)}</span>
            </div>
            <div class="card-meta-item" style="justify-content: space-between;">
              <span class="badge badge-category">${escapeHTML(workshop.levelLabel)}</span>
              ${workshop.rating ? `
                <div style="display: flex; align-items: center; gap: 0.25rem; font-weight: 700; color: #D97706; font-size: 0.85rem;">
                  ${getIcon("star")}
                  <span>${workshop.rating}</span>
                  <span style="color: var(--text-muted); font-weight: 400; font-size: 0.75rem;">(${workshop.reviewsCount})</span>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="card-instructor">
            <img class="card-instructor-img" src="${escapeHTML(workshop.instructor.avatar)}" alt="${escapeHTML(workshop.instructor.name)}" loading="lazy">
            <div class="card-instructor-info">
              <span class="card-instructor-name">${escapeHTML(workshop.instructor.name)}</span>
              <span class="card-instructor-title">${escapeHTML(workshop.instructor.title)}</span>
            </div>
          </div>

          <div class="card-footer-actions">
            <a href="workshop-details.html?id=${encodeURIComponent(workshop.id)}" class="btn btn-secondary btn-sm">
              View Details
            </a>
            <button type="button" class="btn btn-primary btn-sm" onclick="openRegistrationModal('${escapeHTML(workshop.id)}')">
              Register
            </button>
          </div>
        </div>
      </article>
    `;
  },

  bindActionButtons() {
    const retakeBtn = document.getElementById("btn-retake-quiz");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        sessionStorage.removeItem("orbito_quiz_answers");
        sessionStorage.removeItem("orbito_quiz_step");
        sessionStorage.removeItem("orbito_latest_recommendations");
        window.location.href = "quiz.html";
      });
    }

    const editBtn = document.getElementById("btn-edit-preferences");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        // Keep answers but jump to step 0
        sessionStorage.setItem("orbito_quiz_step", "0");
        window.location.href = "quiz.html";
      });
    }
  }
};

window.RecommendationsController = RecommendationsController;
