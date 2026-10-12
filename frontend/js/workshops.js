/**
 * Orbito - Workshop Card Renderer & Explore Domain Page Controller
 * Displays domain courses with images, themed fallbacks, and live workshop cohorts
 * Matching Orbito's premium main page theme
 */

// Generate HTML string for a single workshop card
function renderWorkshopCard(workshop) {
  const isFree = workshop.price === 0;
  const priceDisplay = isFree ? "Free" : workshop.priceLabel;
  const formatBadgeClass = workshop.format === "online" ? "badge-format-online" : "badge-format-offline";
  const formatIconName = workshop.format === "online" ? "video" : "mapPin";

  const coverImg = workshop.coverImageUrl || 
    (window.COURSE_IMAGE_MAP && (window.COURSE_IMAGE_MAP[workshop.topicId] || window.COURSE_IMAGE_MAP[workshop.topicName])) || null;

  return `
    <article class="workshop-card" data-id="${escapeHTML(workshop.id)}">
      ${coverImg ? `
        <div class="workshop-card-media" style="width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border-top-left-radius: 23px; border-top-right-radius: 23px; background: #F3F4F6;">
          <img src="${escapeHTML(coverImg)}" alt="${escapeHTML(workshop.title)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
        </div>
      ` : ''}

      <div class="workshop-card-inner" style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
        <div class="card-top" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <span class="card-category-tag" style="font-size: 0.78rem; font-weight: 700; color: #7C3AED; background: #F5F3FF; padding: 0.25rem 0.65rem; border-radius: 9999px;">${escapeHTML(workshop.categoryName)}</span>
          <span class="card-price-tag ${isFree ? 'free' : ''}" style="font-weight: 800; font-size: 0.95rem; color: ${isFree ? '#059669' : '#1F2937'};">${escapeHTML(priceDisplay)}</span>
        </div>

        <h3 class="card-title" style="font-size: 1.15rem; font-weight: 800; margin: 0 0 0.5rem 0; line-height: 1.35;">
          <a href="workshop-details.html?id=${encodeURIComponent(workshop.id)}" style="color: #242428; text-decoration: none;">
            ${escapeHTML(workshop.title)}
          </a>
        </h3>

        <div class="card-topic" style="display: flex; align-items: center; gap: 0.35rem; color: #6B7280; font-size: 0.85rem; margin-bottom: 0.75rem;">
          ${getIcon("compass", "icon-sm")}
          <span>${escapeHTML(workshop.topicName)}</span>
        </div>

        <p class="card-description" style="font-size: 0.88rem; color: #4B5563; line-height: 1.5; margin: 0 0 1rem 0; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${escapeHTML(workshop.shortDescription)}
        </p>

        <div class="card-meta-list" style="display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.82rem; color: #6B7280; margin-bottom: 1.25rem;">
          <div class="card-meta-item" style="display: flex; align-items: center; gap: 0.4rem;">
            ${getIcon("calendar")}
            <span>${escapeHTML(workshop.date)} • ${escapeHTML(workshop.time)}</span>
          </div>
          <div class="card-meta-item" style="display: flex; align-items: center; gap: 0.4rem;">
            ${getIcon(formatIconName)}
            <span style="text-transform: capitalize;">${escapeHTML(workshop.format)}: ${escapeHTML(workshop.location)}</span>
          </div>
        </div>

        <div class="card-instructor" style="display: flex; align-items: center; gap: 0.75rem; padding-top: 0.85rem; border-top: 1px solid #ECECF2; margin-bottom: 1rem;">
          <img class="card-instructor-img" src="${escapeHTML((workshop.instructor && workshop.instructor.avatar) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80')}" alt="Instructor" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;" loading="lazy">
          <div class="card-instructor-info" style="display: flex; flex-direction: column;">
            <span class="card-instructor-name" style="font-size: 0.86rem; font-weight: 700; color: #242428;">${escapeHTML((workshop.instructor && workshop.instructor.name) || workshop.organizerName || 'Orbito Instructor')}</span>
            <span class="card-instructor-title" style="font-size: 0.75rem; color: #6B7280;">${escapeHTML((workshop.instructor && workshop.instructor.title) || workshop.organizerTitle || 'Mentor')}</span>
          </div>
        </div>

        <div class="card-footer-actions" style="display: flex; gap: 0.75rem;">
          <a href="workshop-details.html?id=${encodeURIComponent(workshop.id)}" class="btn btn-secondary btn-sm" style="flex: 1; text-align: center; justify-content: center;">
            View Details
          </a>
          <button type="button" class="btn btn-primary btn-sm register-btn-trigger" style="flex: 1; justify-content: center;" onclick="openRegistrationModal('${escapeHTML(workshop.id)}')">
            Register
          </button>
        </div>
      </div>
    </article>
  `;
}

