import React, { useRef, useState, useEffect, useCallback } from 'react';
import './CategoryScroller.css';

/**
 * Predefined master categories for Orbito Workshop Discovery
 * in the exact required order with alternating pastel themes.
 */
export const ORBITO_CATEGORIES = [
  {
    id: 'tech-ai',
    title: 'Technology and AI',
    slug: 'technology-and-ai',
    accent: 'mint',
    description: 'Generative AI, Python, Cloud computing, Machine Learning & Web Engineering'
  },
  {
    id: 'creativity-arts',
    title: 'Creativity and arts',
    slug: 'creativity-and-arts',
    accent: 'coral',
    description: 'Oil painting, Ceramics, Digital illustration, Crafting & Visual design'
  },
  {
    id: 'career-skills',
    title: 'Career and professional skills',
    slug: 'career-and-professional-skills',
    accent: 'sky',
    description: 'Leadership, Public speaking, Product management & Agile workflows'
  },
  {
    id: 'entrepreneurship-finance',
    title: 'Entrepreneurship and finance',
    slug: 'entrepreneurship-and-finance',
    accent: 'lavender',
    description: 'Startup valuation, Angel investing, Pitch mastery & Financial freedom'
  },
  {
    id: 'lifestyle-wellness',
    title: 'Lifestyle, wellness and personal development',
    slug: 'lifestyle-wellness-and-personal-development',
    accent: 'mint',
    description: 'Mindfulness meditation, Nutrition, Habit engineering & Peak performance'
  },
  {
    id: 'social-outdoor',
    title: 'Social, outdoor and community activities',
    slug: 'social-outdoor-and-community-activities',
    accent: 'coral',
    description: 'Wilderness navigation, Urban photography, Book clubs & Group sports'
  },
  {
    id: 'emerging-practical',
    title: 'Emerging skills and practical life skills',
    slug: 'emerging-skills-and-practical-life-skills',
    accent: 'sky',
    description: 'Home automation, Sustainable living, Woodworking & Hands-on DIY'
  }
];

/**
 * Orbito Identity Icon: Blue-Purple Orbital Planet
 */
const OrbitoOrbitalIcon = () => (
  <svg
    className="orbito-orbital-icon"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="orbitoGrad" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
      <linearGradient id="orbitRingGrad" x1="2" y1="14" x2="26" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    </defs>
    {/* Background ring behind planet */}
    <path
      d="M24.8 11.2C25.4 12.3 24.2 13.9 21.6 15.3C18.2 17.2 13.1 18.2 8.5 17.8C6.5 17.6 4.9 17.1 4.1 16.3"
      stroke="url(#orbitRingGrad)"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.5"
    />
    {/* Central Planet Sphere */}
    <circle cx="14" cy="14" r="7.5" fill="url(#orbitoGrad)" />
    {/* Atmospheric crescent highlight */}
    <path
      d="M10 11.5A5.5 5.5 0 0 1 16.5 8.5"
      stroke="#FFFFFF"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    {/* Foreground orbital ellipse ring crossing over */}
    <path
      d="M3.2 16.8C2.6 15.7 3.8 14.1 6.4 12.7C9.8 10.8 14.9 9.8 19.5 10.2C21.5 10.4 23.1 10.9 23.9 11.7"
      stroke="url(#orbitRingGrad)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Orbiting moon/node */}
    <circle cx="23.5" cy="11.5" r="1.75" fill="#DDD6FE" />
  </svg>
);

/**
 * Bottom-Left Diagonal Arrow Icon
 */
