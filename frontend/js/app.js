/**
 * Orbito - Global Application Utilities
 * Navigation, Meetup-Style Search & Location Selectors, Auth Modals, and Toasts
 */

// Safe HTML escaper to prevent XSS
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Inline SVG Icon Provider
function getIcon(name, className = "icon") {
  const icons = {
    search: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    mapPin: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    globe: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    chevronDown: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    code: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    palette: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path></svg>`,
    briefcase: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    "trending-up": `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    heart: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    compass: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
    tool: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    calendar: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    clock: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    video: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    user: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    check: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    chevronRight: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    star: `<svg class="${className}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    x: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    award: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`
  };

  return icons[name] || `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
}

// Toast Notification Manager
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const iconMarkup = type === "success" ? getIcon("check") : getIcon("x");
  toast.innerHTML = `
    <span style="color: ${type === "success" ? "var(--success)" : "var(--danger)"}">${iconMarkup}</span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Header Sticky Shadow on Scroll
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

// Meetup-Style Header Search Handler
function initHeaderSearch() {
  const searchInput = document.getElementById("header-search-input");
  const searchBtn = document.getElementById("header-search-btn");
  const locationText = document.getElementById("header-location-val");

  const performSearch = () => {
    const query = searchInput ? searchInput.value.trim() : "";
    const loc = locationText ? locationText.textContent.trim() : "Bhimavaram, IN";
    
    let target = `explore.html?`;
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (loc) params.append("location", loc);
    
    window.location.href = `explore.html?${params.toString()}`;
  };

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      performSearch();
    });
  }

  // Location Selector Modal / Popover
  const locationGroup = document.getElementById("header-location-group");
  if (locationGroup) {
    locationGroup.addEventListener("click", () => {
      openLocationModal(locationText ? locationText.textContent : "Bhimavaram, IN");
    });
  }
}

// Location Selector Modal
function openLocationModal(currentLocation) {
  let modalOverlay = document.getElementById("location-modal");
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "location-modal";
    modalOverlay.className = "modal-overlay";
    document.body.appendChild(modalOverlay);
  }

  const popularCities = [
    "Bhimavaram, IN",
    "Hyderabad, IN",
    "Bengaluru, IN",
    "Vijayawada, IN",
    "Visakhapatnam, IN",
    "Chennai, IN",
    "Mumbai, IN",
    "Online (Everywhere)"
  ];

  modalOverlay.innerHTML = `
    <div class="modal-content" style="max-width: 440px;">
      <button class="modal-close-btn" id="loc-modal-close" aria-label="Close dialog">
        ${getIcon("x")}
      </button>

      <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
        Select Workshop Location
      </h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
        Discover in-person meetups and cohorts happening near your city.
      </p>

      <div class="form-group">
        <label class="form-label" for="custom-city-input">Custom City or Postal Code</label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="custom-city-input" class="form-control" value="${escapeHTML(currentLocation)}" placeholder="Enter city name...">
          <button type="button" class="btn btn-primary" id="custom-city-apply">Apply</button>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.75rem;">
          Popular Regions
        </span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${popularCities.map(city => `
            <button type="button" class="btn btn-secondary btn-sm city-quick-btn" data-city="${escapeHTML(city)}" style="${city === currentLocation ? 'border-color: var(--charcoal); background: var(--charcoal); color: #FFF;' : ''}">
              ${escapeHTML(city)}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add("open");
  const closeModal = () => modalOverlay.classList.remove("open");
  modalOverlay.querySelector("#loc-modal-close").onclick = closeModal;
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
  };

  const applyCity = (city) => {
    const locText = document.getElementById("header-location-val");
    if (locText) locText.textContent = city;
    showToast(`Location set to ${city}`, "success");
    closeModal();
  };

  modalOverlay.querySelector("#custom-city-apply").onclick = () => {
    const val = modalOverlay.querySelector("#custom-city-input").value.trim();
    if (val) applyCity(val);
  };

  modalOverlay.querySelectorAll(".city-quick-btn").forEach(btn => {
    btn.onclick = () => applyCity(btn.dataset.city);
  });
}

