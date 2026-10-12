import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WorkshopCard from './WorkshopCard';
import { CATEGORIES, getCategoryBySlug, getWorkshopsByCategory } from '../data/workshops';

export default function CategoryDetailPage() {
  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Category workshops
  const allCategoryWorkshops = useMemo(() => {
    return category ? getWorkshopsByCategory(category.slug) : [];
  }, [category]);

  // Distinct types available in this category
  const availableTypes = useMemo(() => {
    const types = new Set(allCategoryWorkshops.map(w => w.type));
    return ['All', ...Array.from(types)];
  }, [allCategoryWorkshops]);

  // Filtered workshops based on title search and type filter
  const filteredWorkshops = useMemo(() => {
    return allCategoryWorkshops.filter(workshop => {
      const matchesSearch = workshop.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim()) ||
        workshop.description.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesType = selectedType === 'All' || workshop.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [allCategoryWorkshops, searchQuery, selectedType]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
  };

  if (!category) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Category Not Found
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            We couldn't find the category "<code>{categorySlug}</code>".
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            ← Return to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Category Hero Art based on category id
  const renderCategoryHeroArt = () => {
    switch (category.id) {
      case 'technology-ai':
        return (
          <svg className="category-hero-art-svg" viewBox="0 0 240 180" fill="none">
            <rect x="30" y="30" width="180" height="110" rx="16" fill="#F5F3FF" stroke="#A987FF" strokeWidth="3" />
            <rect x="50" y="50" width="140" height="65" rx="8" fill="#EDE9FE" />
            <path d="M70 70L85 85L70 100" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="95" y1="100" x2="120" y2="100" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
            <circle cx="160" cy="82" r="14" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="2.5" />
            <polygon points="160,74 163,80 170,80 165,85 167,91 160,88 153,91 155,85 150,80 157,80" fill="#7C3AED" />
            <rect x="90" y="140" width="60" height="12" rx="4" fill="#DDD6FE" />
            <line x1="60" y1="152" x2="180" y2="152" stroke="#A987FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case 'creativity-arts':
        return (
          <svg className="category-hero-art-svg" viewBox="0 0 240 180" fill="none">
            <path d="M120 25C70 25 35 60 35 110C35 145 60 160 85 160C100 160 108 152 115 144C120 137 125 133 135 133H155C190 133 210 110 210 75C210 40 170 25 120 25Z" fill="#FFF0F5" stroke="#FF668D" strokeWidth="3" />
            <circle cx="75" cy="70" r="12" fill="#FDA4AF" />
            <circle cx="110" cy="55" r="12" fill="#F43F5E" />
            <circle cx="155" cy="65" r="12" fill="#FBBF24" />
            <circle cx="175" cy="100" r="12" fill="#60A5FA" />
            <circle cx="85" cy="115" r="12" fill="#34D399" />
          </svg>
        );
      case 'career-professional-skills':
        return (
          <svg className="category-hero-art-svg" viewBox="0 0 240 180" fill="none">
            <rect x="40" y="55" width="160" height="100" rx="16" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="3" />
            <path d="M90 55V40C90 32 98 25 106 25H134C142 25 150 32 150 40V55" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="95" x2="200" y2="95" stroke="#93C5FD" strokeWidth="2.5" />
            <rect x="105" y="85" width="30" height="20" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            <polyline points="150 135 165 118 185 118" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="175 112 185 118 175 124" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'entrepreneurship-finance':
        return (
          <svg className="category-hero-art-svg" viewBox="0 0 240 180" fill="none">
            <circle cx="95" cy="80" r="48" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="3" />
            <path d="M95 50V110M80 64H102C108 64 112 68 112 73C112 78 108 82 102 82H88C82 82 78 86 78 91C78 96 82 100 88 100H110" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
            <g transform="translate(130, 40) rotate(25)">
              <rect x="0" y="0" width="30" height="65" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
              <polygon points="15,-15 32,5 -2,5" fill="#EF4444" />
            </g>
          </svg>
        );
      case 'lifestyle-wellness':
        return (
          <svg className="category-hero-art-svg" viewBox="0 0 240 180" fill="none">
            <path d="M120 35C120 65 96 90 76 102C96 106 120 98 120 98C120 98 144 106 164 102C144 90 120 65 120 35Z" fill="#ECFDF5" stroke="#10B981" strokeWidth="3" />
            <path d="M68 76C76 96 96 108 116 108C88 112 64 100 52 80C56 72 60 72 68 76Z" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
            <path d="M172 76C164 96 144 108 124 108C152 112 176 100 188 80C184 72 180 72 172 76Z" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
            <ellipse cx="120" cy="132" rx="48" ry="14" fill="#F0FDF4" stroke="#10B981" strokeWidth="2.5" />
            <ellipse cx="120" cy="118" rx="30" ry="9" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
          </svg>
        );
      case 'social-outdoor-community':
        return (
          <svg className="category-hero-art-svg" viewBox="0 0 240 180" fill="none">
            <polygon points="30,140 85,55 140,140" fill="#FFF7ED" stroke="#FB923C" strokeWidth="3" />
            <polygon points="95,140 150,40 210,140" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" />
            <circle cx="120" cy="95" r="10" fill="#EA580C" />
            <path d="M102 140C102 125 110 118 120 118C130 118 138 125 138 140" fill="#EA580C" />
            <circle cx="85" cy="102" r="8" fill="#F97316" />
            <path d="M72 140C72 128 78 122 85 122C92 122 98 128 98 140" fill="#F97316" />
            <circle cx="155" cy="102" r="8" fill="#F97316" />
            <path d="M142 140C142 128 148 122 155 122C162 122 168 128 168 140" fill="#F97316" />
          </svg>
        );
      case 'emerging-practical-skills':
      default:
        return (
          <svg className="category-hero-art-svg" viewBox="0 0 240 180" fill="none">
            <circle cx="120" cy="85" r="44" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="3" />
            <circle cx="120" cy="85" r="18" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2.5" />
            <rect x="113" y="27" width="14" height="15" rx="3" fill="#8B5CF6" />
            <rect x="113" y="128" width="14" height="15" rx="3" fill="#8B5CF6" />
            <rect x="62" y="78" width="15" height="14" rx="3" fill="#8B5CF6" />
            <rect x="163" y="78" width="15" height="14" rx="3" fill="#8B5CF6" />
            <path d="M170 35L174 25L178 35L188 39L178 43L174 53L170 43L160 39Z" fill="#C4B5FD" />
          </svg>
        );
    }
  };

  return (
    <div className="category-page-shell">
      {/* A. Navigation Header */}
      <Navbar />

      <main id="category-main-content">
        {/* Breadcrumb Row & Back Navigation */}
        <section className="category-nav-bar">
          <div className="container">
            <div className="category-nav-inner">
              <nav className="breadcrumb-nav" aria-label="Breadcrumb">
                <ol className="breadcrumb-list">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-separator">/</li>
                  <li className="breadcrumb-item">
                    <a href="/#categories-section">Categories</a>
                  </li>
                  <li className="breadcrumb-separator">/</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {category.title}
                  </li>
                </ol>
              </nav>

              <Link to="/#categories-section" className="back-to-categories-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Back to All Categories</span>
              </Link>
            </div>
          </div>
        </section>

        {/* B. Category Hero Section */}
        <section className="category-hero-section" style={{ backgroundColor: category.accentBg }}>
          <div className="container">
            <div className="category-hero-layout">
              <div className="category-hero-content">
                <span className="category-pill-badge" style={{ backgroundColor: '#FFFFFF', color: category.accentColor, borderColor: category.accentColor }}>
                  Category Discovery · {category.workshopCount} Workshops
                </span>

                <h1 className="category-hero-title">
                  {category.title}
                </h1>

                <p className="category-hero-description">
                  {category.description}
                </p>

                <p className="category-hero-tagline">
                  {category.tagline}
                </p>

                <div className="category-hero-actions">
                  <a href="#workshop-listing-section" className="btn btn-primary btn-lg">
                    <span>Explore Workshops</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="category-hero-visual" aria-hidden="true">
                <div className="category-hero-art-card">
                  {renderCategoryHeroArt()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* D. Useful Discovery Features & C. Workshop Listing */}
        <section className="category-workshops-section" id="workshop-listing-section">
          <div className="container">
            {/* Search and Filters Header */}
            <div className="category-filter-toolbar">
              <div className="filter-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder={`Search workshops in ${category.title}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="category-search-input"
                  aria-label={`Search workshops in ${category.title}`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="clear-search-btn"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Type Filter Pills */}
              <div className="filter-pills-row" role="radiogroup" aria-label="Filter by workshop type">
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`filter-pill-btn ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                    role="radio"
                    aria-checked={selectedType === type}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter and Active Filter Tags */}
            <div className="results-counter-row">
              <span className="results-counter-text">
                Showing <strong>{filteredWorkshops.length}</strong> of {allCategoryWorkshops.length} workshops in <strong>{category.title}</strong>
              </span>

              {(searchQuery || selectedType !== 'All') && (
                <button type="button" onClick={resetFilters} className="btn-reset-filters">
                  Reset filters
                </button>
              )}
            </div>

            {/* C. Responsive Workshop Grid (3 desktop, 2 tablet, 1 mobile) */}
            {filteredWorkshops.length > 0 ? (
              <div className="category-workshops-grid">
                {filteredWorkshops.map((workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} />
                ))}
              </div>
            ) : (
              /* D. Helpful Empty State */
              <div className="category-empty-state">
                <div className="empty-state-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3 className="empty-state-title">No matching workshops found</h3>
                <p className="empty-state-subtitle">
                  We couldn't find any workshops in <strong>{category.title}</strong> matching "{searchQuery || selectedType}".
                </p>
                <button type="button" onClick={resetFilters} className="btn btn-primary">
                  Clear search and reset filters
                </button>
              </div>
            )}

            {/* Other Categories Quick Switcher */}
            <div className="other-categories-bar">
              <h4 className="other-cat-title">Explore Other Categories</h4>
              <div className="other-cat-links">
                {CATEGORIES.filter(c => c.slug !== category.slug).map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/categories/${cat.slug}`}
                    className="other-cat-pill"
                  >
                    <span>{cat.title}</span>
                    <span className="cat-count-badge">{cat.workshopCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* E. Footer with links back to all seven categories */}
      <Footer />
    </div>
  );
}
