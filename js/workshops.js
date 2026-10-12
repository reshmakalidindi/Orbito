/**
 * Orbito - Workshop Card Renderer & Explore Page Controller
 * Handles filtering, sorting, search, URL query sync, and responsive cards grid
 */

// Generate HTML string for a single workshop card
function renderWorkshopCard(workshop) {
  const isFree = workshop.price === 0;
  const priceDisplay = isFree ? "Free" : workshop.priceLabel;
  const formatBadgeClass = workshop.format === "online" ? "badge-format-online" : "badge-format-offline";
  const formatIconName = workshop.format === "online" ? "video" : "mapPin";

  return `
    <article class="workshop-card" data-id="${escapeHTML(workshop.id)}">
      <div class="card-top">
        <span class="card-category-tag">${escapeHTML(workshop.categoryName)}</span>
        <span class="card-price-tag ${isFree ? 'free' : ''}">${escapeHTML(priceDisplay)}</span>
      </div>

      <div class="card-body">
        <h3 class="card-title">
          <a href="workshop-details.html?id=${encodeURIComponent(workshop.id)}">
            ${escapeHTML(workshop.title)}
          </a>
        </h3>

        <div class="card-topic">
          ${getIcon("compass", "icon-sm")}
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
            <span style="text-transform: capitalize;">${escapeHTML(workshop.format)}: ${escapeHTML(workshop.location)}</span>
          </div>
          <div class="card-meta-item" style="justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge ${formatBadgeClass}">${escapeHTML(workshop.format.toUpperCase())}</span>
              <span class="badge badge-category">${escapeHTML(workshop.levelLabel)}</span>
            </div>
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
          <button type="button" class="btn btn-primary btn-sm register-btn-trigger" onclick="openRegistrationModal('${escapeHTML(workshop.id)}')">
            Register
          </button>
        </div>
      </div>
    </article>
  `;
}