// Language Selector Dropdown / Modal
function initLanguageSelector() {
  const langBtn = document.getElementById("header-lang-btn");
  if (!langBtn) return;

  const languages = [
    { code: "en", name: "English (US)", active: true },
    { code: "te", name: "తెలుగు (Telugu)", active: false },
    { code: "hi", name: "हिन्दी (Hindi)", active: false },
    { code: "es", name: "Español (Spanish)", active: false },
    { code: "fr", name: "Français (French)", active: false },
    { code: "de", name: "Deutsch (German)", active: false }
  ];

  langBtn.addEventListener("click", () => {
    let modalOverlay = document.getElementById("lang-modal");
    if (!modalOverlay) {
      modalOverlay = document.createElement("div");
      modalOverlay.id = "lang-modal";
      modalOverlay.className = "modal-overlay";
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="modal-content" style="max-width: 400px;">
        <button class="modal-close-btn" id="lang-modal-close">
          ${getIcon("x")}
        </button>

        <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
          Select Language
        </h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          Choose your interface language preference.
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${languages.map(l => `
            <button type="button" class="lang-option-row" data-lang="${escapeHTML(l.name)}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: #FFF; text-align: left; cursor: pointer; transition: background 0.15s ease;">
              <span style="font-weight: 600; color: var(--text-primary);">${escapeHTML(l.name)}</span>
              ${l.active ? `<span style="color: var(--success);">${getIcon("check", "icon-sm")}</span>` : ''}
            </button>
          `).join("")}
        </div>
      </div>
    `;

    modalOverlay.classList.add("open");
    const closeModal = () => modalOverlay.classList.remove("open");
    modalOverlay.querySelector("#lang-modal-close").onclick = closeModal;
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) closeModal();
    };

    modalOverlay.querySelectorAll(".lang-option-row").forEach(btn => {
      btn.onclick = () => {
        const langName = btn.dataset.lang;
        const currentLangEl = document.getElementById("current-lang-text");
        if (currentLangEl) currentLangEl.textContent = langName.split(" ")[0];
        showToast(`Language set to ${langName}`, "success");
        closeModal();
      };
    });
  });
}

// Authentication State & Modals (Log In, Sign Up, Account Symbol & Log Out)
function getSavedUser() {
  try {
    const raw = localStorage.getItem("orbito_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem("orbito_user", JSON.stringify(user));
  } catch (e) {}
}

function clearUser() {
  try {
    localStorage.removeItem("orbito_user");
  } catch (e) {}
}

function renderAuthState() {
  const headerRight = document.querySelector(".header-right-group") || document.querySelector(".nav-actions");
  if (!headerRight) return;

  const loginLinks = document.querySelectorAll(".auth-trigger-login");
  const signupButtons = document.querySelectorAll(".auth-trigger-signup");
  const existingMenu = document.getElementById("header-account-menu");

  const user = getSavedUser();

  if (user && user.loggedIn) {
    // Hide standard login/signup triggers
    loginLinks.forEach(el => el.style.display = "none");
    signupButtons.forEach(el => el.style.display = "none");

    const firstName = (user.name || "Learner").trim().split(" ")[0];
    const initials = (user.name || "Alex Morgan")
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const roleBadgeHtml = user.role === "organizer"
      ? `<span class="dropdown-user-badge" style="background:#EDE9FE; color:#7C3AED;">Workshop Organizer</span>`
      : user.role === "admin"
      ? `<span class="dropdown-user-badge" style="background:#FEF3C7; color:#D97706;">Administrator</span>`
      : `<span class="dropdown-user-badge">Active Learner</span>`;

    const organizerLinksHtml = (user.role === "organizer" || user.role === "admin") ? `
      <a href="organizer-dashboard.html" class="dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span>Organizer Dashboard</span>
      </a>
      <a href="create-workshop.html" class="dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <span>Create New Workshop</span>
      </a>
    ` : '';

    const adminLinksHtml = user.role === "admin" ? `
      <a href="admin-review.html" class="dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span>Admin Review Portal</span>
      </a>
    ` : '';

    const participantLinksHtml = (user.role !== "organizer" && user.role !== "admin") ? `
      <a href="quiz.html" class="dropdown-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
        <span>Retake Interest Quiz</span>
      </a>
    ` : '';

    if (!existingMenu) {
      const menuEl = document.createElement("div");
      menuEl.className = "header-account-menu";
      menuEl.id = "header-account-menu";
      menuEl.innerHTML = `
        <button type="button" class="header-account-btn" id="header-account-btn" aria-haspopup="true" aria-expanded="false" aria-label="Open account menu for ${escapeHTML(user.name)}">
          <span class="account-avatar-circle" title="${escapeHTML(user.name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="account-icon-svg" width="16" height="16" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <span class="account-name-label">${escapeHTML(firstName)}</span>
          <svg class="account-chevron-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div class="header-account-dropdown" id="header-account-dropdown" role="menu" aria-label="Account options">
          <div class="dropdown-user-header">
            <div class="dropdown-user-avatar">${escapeHTML(initials)}</div>
            <div class="dropdown-user-info">
              <strong class="dropdown-user-name">${escapeHTML(user.name || "Learner")}</strong>
              <span class="dropdown-user-email">${escapeHTML(user.email || "learner@orbito.io")}</span>
              ${roleBadgeHtml}
            </div>
          </div>
          <div class="dropdown-divider"></div>
          ${organizerLinksHtml}
          ${adminLinksHtml}
          ${participantLinksHtml}
          <div class="dropdown-divider"></div>
          <button type="button" class="dropdown-item dropdown-logout-btn" id="dropdown-logout-btn" role="menuitem">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Log out</span>
          </button>
        </div>
      `;

      headerRight.appendChild(menuEl);

      const triggerBtn = menuEl.querySelector("#header-account-btn");
      const dropdown = menuEl.querySelector("#header-account-dropdown");
      const logoutBtn = menuEl.querySelector("#dropdown-logout-btn");

      triggerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle("open");
        triggerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      logoutBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.remove("open");
        triggerBtn.setAttribute("aria-expanded", "false");
        clearUser();
        if (window.OrbitoAPI && window.OrbitoAPI.setAuthToken) {
          window.OrbitoAPI.setAuthToken("");
        }
        renderAuthState();
        showToast("You have been logged out successfully.", "success");
        if (window.location.pathname.includes("organizer-dashboard.html") || 
            window.location.pathname.includes("create-workshop.html") ||
            window.location.pathname.includes("admin-review.html")) {
          setTimeout(() => { window.location.href = "index.html"; }, 500);
        }
      });

      document.addEventListener("click", (e) => {
        if (!menuEl.contains(e.target)) {
          dropdown.classList.remove("open");
          triggerBtn.setAttribute("aria-expanded", "false");
        }
      });
    }
  } else {
    // Show standard login/signup buttons
    loginLinks.forEach(el => el.style.display = "");
    signupButtons.forEach(el => el.style.display = "");

    if (existingMenu) {
      existingMenu.remove();
    }
  }
}

function initAuthModals() {
  const loginBtns = document.querySelectorAll(".auth-trigger-login");
  const signupBtns = document.querySelectorAll(".auth-trigger-signup");

  const openAuthModal = (isSignUp = false) => {
    let modalOverlay = document.getElementById("auth-modal");
    if (!modalOverlay) {
      modalOverlay = document.createElement("div");
      modalOverlay.id = "auth-modal";
      modalOverlay.className = "modal-overlay";
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="modal-content" style="max-width: 480px;">
        <button class="modal-close-btn" id="auth-modal-close" aria-label="Close dialog">
          ${getIcon("x")}
        </button>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h3 id="auth-title" style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.35rem;">
            ${isSignUp ? "Join Orbito" : "Welcome Back"}
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">
            ${isSignUp ? "Choose your role and get started with the Orbito community." : "Log in to access your workshops, cohort recommendations, or dashboard."}
          </p>
        </div>

        <div id="auth-error-banner" style="display: none; background-color: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1.25rem;"></div>

        <form id="auth-form">
          ${isSignUp ? `
            <!-- Account Type Choice: Participant vs Organizer -->
            <div class="auth-account-type-group">
              <label class="auth-account-type-label">Select Account Type</label>
              <div class="account-type-selector-pills">
                <label class="account-type-option active" id="opt-type-participant">
                  <input type="radio" name="auth-account-type" value="participant" checked>
                  <span class="option-title">🎓 Participant</span>
                  <span class="option-subtitle">Explore & attend workshops</span>
                </label>
                <label class="account-type-option" id="opt-type-organizer">
                  <input type="radio" name="auth-account-type" value="organizer">
                  <span class="option-title">🎙️ Workshop Organizer</span>
                  <span class="option-subtitle">Teach & host workshops</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="auth-input-name">Full Name *</label>
              <input type="text" id="auth-input-name" class="form-control" placeholder="e.g. Dr. Elena Rostova" required>
            </div>

            <!-- Organizer title field (revealed when Organizer selected) -->
            <div class="form-group" id="organizer-title-field" style="display: none;">
              <label class="form-label" for="auth-input-title">Professional Title / Area of Expertise</label>
              <input type="text" id="auth-input-title" class="form-control" placeholder="e.g. Senior AI Researcher & Educator">
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label" for="auth-input-email">Email Address *</label>
            <input type="email" id="auth-input-email" class="form-control" placeholder="name@example.com" value="" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="auth-input-password">Password *</label>
            <input type="password" id="auth-input-password" class="form-control" placeholder="At least 6 characters" value="" required>
          </div>

          <button type="submit" id="auth-submit-btn" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 0.5rem;">
            ${isSignUp ? "Create Free Account" : "Log In"}
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary);">
          ${isSignUp ? `
            Already have an account? <a href="#" id="switch-to-login" style="font-weight: 700; color: var(--charcoal);">Log in</a>
          ` : `
            Don't have an account? <a href="#" id="switch-to-signup" style="font-weight: 700; color: var(--charcoal);">Sign up</a>
          `}
        </div>
      </div>
    `;

    modalOverlay.classList.add("open");
    const closeModal = () => modalOverlay.classList.remove("open");
    modalOverlay.querySelector("#auth-modal-close").onclick = closeModal;
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) closeModal();
    };

    // Handle account type toggle behavior
    if (isSignUp) {
      const typeOptions = modalOverlay.querySelectorAll(".account-type-option");
      const titleField = modalOverlay.querySelector("#organizer-title-field");
      typeOptions.forEach(opt => {
        opt.addEventListener("click", () => {
          typeOptions.forEach(o => o.classList.remove("active"));
          opt.classList.add("active");
          const radio = opt.querySelector("input[type='radio']");
          if (radio) radio.checked = true;
          if (titleField) {
            titleField.style.display = (radio && radio.value === "organizer") ? "block" : "none";
          }
        });
      });
    }

    const form = modalOverlay.querySelector("#auth-form");
    const errorBanner = modalOverlay.querySelector("#auth-error-banner");
    const submitBtn = modalOverlay.querySelector("#auth-submit-btn");

    form.onsubmit = async (e) => {
      e.preventDefault();
      errorBanner.style.display = "none";
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Authenticating...";

      const emailInput = form.querySelector("#auth-input-email");
      const passwordInput = form.querySelector("#auth-input-password");
      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      try {
        if (isSignUp) {
          const nameInput = form.querySelector("#auth-input-name");
          const titleInput = form.querySelector("#auth-input-title");
          const typeRadio = form.querySelector("input[name='auth-account-type']:checked");
          const fullName = nameInput ? nameInput.value.trim() : "New User";
          const accountType = typeRadio ? typeRadio.value : "participant";
          const professionalTitle = titleInput ? titleInput.value.trim() : "";

          let authResponse = null;
          if (window.OrbitoAPI && window.OrbitoAPI.apiSignup) {
            try {
              authResponse = await window.OrbitoAPI.apiSignup(fullName, email, password, accountType, professionalTitle);
            } catch (err) {
              // If backend validation error occurred
              if (err.detail || err.status) {
                throw err;
              }
            }
          }

          const user = {
            id: (authResponse && authResponse.user && authResponse.user.id) || ("usr-" + Date.now()),
            name: fullName,
            email: email,
            role: accountType,
            professionalTitle: professionalTitle,
            loggedIn: true,
            loginAt: new Date().toISOString()
          };

          saveUser(user);
          closeModal();
          renderAuthState();
          showToast(`Welcome to Orbito, ${fullName.split(" ")[0]}!`, "success");

          if (accountType === "organizer") {
            setTimeout(() => {
              window.location.href = "organizer-dashboard.html";
            }, 600);
          }
        } else {
          // Login Flow
          let authResponse = null;
          if (window.OrbitoAPI && window.OrbitoAPI.apiLogin) {
            try {
              authResponse = await window.OrbitoAPI.apiLogin(email, password);
            } catch (err) {
              if (err.detail || err.status) {
                throw err;
              }
            }
          }

          let userRole = "participant";
          let fullName = "Learner";
          let professionalTitle = "";

          if (authResponse && authResponse.user) {
            userRole = authResponse.user.role;
            fullName = authResponse.user.fullName;
            professionalTitle = authResponse.user.professionalTitle || "";
          } else {
            // Local fallback role detection for quick evaluation
            if (email.includes("organizer")) {
              userRole = "organizer";
              fullName = "Dr. Elena Rostova";
              professionalTitle = "Senior AI Researcher & Educator";
            } else if (email.includes("admin")) {
              userRole = "admin";
              fullName = "Orbito Admin";
              professionalTitle = "Platform Director";
            } else {
              fullName = "Alex Morgan";
            }
          }

          const user = {
            id: (authResponse && authResponse.user && authResponse.user.id) || ("usr-" + Date.now()),
            name: fullName,
            email: email,
            role: userRole,
            professionalTitle: professionalTitle,
            loggedIn: true,
            loginAt: new Date().toISOString()
          };

          saveUser(user);
          closeModal();
          renderAuthState();
          showToast(`Welcome back, ${fullName.split(" ")[0]}!`, "success");

          if (userRole === "organizer") {
            setTimeout(() => {
              window.location.href = "organizer-dashboard.html";
            }, 600);
          } else if (userRole === "admin") {
            setTimeout(() => {
              window.location.href = "admin-review.html";
            }, 600);
          }
        }
      } catch (err) {
        errorBanner.textContent = err.detail || err.message || "Authentication failed. Please verify credentials.";
        errorBanner.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    };

    const switchLogin = modalOverlay.querySelector("#switch-to-login");
    if (switchLogin) switchLogin.onclick = (e) => { e.preventDefault(); openAuthModal(false); };

    const switchSignup = modalOverlay.querySelector("#switch-to-signup");
    if (switchSignup) switchSignup.onclick = (e) => { e.preventDefault(); openAuthModal(true); };
  };

  loginBtns.forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); openAuthModal(false); }));
  signupBtns.forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); openAuthModal(true); }));

  // Render initial auth state from localStorage on load
  renderAuthState();
}

// Universal Registration Modal Controller
function openRegistrationModal(workshopId) {
  const workshop = (window.SAMPLE_WORKSHOPS || []).find(w => w.id === workshopId);
  if (!workshop) {
    showToast("Workshop not found", "error");
    return;
  }

  let modalOverlay = document.getElementById("registration-modal");
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "registration-modal";
    modalOverlay.className = "modal-overlay";
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="reg-modal-title">
      <button class="modal-close-btn" id="modal-close-trigger" aria-label="Close dialog">
        ${getIcon("x")}
      </button>

      <div style="margin-bottom: 1.5rem;">
        <span class="badge badge-primary" style="margin-bottom: 0.5rem;">Demo Event Registration</span>
        <h3 id="reg-modal-title" style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
          ${escapeHTML(workshop.title)}
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">
          ${escapeHTML(workshop.date)} • ${escapeHTML(workshop.time)} • ${escapeHTML(workshop.priceLabel)}
        </p>
      </div>

      <form id="registration-form">
        <input type="hidden" name="workshopId" value="${escapeHTML(workshop.id)}">

        <div class="form-group">
          <label class="form-label" for="reg-name">Full Name *</label>
          <input type="text" id="reg-name" name="fullName" class="form-control" placeholder="e.g. Alex Morgan" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Email Address *</label>
          <input type="email" id="reg-email" name="email" class="form-control" placeholder="alex@example.com" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-phone">Phone Number (Optional)</label>
          <input type="tel" id="reg-phone" name="phone" class="form-control" placeholder="+1 (555) 000-0000">
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-goal">What do you hope to get out of this workshop?</label>
          <textarea id="reg-goal" name="learningGoal" rows="2" class="form-control" placeholder="Briefly share your learning goal..."></textarea>
        </div>

        <div style="background: var(--bg-primary); border: 1px solid var(--border-light); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Notice: This is a demonstration enrollment. A verified demo registration record will be generated.
        </div>

        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="modal-submit-btn">
            <span>Confirm Registration</span>
          </button>
        </div>
      </form>
    </div>
  `;

  modalOverlay.classList.add("open");

  const closeModal = () => modalOverlay.classList.remove("open");
  modalOverlay.querySelector("#modal-close-trigger").onclick = closeModal;
  modalOverlay.querySelector("#modal-cancel-btn").onclick = closeModal;
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
  };

  const form = modalOverlay.querySelector("#registration-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = modalOverlay.querySelector("#modal-submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Processing...</span>`;

    const formData = new FormData(form);
    const payload = {
      workshopId: formData.get("workshopId"),
      fullName: formData.get("fullName").trim(),
      email: formData.get("email").trim(),
      phone: formData.get("phone").trim(),
      learningGoal: formData.get("learningGoal").trim()
    };

    try {
      const response = await window.OrbitoAPI.submitRegistration(payload);
      closeModal();
      openSuccessModal(response.registration, workshop);
      showToast("Registration confirmed successfully!", "success");
    } catch (err) {
      showToast("Registration failed: " + err.message, "error");
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Confirm Registration</span>`;
    }
  };
}

// Success Registration Modal Confirmation
function openSuccessModal(registration, workshop) {
  let modalOverlay = document.getElementById("success-modal");
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "success-modal";
    modalOverlay.className = "modal-overlay";
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="modal-content" style="text-align: center;">
      <div style="width: 4rem; height: 4rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
        ${getIcon("check")}
      </div>

      <span class="badge badge-free" style="margin-bottom: 0.5rem;">Registration Confirmed</span>
      <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
        You're All Set!
      </h3>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
        A confirmation has been prepared for <strong>${escapeHTML(registration.fullName)}</strong>.
      </p>

      <div style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.875rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; border-bottom: 1px dashed var(--border-light); padding-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Confirmation Code:</span>
          <strong style="color: var(--charcoal); font-family: monospace;">${escapeHTML(registration.registrationId)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Workshop:</span>
          <strong style="color: var(--text-primary); max-width: 200px; text-align: right;">${escapeHTML(workshop.title)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Date & Time:</span>
          <span>${escapeHTML(workshop.date)} • ${escapeHTML(workshop.time)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Format:</span>
          <span style="text-transform: capitalize;">${escapeHTML(workshop.format)} (${escapeHTML(workshop.location)})</span>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: center;">
        <button class="btn btn-secondary" id="success-done-btn">Done</button>
        <a href="explore.html" class="btn btn-primary">Discover More</a>
      </div>
    </div>
  `;

  modalOverlay.classList.add("open");
  const closeSuccess = () => modalOverlay.classList.remove("open");
  modalOverlay.querySelector("#success-done-btn").onclick = closeSuccess;
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeSuccess();
  };
}

// Horizontal Category Carousel Handler
function initInterestsCarousel() {
  const viewport = document.getElementById("interests-cards-viewport");
  const prevBtn = document.getElementById("interests-nav-prev");
  const nextBtn = document.getElementById("interests-nav-next");
  const thumb = document.getElementById("interests-scroll-thumb");

  if (!viewport || !prevBtn || !nextBtn) return;

  const updateControls = () => {
    const scrollLeft = viewport.scrollLeft;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const isAtStart = scrollLeft <= 6;
    const isAtEnd = scrollLeft >= maxScroll - 6;

    prevBtn.disabled = isAtStart;
    prevBtn.classList.toggle("is-disabled", isAtStart);

    nextBtn.disabled = isAtEnd;
    nextBtn.classList.toggle("is-disabled", isAtEnd);

    if (thumb && maxScroll > 0) {
      const percentage = Math.max(0, Math.min(1, scrollLeft / maxScroll));
      const thumbMaxTravel = (100 - 32) / 32 * 100;
      thumb.style.transform = `translateX(${percentage * thumbMaxTravel}%)`;
    }
  };

  const getScrollAmount = () => {
    const card = viewport.querySelector(".interest-category-card");
    return card ? card.offsetWidth + 24 : 344;
  };

  prevBtn.addEventListener("click", () => {
    viewport.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    viewport.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });

  viewport.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls, { passive: true });

  // Mouse drag panning support
  let isPointerDown = false;
  let startX = 0;
  let initialScroll = 0;

  viewport.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isPointerDown = true;
    viewport.classList.add("is-dragging");
    startX = e.pageX - viewport.offsetLeft;
    initialScroll = viewport.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    viewport.classList.remove("is-dragging");
  });

  viewport.addEventListener("mousemove", (e) => {
    if (!isPointerDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.4;
    viewport.scrollLeft = initialScroll - walk;
  });

  // Initial calculation
  setTimeout(updateControls, 100);
}