const DiagonalArrowIcon = () => (
  <svg
    className="card-diagonal-arrow-svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

/**
 * Custom High-Quality SVG Vector Illustrations for the 7 categories
 */
const CategoryIllustration = ({ categoryId }) => {
  switch (categoryId) {
    case 'tech-ai':
      return (
        <svg className="category-svg-illustration" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Neural / Silicon AI Chip */}
          <rect x="25" y="20" width="54" height="54" rx="14" fill="#E6F9F0" stroke="#34D399" strokeWidth="2.2" />
          <rect x="36" y="31" width="32" height="32" rx="8" fill="#10B981" fillOpacity="0.15" stroke="#059669" strokeWidth="1.8" />
          {/* Circuit Pins */}
          <line x1="17" y1="36" x2="25" y2="36" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="17" y1="47" x2="25" y2="47" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="17" y1="58" x2="25" y2="58" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="79" y1="36" x2="87" y2="36" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="79" y1="47" x2="87" y2="47" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="79" y1="58" x2="87" y2="58" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="38" y1="12" x2="38" y2="20" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="52" y1="12" x2="52" y2="20" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="66" y1="12" x2="66" y2="20" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
          {/* Sparkling AI Stars */}
          <path d="M94 22L96 16L98 22L104 24L98 26L96 32L94 26L88 24Z" fill="#34D399" />
          <path d="M30 82L31.5 77L33 82L38 83.5L33 85L31.5 90L30 85L25 83.5Z" fill="#6EE7B7" />
          {/* Glowing central core node */}
          <circle cx="52" cy="47" r="5.5" fill="#059669" />
          <circle cx="52" cy="47" r="10" stroke="#10B981" strokeWidth="1.2" strokeDasharray="2 3" />
        </svg>
      );

    case 'creativity-arts':
      return (
        <svg className="category-svg-illustration" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Artist's Palette */}
          <path
            d="M30 68C18 58 20 34 38 25C54 17 76 20 86 33C94 44 91 58 83 66C76 73 66 76 58 74C52 72 49 75 51 80C52 83 49 85 45 84C38 81 35 73 30 68Z"
            fill="#FFF1E8"
            stroke="#FB923C"
            strokeWidth="2.2"
          />
          {/* Palette Thumbhole */}
          <ellipse cx="40" cy="45" rx="5" ry="6" fill="#FFFFFF" stroke="#FB923C" strokeWidth="1.8" />
          {/* Color Dollops */}
          <circle cx="55" cy="30" r="4.5" fill="#FB923C" />
          <circle cx="71" cy="36" r="4.5" fill="#A78BFA" />
          <circle cx="78" cy="52" r="4.5" fill="#34D399" />
          {/* Paintbrush Angled */}
          <path d="M68 76L98 42C100 40 103 40 105 42C107 44 107 47 105 49L75 83Z" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.8" />
          <path d="M68 76L64 85C63 87 60 88 58 86C56 84 57 81 59 80L68 76Z" fill="#EA580C" />
          {/* Sparkle */}
          <path d="M22 28L24 22L26 28L32 30L26 32L24 38L22 32L16 30Z" fill="#FDBA74" />
        </svg>
      );

    case 'career-skills':
      return (
        <svg className="category-svg-illustration" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Professional Portfolio / Briefcase */}
          <rect x="24" y="38" width="62" height="42" rx="10" fill="#EBF7FE" stroke="#38BDF8" strokeWidth="2.2" />
          {/* Handle */}
          <path d="M44 38V30C44 26.5 47 24 51 24H59C63 24 66 26.5 66 30V38" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
          {/* Latch */}
          <rect x="50" y="44" width="10" height="7" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.8" />
          <line x1="24" y1="48" x2="86" y2="48" stroke="#38BDF8" strokeWidth="1.8" />
          {/* Rising Career Growth Arrow / Chart */}
          <path d="M84 72L96 52L106 38" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M96 38H106V48" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Achievement Star */}
          <polygon points="98,18 101,24 107,25 102,29 104,35 98,32 93,35 95,29 90,25 96,24" fill="#38BDF8" />
        </svg>
      );

    case 'entrepreneurship-finance':
      return (
        <svg className="category-svg-illustration" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Startup Rocket Body */}
          <g transform="rotate(35 62 48)">
            <path
              d="M62 18C52 28 48 48 48 58H76C76 48 72 28 62 18Z"
              fill="#F5F3FF"
              stroke="#8B5CF6"
              strokeWidth="2.2"
            />
            {/* Porthole */}
            <circle cx="62" cy="40" r="5" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="1.8" />
            {/* Fins */}
            <path d="M48 50L38 60V64H48" fill="#C4B5FD" stroke="#8B5CF6" strokeWidth="1.8" />
            <path d="M76 50L86 60V64H76" fill="#C4B5FD" stroke="#8B5CF6" strokeWidth="1.8" />
            {/* Flame */}
            <path d="M54 58C56 68 62 76 62 76C62 76 68 68 70 58H54Z" fill="#F43F5E" />
          </g>
          {/* Coin / Currency Token */}
          <circle cx="28" cy="70" r="12" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
          <path d="M28 63V77M25 66H30.5C31.5 66 32.5 67 32.5 68.5C32.5 70 31.5 71 30 71H26C24.5 71 23.5 72 23.5 73.5C23.5 75 24.5 76 26 76H31" stroke="#6D28D9" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'lifestyle-wellness':
      return (
        <svg className="category-svg-illustration" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Serene Lotus Flower */}
          <path
            d="M60 28C60 44 48 58 38 64C48 66 60 62 60 62C60 62 72 66 82 64C72 58 60 44 60 28Z"
            fill="#E6F9F0"
            stroke="#10B981"
            strokeWidth="2.2"
          />
          {/* Left Petal */}
          <path d="M34 50C38 60 48 66 58 66C44 68 32 62 26 52C28 48 30 48 34 50Z" fill="#A7F3D0" stroke="#059669" strokeWidth="1.8" />
          {/* Right Petal */}
          <path d="M86 50C82 60 72 66 62 66C76 68 88 62 94 52C92 48 90 48 86 50Z" fill="#A7F3D0" stroke="#059669" strokeWidth="1.8" />
          {/* Zen Balance Stone Base */}
          <ellipse cx="60" cy="74" rx="24" ry="7" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
          <ellipse cx="60" cy="67" rx="15" ry="4.5" fill="#D1FAE5" stroke="#059669" strokeWidth="1.6" />
          {/* Morning Sun Aura */}
          <circle cx="60" cy="22" r="6" fill="#FDE68A" />
          <line x1="60" y1="10" x2="60" y2="13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="70" y1="14" x2="68" y2="17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="14" x2="52" y2="17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'social-outdoor':
      return (
        <svg className="category-svg-illustration" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Mountain Peak Background */}
          <polygon points="18,74 46,32 68,74" fill="#FFF7ED" stroke="#FB923C" strokeWidth="2" />
          <polygon points="48,74 74,24 102,74" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.2" />
          {/* Snowcaps */}
          <polygon points="74,24 67,38 72,36 76,39 81,35" fill="#FFFFFF" />
          {/* Evergreen Pine Tree */}
          <polygon points="32,74 32,56 26,56 32,46 28,46 34,36 40,46 36,46 42,56 36,56 36,74" fill="#34D399" stroke="#059669" strokeWidth="1.5" />
          {/* Connecting Community Speech Bubbles */}
          <rect x="74" y="38" width="28" height="18" rx="6" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.8" />
          <path d="M80 56L78 61L85 56H80Z" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.8" />
          <circle cx="82" cy="47" r="1.5" fill="#EA580C" />
          <circle cx="88" cy="47" r="1.5" fill="#EA580C" />
          <circle cx="94" cy="47" r="1.5" fill="#EA580C" />
        </svg>
      );

    case 'emerging-practical':
      return (
        <svg className="category-svg-illustration" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Illuminating Innovation Bulb */}
          <path
            d="M52 24C42 24 35 31 35 40C35 46 38 51 42 55C44 57 45 61 45 64H59C59 61 60 57 62 55C66 51 69 46 69 40C69 31 62 24 52 24Z"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="2.2"
          />
          {/* Base screw */}
          <rect x="46" y="64" width="12" height="4" rx="1.5" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="48" y="68" width="8" height="3" rx="1" fill="#7DD3FC" />
          {/* Filament */}
          <path d="M47 43L50 34L54 43L57 34" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Interlocking Mechanics Gear */}
          <g transform="translate(74, 52)">
            <circle cx="16" cy="16" r="13" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <circle cx="16" cy="16" r="5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.8" />
            <rect x="14" y="0" width="4" height="5" rx="1" fill="#0284C7" />
            <rect x="14" y="27" width="4" height="5" rx="1" fill="#0284C7" />
            <rect x="0" y="14" width="5" height="4" rx="1" fill="#0284C7" />
            <rect x="27" y="14" width="5" height="4" rx="1" fill="#0284C7" />
          </g>
          {/* Sparks */}
          <path d="M24 30L26 25L28 30L33 32L28 34L26 39L24 34L19 32Z" fill="#38BDF8" />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * Individual Category Card Component
 */
