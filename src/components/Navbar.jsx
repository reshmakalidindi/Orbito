import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('orbito_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authName, setAuthName] = useState('Alex Morgan');
  const [authEmail, setAuthEmail] = useState('learner@orbito.io');
  const [authPassword, setAuthPassword] = useState('password123');
  const [location, setLocation] = useState('Bhimavaram, IN');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: authName.trim() || 'Alex Morgan',
      email: authEmail.trim() || 'learner@orbito.io',
      loggedIn: true,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem('orbito_user', JSON.stringify(newUser));
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('orbito_user');
    setUser(null);
    setAccountDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories/technology-ai?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AM';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Learner';

  return (
    <>
      <header className="site-header" role="banner">
        <div className="header-row">
          {/* Top-Left: Logo & Search Bar */}
          <div className="header-left-group">
            <Link to="/" className="brand-logo-link" aria-label="Orbito Home">
              <img
                src="/assets/images/orbito-logo.png"
                alt="Orbito - Discover . Learn . Grow"
                className="brand-logo-img"
                onError={(e) => {
                  // Fallback to relative or colored badge if not found
                  e.target.style.display = 'none';
                }}
              />
              <span className="brand-fallback-logo">Orbito</span>
            </Link>

            {/* Adjacent Pill-Shaped Search Bar */}
            <form className="header-search-pill" role="search" onSubmit={handleSearchSubmit}>
              <div className="header-search-input-group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  className="header-search-input"
                  placeholder="Search workshops, topics or interests..."
                  aria-label="Search workshops, topics or interests"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="header-search-divider" aria-hidden="true"></div>

              {/* Location Pill */}
              <div
                className="header-location-group"
                role="button"
                tabIndex={0}
                title="Location"
                onClick={() => {
                  const newLoc = prompt('Enter your city:', location);
                  if (newLoc) setLocation(newLoc);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="header-location-text">{location}</span>
              </div>

              {/* Circular Search Button */}
              <button type="submit" className="header-search-submit-btn" aria-label="Submit search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          {/* Top-Right: Language Selector & Auth Group */}
          <div className="header-right-group">
            <button type="button" className="header-lang-btn" aria-label="Change language">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>English</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {user && user.loggedIn ? (
              /* Logged In State: Account Symbol & Dropdown */
              <div className="header-account-menu" ref={dropdownRef}>
                <button
                  type="button"
                  className="header-account-btn"
                  id="header-account-btn"
                  aria-haspopup="true"
                  aria-expanded={accountDropdownOpen}
                  aria-label={`Open account menu for ${user.name}`}
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                >
                  <span className="account-avatar-circle" title={user.name}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="account-icon-svg" width="16" height="16">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <span className="account-name-label">{firstName}</span>
                  <svg className="account-chevron-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {accountDropdownOpen && (
                  <div className="header-account-dropdown open" role="menu" aria-label="Account options">
                    <div className="dropdown-user-header">
                      <div className="dropdown-user-avatar">{initials}</div>
                      <div className="dropdown-user-info">
                        <strong className="dropdown-user-name">{user.name}</strong>
                        <span className="dropdown-user-email">{user.email}</span>
                        <span className="dropdown-user-badge">Active Learner</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/categories/technology-ai"
                      className="dropdown-item"
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>Explore Categories</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      className="dropdown-item dropdown-logout-btn"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out State: Log in & Sign up buttons */
              <>
                <button
                  type="button"
                  className="header-login-link auth-trigger-login"
                  onClick={() => {
                    setIsSignUp(false);
                    setAuthModalOpen(true);
                  }}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="btn-header-signup auth-trigger-signup"
                  onClick={() => {
                    setIsSignUp(true);
                    setAuthModalOpen(true);
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal (Log in / Sign up) */}
      {authModalOpen && (
        <div className="modal-overlay open" onClick={() => setAuthModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setAuthModalOpen(false)}
              aria-label="Close dialog"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {isSignUp ? 'Join Orbito' : 'Welcome Back'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {isSignUp
                  ? 'Discover and register for inspiring learning cohorts.'
                  : 'Log in to view saved workshops and cohorts.'}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Alex Morgan"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="alex@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.75rem' }}>
                {isSignUp ? 'Create Free Account' : 'Log In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    style={{ fontWeight: 700, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    style={{ fontWeight: 700, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