/**
 * Initialize "How Orbito Works" section interactions
 */
function initHowOrbitoWorks() {
  const recLink = document.getElementById("how-link-recommendations");
  if (recLink) {
    recLink.addEventListener("click", (e) => {
      e.preventDefault();
      let hasRecs = false;
      try {
        const stored = sessionStorage.getItem("orbito_latest_recommendations") || localStorage.getItem("orbito_latest_recommendations");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed) {
            if (Array.isArray(parsed) && parsed.length > 0) {
              hasRecs = true;
            } else if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
              hasRecs = true;
            }
          }
        }
      } catch (err) {
        hasRecs = false;
      }

      if (hasRecs) {
        window.location.href = "recommendations.html";
      } else {
        window.location.href = "quiz.html";
      }
    });
  }
}

/**
 * Render Fallback Placeholder for Course Cards
 */
function renderCoursePlaceholder(categoryName, topicName, categoryId) {
  const cat = (categoryName || "").toLowerCase();
  const cid = (categoryId || "").toLowerCase();
  const isCreativity = cid.includes("creativity") || cat.includes("creativity") || cat.includes("art");
  const isCareer = cid.includes("career") || cat.includes("career");
  const isFinance = cid.includes("finance") || cat.includes("finance") || cat.includes("entrepreneur");
  const isLifestyle = cid.includes("lifestyle") || cat.includes("lifestyle") || cat.includes("wellness");

  let phClass = "course-card-placeholder";
  let strokeColor = "#7C3AED";
  let iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;

  if (isCreativity) {
    phClass += " creativity-placeholder";
    strokeColor = "#EC4899";
    iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="${strokeColor}"></circle><circle cx="17.5" cy="10.5" r=".5" fill="${strokeColor}"></circle><circle cx="8.5" cy="7.5" r=".5" fill="${strokeColor}"></circle><circle cx="6.5" cy="12.5" r=".5" fill="${strokeColor}"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path></svg>`;
  } else if (isCareer) {
    phClass += " career-placeholder";
    strokeColor = "#2563EB";
    iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
  } else if (isFinance) {
    phClass += " finance-placeholder";
    strokeColor = "#D97706";
    iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
  } else if (isLifestyle) {
    phClass += " lifestyle-placeholder";
    strokeColor = "#059669";
    iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
  }

  return `
    <div class="${phClass}" aria-label="${escapeHTML(topicName)}">
      <div class="placeholder-icon-bubble">
        ${iconSvg}
      </div>
      <span class="placeholder-badge">${escapeHTML(categoryName)}</span>
    </div>
  `;
}

/**
 * Domain Courses Explorer Interactive Controller
 */
const DomainCoursesExplorer = {
  activeCategoryId: "tech-ai",

  init() {
    this.bindCategoryCardClicks();
    // Mark initial active card
    const initialCard = document.querySelector(`.interest-category-card[data-category="${this.activeCategoryId}"]`);
    if (initialCard) initialCard.classList.add("is-selected-domain");
  },

  bindCategoryCardClicks() {
    const cards = document.querySelectorAll(".interest-category-card");
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener("click", (e) => {
        // If clicking the diagonal arrow button directly, allow navigation to explore.html
        if (e.target.closest(".card-diagonal-arrow-btn")) {
          return;
        }
        e.preventDefault();
        const categoryId = card.getAttribute("data-category");
        if (categoryId) {
          this.setActiveCategory(categoryId);
        }
      });
    });
  },

  setActiveCategory(categoryId) {
    this.activeCategoryId = categoryId;

    // Visual active highlight on category carousel card
    document.querySelectorAll(".interest-category-card").forEach(c => {
      if (c.getAttribute("data-category") === categoryId) {
        c.classList.add("is-selected-domain");
      } else {
        c.classList.remove("is-selected-domain");
      }
    });

    this.renderCategoryCourses(categoryId);
  },

  renderCategoryCourses(categoryId) {
    const grid = document.getElementById("domain-courses-grid");
    if (!grid) return;

    let lookupId = categoryId;
    if (lookupId === "career-skills") lookupId = "career-professional";

    const categories = window.ORBITO_CATEGORIES || [];
    const category = categories.find(c => c.id === lookupId || c.id === categoryId) || categories[0];
    if (!category) return;

    // Update Header
    const badgePill = document.getElementById("domain-badge-pill");
    const heading = document.getElementById("domain-courses-title");
    const subtitle = document.getElementById("domain-courses-subtitle");
    const allBtn = document.getElementById("btn-domain-all-workshops");
    const allBtnLabel = document.getElementById("domain-all-workshops-label");

    if (badgePill) {
      badgePill.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        ${escapeHTML(category.name)}
      `;
    }
    if (heading) heading.textContent = `Courses in ${category.name}`;
    if (subtitle) subtitle.textContent = category.description || "Browse curated workshops, bootcamps, and masterclasses across this domain.";
    if (allBtn) allBtn.href = `explore.html?category=${category.id}`;
    if (allBtnLabel) allBtnLabel.textContent = `View all ${category.name} workshops`;

    // Render topics / courses
    const topics = category.topics || [];
    grid.innerHTML = topics.map(topic => {
      const imgUrl = (window.COURSE_IMAGE_MAP && (window.COURSE_IMAGE_MAP[topic.id] || window.COURSE_IMAGE_MAP[topic.name])) || topic.image;
      const isPopular = topic.popular;
      const level = topic.level || "Beginner";
      const duration = topic.duration || "4 Weeks";
      const description = topic.description || `Practical, hands-on workshop designed to develop real skills in ${topic.name}.`;

      return `
        <article class="orbito-course-card" data-course-id="${topic.id}">
          <div class="course-card-media">
            ${imgUrl ? `
              <img src="${escapeHTML(imgUrl)}" alt="${escapeHTML(topic.name)}" class="course-card-img" loading="lazy" onerror="this.parentElement.innerHTML=renderCoursePlaceholder('${escapeHTML(category.name)}', '${escapeHTML(topic.name)}', '${escapeHTML(category.id)}')">
            ` : renderCoursePlaceholder(category.name, topic.name, category.id)}
            ${isPopular ? `<span class="course-badge-overlay">Popular</span>` : ''}
          </div>

          <div class="course-card-content">
            <div class="course-card-meta-top">
              <span class="course-domain-tag">${escapeHTML(category.name)}</span>
              <span class="course-level-tag">${escapeHTML(level)}</span>
            </div>

            <h4 class="course-card-title">
              <a href="explore.html?category=${encodeURIComponent(category.id)}&topic=${encodeURIComponent(topic.id)}">
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
              <a href="explore.html?category=${encodeURIComponent(category.id)}&topic=${encodeURIComponent(topic.id)}" class="course-card-arrow-link" aria-label="Explore ${escapeHTML(topic.name)}">
                <span>Explore</span>
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
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initHeaderSearch();
  initLanguageSelector();
  initAuthModals();
  initInterestsCarousel();
  initHowOrbitoWorks();
  DomainCoursesExplorer.init();
});

// Expose globals
window.escapeHTML = escapeHTML;
window.getIcon = getIcon;
window.showToast = showToast;
window.openRegistrationModal = openRegistrationModal;
window.openSuccessModal = openSuccessModal;
window.initInterestsCarousel = initInterestsCarousel;
window.initHowOrbitoWorks = initHowOrbitoWorks;
window.DomainCoursesExplorer = DomainCoursesExplorer;
window.renderCoursePlaceholder = renderCoursePlaceholder;