const CategoryCard = ({ category, isClone = false, onSelect }) => {
  const handleClick = (e) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(category);
    }
  };

  return (
    <div
      className={`category-card accent-${category.accent}`}
      data-category-id={category.id}
      aria-hidden={isClone ? 'true' : undefined}
    >
      <a
        href={`#${category.slug}`}
        className="category-card-link"
        onClick={handleClick}
        tabIndex={isClone ? -1 : 0}
        aria-label={`${category.title} workshops`}
      >
        {/* Top-Left: Category Title */}
        <div className="category-card-header">
          <h3 className="category-card-title">{category.title}</h3>
        </div>

        {/* Card Footer: Arrow on Left, SVG Illustration on Right */}
        <div className="category-card-footer">
          <div className="category-card-arrow-pill" aria-hidden="true">
            <DiagonalArrowIcon />
          </div>

          <div className="category-card-illustration-wrap" aria-hidden="true">
            <CategoryIllustration categoryId={category.id} />
          </div>
        </div>

        {/* Bottom Pastel Accent Strip */}
        <div className="category-card-bottom-strip" aria-hidden="true" />
      </a>
    </div>
  );
};

/**
 * CategoryScroller - Main React Component
 *
 * Props:
 * @param {Array} categories - Optional custom categories list (defaults to ORBITO_CATEGORIES)
 * @param {Function} onSelectCategory - Callback when a category card is clicked
 * @param {string} className - Optional container CSS class name
 */