// Controller for the Explore Workshops page
const ExploreController = {
  currentFilters: {
    search: "",
    category: "all",
    topic: "",
    format: "all",
    level: "all",
    price: "all",
    dateRange: "all",
    sort: "upcoming"
  },

  init() {
    this.readUrlParams();
    this.populateCategoryFilter();
    this.bindEvents();
    this.loadWorkshops();
  },

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("search")) this.currentFilters.search = params.get("search");
    if (params.has("q")) this.currentFilters.search = params.get("q");
    if (params.has("category")) this.currentFilters.category = params.get("category");
    if (params.has("topic")) this.currentFilters.topic = params.get("topic");
    if (params.has("format")) this.currentFilters.format = params.get("format");
    if (params.has("level")) this.currentFilters.level = params.get("level");
    if (params.has("price")) this.currentFilters.price = params.get("price");
    if (params.has("sort")) this.currentFilters.sort = params.get("sort");
    if (params.has("dateRange")) this.currentFilters.dateRange = params.get("dateRange");

    // Sync form control values
    this.syncFormControls();
  },

  syncFormControls() {
    const searchInput = document.getElementById("explore-search");
    if (searchInput) searchInput.value = this.currentFilters.search;

    const categorySelect = document.getElementById("filter-category");
    if (categorySelect) categorySelect.value = this.currentFilters.category;

    const formatSelect = document.getElementById("filter-format");
    if (formatSelect) formatSelect.value = this.currentFilters.format;

    const levelSelect = document.getElementById("filter-level");
    if (levelSelect) levelSelect.value = this.currentFilters.level;

    const priceSelect = document.getElementById("filter-price");
    if (priceSelect) priceSelect.value = this.currentFilters.price;

    const dateSelect = document.getElementById("filter-date");
    if (dateSelect) dateSelect.value = this.currentFilters.dateRange;

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = this.currentFilters.sort;
  },

  populateCategoryFilter() {
    const categorySelect = document.getElementById("filter-category");
    if (!categorySelect) return;

    // Preserve first "All Categories" option
    categorySelect.innerHTML = `<option value="all">All Categories (7)</option>`;

    const categories = window.ORBITO_CATEGORIES || [];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = `${cat.name} (${cat.topics.length} topics)`;
      if (this.currentFilters.category === cat.id) {
        option.selected = true;
      }
      categorySelect.appendChild(option);
    });
  },

  bindEvents() {
    const searchInput = document.getElementById("explore-search");
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.currentFilters.search = e.target.value.trim();
          this.loadWorkshops();
        }, 250);
      });
    }

    const categorySelect = document.getElementById("filter-category");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        this.currentFilters.category = e.target.value;
        this.currentFilters.topic = ""; // Clear specific topic when changing category
        this.loadWorkshops();
      });
    }

    const formatSelect = document.getElementById("filter-format");
    if (formatSelect) {
      formatSelect.addEventListener("change", (e) => {
        this.currentFilters.format = e.target.value;
        this.loadWorkshops();
      });
    }

    const levelSelect = document.getElementById("filter-level");
    if (levelSelect) {
      levelSelect.addEventListener("change", (e) => {
        this.currentFilters.level = e.target.value;
        this.loadWorkshops();
      });
    }

    const priceSelect = document.getElementById("filter-price");
    if (priceSelect) {
      priceSelect.addEventListener("change", (e) => {
        this.currentFilters.price = e.target.value;
        this.loadWorkshops();
      });
    }

    const dateSelect = document.getElementById("filter-date");
    if (dateSelect) {
      dateSelect.addEventListener("change", (e) => {
        this.currentFilters.dateRange = e.target.value;
        this.loadWorkshops();
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentFilters.sort = e.target.value;
        this.loadWorkshops();
      });
    }

    const clearBtn = document.getElementById("btn-clear-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.resetFilters());
    }
  },

  resetFilters() {
    this.currentFilters = {
      search: "",
      category: "all",
      topic: "",
      format: "all",
      level: "all",
      price: "all",
      dateRange: "all",
      sort: "upcoming"
    };

    this.syncFormControls();
    window.history.replaceState({}, "", window.location.pathname);
    this.loadWorkshops();
  },

  renderActiveFilterChips() {
    const container = document.getElementById("active-filter-chips");
    if (!container) return;

    const chips = [];

    if (this.currentFilters.search) {
      chips.push({ key: "search", label: `Search: "${this.currentFilters.search}"` });
    }
    if (this.currentFilters.category !== "all") {
      const cat = (window.ORBITO_CATEGORIES || []).find(c => c.id === this.currentFilters.category);
      chips.push({ key: "category", label: `Category: ${cat ? cat.name : this.currentFilters.category}` });
    }
    if (this.currentFilters.topic) {
      chips.push({ key: "topic", label: `Topic: ${this.currentFilters.topic}` });
    }
    if (this.currentFilters.format !== "all") {
      chips.push({ key: "format", label: `Format: ${this.currentFilters.format.toUpperCase()}` });
    }
    if (this.currentFilters.level !== "all") {
      chips.push({ key: "level", label: `Level: ${this.currentFilters.level}` });
    }
    if (this.currentFilters.price !== "all") {
      chips.push({ key: "price", label: `Price: ${this.currentFilters.price}` });
    }
    if (this.currentFilters.dateRange !== "all") {
      chips.push({ key: "dateRange", label: `Dates: ${this.currentFilters.dateRange}` });
    }

    if (chips.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="active-filters-bar">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Active Filters:</span>
        ${chips.map(chip => `
          <span class="active-filter-chip">
            ${escapeHTML(chip.label)}
            <button type="button" onclick="ExploreController.removeFilter('${chip.key}')" aria-label="Remove filter">
              ${getIcon("x", "icon-xs")}
            </button>
          </span>
        `).join("")}
        <button type="button" class="btn-clear-filters" onclick="ExploreController.resetFilters()">
          Clear All
        </button>
      </div>
    `;
  },

  removeFilter(key) {
    if (key === "search") this.currentFilters.search = "";
    if (key === "category") this.currentFilters.category = "all";
    if (key === "topic") this.currentFilters.topic = "";
    if (key === "format") this.currentFilters.format = "all";
    if (key === "level") this.currentFilters.level = "all";
    if (key === "price") this.currentFilters.price = "all";
    if (key === "dateRange") this.currentFilters.dateRange = "all";

    this.syncFormControls();
    this.loadWorkshops();
  },

  async loadWorkshops() {
    const grid = document.getElementById("explore-grid");
    const countEl = document.getElementById("results-count-text");
    if (!grid) return;

    // Show loading skeleton
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="width: 2.5rem; height: 2.5rem; border: 3px solid var(--border-subtle); border-top-color: var(--primary); border-radius: 50%; margin: 0 auto 1rem; animation: spin 0.8s linear infinite;"></div>
        <p style="color: var(--text-secondary); font-weight: 500;">Searching matching workshops...</p>
      </div>
      <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
    `;

    this.renderActiveFilterChips();

    try {
      const response = await window.OrbitoAPI.fetchWorkshops(this.currentFilters);
      const workshops = response.workshops || [];

      if (countEl) {
        countEl.innerHTML = `Showing <strong>${workshops.length}</strong> of <strong>${(window.SAMPLE_WORKSHOPS || []).length}</strong> workshops`;
      }

      if (workshops.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">
              ${getIcon("search")}
            </div>
            <h3>No matching workshops found</h3>
            <p>Try clearing some of your filters or searching for another keyword to discover available sessions.</p>
            <button type="button" class="btn btn-primary" onclick="ExploreController.resetFilters()">
              Reset All Filters
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = workshops.map(renderWorkshopCard).join("");
    } catch (err) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; border-color: var(--danger);">
          <div class="empty-state-icon" style="background: var(--danger-bg); color: var(--danger);">
            ${getIcon("x")}
          </div>
          <h3>Failed to load workshops</h3>
          <p>${escapeHTML(err.message)}</p>
          <button type="button" class="btn btn-secondary" onclick="ExploreController.loadWorkshops()">
            Retry
          </button>
        </div>
      `;
    }
  }
};

window.renderWorkshopCard = renderWorkshopCard;
window.ExploreController = ExploreController;