// Authentic SVG Art matching the main page for all 7 domains
function getDomainSvgArt(categoryId) {
  const cid = (categoryId || "").toLowerCase();
  if (cid === "tech-ai" || cid.includes("tech")) {
    return `
      <svg class="explore-hero-art-svg" viewBox="0 0 120 100" fill="none">
        <path d="M20 78L28 72H92L100 78C101 79 100 81 98 81H22C20 81 19 79 20 78Z" fill="#E8E8EE" stroke="#A987FF" stroke-width="2" stroke-linecap="round"/>
        <rect x="28" y="24" width="64" height="48" rx="8" fill="#F4EFFF" stroke="#A987FF" stroke-width="2.2"/>
        <rect x="34" y="30" width="52" height="36" rx="4" fill="#FFFFFF"/>
        <path d="M46 42L41 48L46 54" stroke="#7C3AED" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M54 42L59 48L54 54" stroke="#7C3AED" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="51" y1="41" x2="49" y2="55" stroke="#A987FF" stroke-width="2" stroke-linecap="round"/>
        <path d="M96 18L98 12L100 18L106 20L100 22L98 28L96 22L90 20Z" fill="#A987FF"/>
        <circle cx="22" cy="30" r="2.5" fill="#C4B5FD"/>
      </svg>
    `;
  } else if (cid === "creativity-arts" || cid.includes("creativity")) {
    return `
      <svg class="explore-hero-art-svg" viewBox="0 0 120 100" fill="none">
        <path d="M30 68C18 58 20 34 38 25C54 17 76 20 86 33C94 44 91 58 83 66C76 73 66 76 58 74C52 72 49 75 51 80C52 83 49 85 45 84C38 81 35 73 30 68Z" fill="#FFF0F4" stroke="#FF668D" stroke-width="2.2"/>
        <ellipse cx="40" cy="45" rx="5" ry="6" fill="#FFFFFF" stroke="#FF668D" stroke-width="1.8"/>
        <circle cx="55" cy="30" r="4.5" fill="#FF668D"/>
        <circle cx="71" cy="36" r="4.5" fill="#A987FF"/>
        <circle cx="78" cy="52" r="4.5" fill="#FFB63E"/>
        <path d="M68 76L98 42C100 40 103 40 105 42C107 44 107 47 105 49L75 83Z" fill="#FED7AA" stroke="#FF668D" stroke-width="1.8"/>
        <path d="M68 76L63 85C62 87 59 88 57 86C55 84 56 81 58 80L68 76Z" fill="#FF668D"/>
        <path d="M22 28L24 22L26 28L32 30L26 32L24 38L22 32L16 30Z" fill="#FF668D"/>
      </svg>
    `;
  } else if (cid === "career-professional" || cid.includes("career")) {
    return `
      <svg class="explore-hero-art-svg" viewBox="0 0 120 100" fill="none">
        <rect x="24" y="38" width="62" height="42" rx="10" fill="#F0F7FF" stroke="#9CCBFF" stroke-width="2.2"/>
        <path d="M44 38V30C44 26.5 47 24 51 24H59C63 24 66 26.5 66 30V38" stroke="#3B82F6" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="50" y="44" width="10" height="7" rx="2" fill="#9CCBFF" stroke="#3B82F6" stroke-width="1.8"/>
        <line x1="24" y1="48" x2="86" y2="48" stroke="#9CCBFF" stroke-width="1.8"/>
        <path d="M72 65L86 51M86 51H76M86 51V61" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (cid === "entrepreneurship-finance" || cid.includes("finance") || cid.includes("entrepreneur")) {
    return `
      <svg class="explore-hero-art-svg" viewBox="0 0 120 100" fill="none">
        <path d="M50 20C40 20 32 28 32 38C32 45 36 50 40 54C42 56 43 60 43 63H57C57 60 58 56 60 54C64 50 68 45 68 38C68 28 60 20 50 20Z" fill="#FFF9EB" stroke="#FFB63E" stroke-width="2.2"/>
        <rect x="44" y="63" width="12" height="4" rx="1.5" fill="#FFE2A3" stroke="#FFB63E" stroke-width="1.6"/>
        <circle cx="78" cy="56" r="16" fill="#FFF4D6" stroke="#FFB63E" stroke-width="2.2"/>
        <path d="M78 47V65M74 51H80C82 51 83.5 52.5 83.5 54C83.5 55.5 82 56.5 80 56.5H76C74 56.5 72.5 57.5 72.5 59C72.5 60.5 74 62 76 62H82" stroke="#D97706" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    `;
  } else if (cid === "lifestyle-wellness" || cid.includes("lifestyle") || cid.includes("wellness")) {
    return `
      <svg class="explore-hero-art-svg" viewBox="0 0 120 100" fill="none">
        <path d="M60 26C60 42 48 56 38 62C48 64 60 60 60 60C60 60 72 64 82 62C72 56 60 42 60 26Z" fill="#ECFDF5" stroke="#65D6B0" stroke-width="2.2"/>
        <ellipse cx="60" cy="74" rx="24" ry="7" fill="#F0FDF4" stroke="#65D6B0" stroke-width="2"/>
        <circle cx="60" cy="20" r="6" fill="#FDE68A"/>
      </svg>
    `;
  } else if (cid === "social-outdoor" || cid.includes("social") || cid.includes("outdoor")) {
    return `
      <svg class="explore-hero-art-svg" viewBox="0 0 120 100" fill="none">
        <circle cx="56" cy="52" r="32" fill="#FFF6ED" stroke="#FFAB83" stroke-width="2.2"/>
        <polygon points="56,30 63,52 56,50 49,52" fill="#E11D48"/>
        <polygon points="56,74 63,52 56,54 49,52" fill="#94A3B8"/>
        <circle cx="56" cy="52" r="3.5" fill="#242428"/>
      </svg>
    `;
  } else {
    return `
      <svg class="explore-hero-art-svg" viewBox="0 0 120 100" fill="none">
        <circle cx="44" cy="50" r="18" fill="#F5F3FF" stroke="#A987FF" stroke-width="2.2"/>
        <circle cx="44" cy="50" r="8" fill="#FFFFFF" stroke="#A987FF" stroke-width="2"/>
        <rect x="74" y="24" width="8" height="38" rx="3" fill="#DDD6FE" stroke="#7C3AED" stroke-width="1.8"/>
      </svg>
    `;
  }
}

// Controller for the Explore Domain & Workshops page
const ExploreController = {
  currentCategory: "tech-ai",
  searchKeyword: "",
  activeFilter: "all",

  selectedTopicId: null,

  init() {
    this.readUrlParams();
    this.renderDomainTabs();
    this.bindEvents();
    this.renderDomain();
  },

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const topicParam = params.get("topic");

    if (cat) {
      if (cat === "career-skills") this.currentCategory = "career-professional";
      else if (cat === "emerging-practical") this.currentCategory = "emerging-practical";
      else this.currentCategory = cat;
    } else if (topicParam) {
      const categories = window.ORBITO_CATEGORIES || [];
      const found = categories.find(c => (c.topics || []).some(t => String(t.id) === String(topicParam) || t.name.toLowerCase() === topicParam.toLowerCase()));
      if (found) {
        this.currentCategory = found.id;
      } else {
        this.currentCategory = "tech-ai";
      }
    } else {
      this.currentCategory = "tech-ai";
    }

    if (params.has("search")) this.searchKeyword = params.get("search");
    if (params.has("q")) this.searchKeyword = params.get("q");

    if (topicParam) {
      this.selectedTopicId = parseInt(topicParam, 10) || topicParam;
    } else {
      this.selectedTopicId = null;
    }
  },

  bindEvents() {
    const searchInput = document.getElementById("explore-search-input");
    if (searchInput) {
      searchInput.value = this.searchKeyword;
      let debounce;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          this.searchKeyword = e.target.value.trim().toLowerCase();
          this.renderCoursesAndWorkshops();
        }, 200);
      });
    }

    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.activeFilter = pill.getAttribute("data-filter") || "all";
        if (this.activeFilter === "all") {
          this.selectedTopicId = null;
          this.searchKeyword = "";
          if (searchInput) searchInput.value = "";
        }
        this.renderCoursesAndWorkshops();
      });
    });

    // Listen to browser forward/back buttons
    window.addEventListener("popstate", () => {
      this.readUrlParams();
      this.updateActiveTabPill();
      this.renderDomain();
    });
  },

  selectCourse(topicId, event) {
    if (event) event.preventDefault();
    this.selectedTopicId = parseInt(topicId, 10) || topicId;
    window.history.pushState({}, "", `explore.html?category=${encodeURIComponent(this.currentCategory)}&topic=${encodeURIComponent(topicId)}`);
    this.renderCoursesAndWorkshops();
    this.scrollToCourse(topicId);
  },

  scrollToCourse(topicId) {
    setTimeout(() => {
      const card = document.querySelector(`.orbito-course-card[data-course-id="${topicId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
  },

  renderDomainTabs() {
    const track = document.getElementById("domain-tabs-track");
    if (!track) return;

    const categories = window.ORBITO_CATEGORIES || [];
    const domainIcons = {
      "tech-ai": "💻",
      "creativity-arts": "🎨",
      "career-professional": "💼",
      "entrepreneurship-finance": "📈",
      "lifestyle-wellness": "🌿",
      "social-outdoor": "🧭",
      "emerging-practical": "⚡"
    };

    track.innerHTML = categories.map(cat => {
      const isActive = cat.id === this.currentCategory;
      const icon = domainIcons[cat.id] || "✨";
      return `
        <button type="button" class="domain-tab-btn ${isActive ? 'active' : ''}" data-category="${cat.id}">
          <span>${icon}</span>
          <span>${escapeHTML(cat.name)}</span>
        </button>
      `;
    }).join("");

    track.querySelectorAll(".domain-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const catId = btn.getAttribute("data-category");
        this.switchDomain(catId);
      });
    });
  },

  switchDomain(categoryId) {
    this.currentCategory = categoryId;
    this.selectedTopicId = null;
    window.history.pushState({}, "", `explore.html?category=${encodeURIComponent(categoryId)}`);
    this.updateActiveTabPill();
    this.renderDomain();
  },

  updateActiveTabPill() {
    document.querySelectorAll(".domain-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-category") === this.currentCategory) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },

  renderDomain() {
    const categories = window.ORBITO_CATEGORIES || [];
    const cat = categories.find(c => c.id === this.currentCategory) || categories[0];
    if (!cat) return;

    // 1. Update Breadcrumb
    const bc = document.getElementById("breadcrumb-current-domain");
    if (bc) bc.textContent = cat.name;

    // 2. Update Hero
    const heroTitle = document.getElementById("hero-domain-title");
    const heroDesc = document.getElementById("hero-domain-desc");
    const heroBadgeText = document.getElementById("hero-domain-badge-text");
    const statCourses = document.getElementById("stat-courses-count");
    const statWorkshops = document.getElementById("stat-workshops-count");
    const heroArt = document.getElementById("hero-art-container");

    if (heroTitle) heroTitle.textContent = cat.name;
    if (heroDesc) heroDesc.textContent = cat.description;
    if (heroBadgeText) heroBadgeText.textContent = `${cat.name} Domain`;
    if (statCourses) statCourses.textContent = (cat.topics || []).length;

    // Count matching sample workshops
    const matchingWs = (window.SAMPLE_WORKSHOPS || []).filter(w => w.categoryId === cat.id);
    if (statWorkshops) statWorkshops.textContent = matchingWs.length;

    if (heroArt) {
      heroArt.innerHTML = getDomainSvgArt(cat.id);
    }

    // 3. Update Courses Section Heading
    const coursesHeading = document.getElementById("courses-grid-heading");
    const coursesSubtext = document.getElementById("courses-grid-subtext");
    if (coursesHeading) coursesHeading.textContent = `Courses in ${cat.name}`;
    if (coursesSubtext) coursesSubtext.textContent = `Explore all ${(cat.topics || []).length} structured curriculum tracks and hands-on cohorts.`;

    // 4. Update Workshops Section Heading
    const wsHeading = document.getElementById("workshops-grid-heading");
    if (wsHeading) wsHeading.textContent = `Scheduled Live Workshops in ${cat.name}`;

    // 5. Render Courses and Workshops
    this.renderCoursesAndWorkshops();
  },

  renderCoursesAndWorkshops() {
    const categories = window.ORBITO_CATEGORIES || [];
    const cat = categories.find(c => c.id === this.currentCategory) || categories[0];
    if (!cat) return;

    let topics = [...(cat.topics || [])];

    // Filter by search
    if (this.searchKeyword) {
      topics = topics.filter(t =>
        t.name.toLowerCase().includes(this.searchKeyword) ||
        (t.description && t.description.toLowerCase().includes(this.searchKeyword))
      );
    }

    // Filter by pills
    if (this.activeFilter === "popular") {
      topics = topics.filter(t => t.popular);
    } else if (this.activeFilter === "beginner") {
      topics = topics.filter(t => (t.level || "").toLowerCase().includes("beginner"));
    } else if (this.activeFilter === "online") {
      topics = topics.filter(t => (t.format || "").toLowerCase().includes("online") || (t.format || "").toLowerCase().includes("cohort") || (t.format || "").toLowerCase().includes("lab"));
    }

    // Render Courses Grid (Responsive 4-column cards with images & themed fallbacks)
    const coursesGrid = document.getElementById("explore-courses-grid");
    const coursesCountBadge = document.getElementById("courses-count-badge");
    if (coursesCountBadge) {
      coursesCountBadge.textContent = `${topics.length} Courses Available`;
    }

    if (coursesGrid) {
      if (topics.length === 0) {
        coursesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; background: #FFFFFF; border-radius: 24px; border: 1px solid #ECECF2;">
            <p style="font-size: 1.15rem; font-weight: 700; color: #242428;">No courses match "${escapeHTML(this.searchKeyword)}" in ${escapeHTML(cat.name)}</p>
            <p style="color: #6B7280; font-size: 0.9rem; margin-top: 0.35rem;">Try another keyword or click "All Courses" to browse the full curriculum.</p>
          </div>
        `;
      } else {
        coursesGrid.innerHTML = topics.map(topic => {
          const imgUrl = (window.COURSE_IMAGE_MAP && (window.COURSE_IMAGE_MAP[topic.id] || window.COURSE_IMAGE_MAP[topic.name])) || topic.image;
          const isPopular = topic.popular;
          const level = topic.level || "Beginner Friendly";
          const duration = topic.duration || "4 Weeks";
          const description = topic.description || `Practical, hands-on workshop designed to develop real skills in ${topic.name}.`;
          const isSelected = String(this.selectedTopicId) === String(topic.id);

          return `
            <article class="orbito-course-card ${isSelected ? 'is-selected-course' : ''}" data-course-id="${topic.id}">
              <div class="course-card-media">
                ${imgUrl ? `
                  <img src="${escapeHTML(imgUrl)}" alt="${escapeHTML(topic.name)}" class="course-card-img" loading="lazy" onerror="this.parentElement.innerHTML=renderCoursePlaceholder('${escapeHTML(cat.name)}', '${escapeHTML(topic.name)}', '${escapeHTML(cat.id)}')">
                ` : renderCoursePlaceholder(cat.name, topic.name, cat.id)}
                ${isSelected ? `<span class="course-badge-overlay course-badge-selected">Selected</span>` : (isPopular ? `<span class="course-badge-overlay">Popular</span>` : '')}
              </div>

              <div class="course-card-content">
                <div class="course-card-meta-top">
                  <span class="course-domain-tag">${escapeHTML(cat.name)}</span>
                  <span class="course-level-tag">${escapeHTML(level)}</span>
                </div>

                <h4 class="course-card-title">
                  <a href="explore.html?category=${encodeURIComponent(cat.id)}&topic=${encodeURIComponent(topic.id)}" onclick="ExploreController.selectCourse('${encodeURIComponent(topic.id)}', event)">
                    ${escapeHTML(topic.name)}
                  </a>
                </h4>

                <p class="course-card-desc">${escapeHTML(description)}</p>

                <div class="course-card-footer">
                  <div class="course-meta-info">
                    <span class="course-duration">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      ${escapeHTML(duration)}
                    </span>
                  </div>
                  <a href="#explore-workshops-grid" onclick="ExploreController.scrollToWorkshops('${encodeURIComponent(topic.id)}')" class="course-card-arrow-link" aria-label="Explore ${escapeHTML(topic.name)} workshops">
                    <span>View Cohort</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          `;
        }).join("");
      }
    }

    // Render Live Workshops Grid
    const wsGrid = document.getElementById("explore-workshops-grid");
    const wsCountBadge = document.getElementById("workshops-count-badge");

    let workshops = (window.SAMPLE_WORKSHOPS || []).filter(w => w.categoryId === cat.id);
    if (this.searchKeyword) {
      workshops = workshops.filter(w =>
        w.title.toLowerCase().includes(this.searchKeyword) ||
        w.topicName.toLowerCase().includes(this.searchKeyword)
      );
    }
    if (this.activeFilter === "beginner") {
      workshops = workshops.filter(w => (w.level || "").toLowerCase().includes("beginner"));
    } else if (this.activeFilter === "online") {
      workshops = workshops.filter(w => w.format === "online");
    }

    if (wsCountBadge) {
      wsCountBadge.textContent = `${workshops.length} Cohorts Active`;
    }

    if (wsGrid) {
      if (workshops.length === 0) {
        wsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: #FFFFFF; border-radius: 24px; border: 1px dashed #D1D5DB;">
            <p style="font-size: 1.05rem; font-weight: 700; color: #242428;">New cohort schedules for ${escapeHTML(cat.name)} opening soon!</p>
            <p style="color: #6B7280; font-size: 0.88rem; margin-top: 0.35rem;">Browse the courses above and register for priority notification.</p>
          </div>
        `;
      } else {
        wsGrid.innerHTML = workshops.map(renderWorkshopCard).join("");
      }
    }
  },

  scrollToWorkshops(topicId) {
    const wsSection = document.getElementById("explore-workshops-grid");
    if (wsSection) {
      wsSection.scrollIntoView({ behavior: "smooth" });
    }
  }
};

window.renderWorkshopCard = renderWorkshopCard;
window.ExploreController = ExploreController;
window.getDomainSvgArt = getDomainSvgArt;