export const CategoryScroller = ({
  categories = ORBITO_CATEGORIES,
  onSelectCategory,
  className = ''
}) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Manual arrow navigation handler
  const handleScroll = useCallback((direction) => {
    if (!viewportRef.current) return;
    const cardWidth = 390 + 24; // card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    viewportRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  // Touch and pointer interaction handlers
  const handlePointerDown = (e) => {
    setIsPaused(true);
    setIsDragging(true);
    dragStartX.current = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    if (viewportRef.current) {
      scrollLeftStart.current = viewportRef.current.scrollLeft;
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !viewportRef.current) return;
    const currentX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    const walk = (currentX - dragStartX.current) * 1.5;
    viewportRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  // Keyboard accessibility: pause on focus
  const handleFocus = () => setIsPaused(true);
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsPaused(false);
    }
  };

  return (
    <section
      className={`orbito-category-scroller-section ${className}`}
      aria-labelledby="orbito-categories-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="orbito-category-scroller-container">
        {/* Header: Title at top-left with blue-purple orbital icon & scroll controls */}
        <div className="orbito-category-header">
          <div className="orbito-category-title-group">
            <OrbitoOrbitalIcon />
            <h2 id="orbito-categories-heading" className="orbito-category-heading">
              Explore top categories
            </h2>
          </div>

          {/* Accessible Navigation Controls */}
          <div className="orbito-category-nav-controls" aria-label="Category carousel navigation">
            <button
              type="button"
              className="orbito-nav-btn prev"
              onClick={() => handleScroll('left')}
              aria-label="Scroll previous categories"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="orbito-nav-btn next"
              onClick={() => handleScroll('right')}
              aria-label="Scroll next categories"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Viewport & Continuous Marquee Track */}
        <div
          className={`category-scroller-viewport ${isDragging ? 'is-dragging' : ''}`}
          ref={viewportRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          role="region"
          aria-label="Categories horizontal marquee"
          tabIndex={0}
        >
          <div
            className={`category-marquee-track ${isPaused ? 'is-paused' : ''}`}
            ref={trackRef}
          >
            {/* Primary Track: Accessible & keyboard navigable */}
            <div className="category-track-group">
              {categories.map((category) => (
                <CategoryCard
                  key={`primary-${category.id}`}
                  category={category}
                  onSelect={onSelectCategory}
                />
              ))}
            </div>

            {/* Cloned Track: Purely visual duplicate for seamless infinite loop */}
            <div className="category-track-group is-clone" aria-hidden="true">
              {categories.map((category) => (
                <CategoryCard
                  key={`clone-${category.id}`}
                  category={category}
                  isClone
                  onSelect={onSelectCategory}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryScroller;
