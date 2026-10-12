import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getWorkshopById, getCategoryBySlug } from '../data/workshops';

export default function WorkshopDetailPage() {
  const { workshopId } = useParams();
  const workshop = getWorkshopById(workshopId);

  const [regModalOpen, setRegModalOpen] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    email: 'learner@orbito.io',
    phone: '+91 98765 43210',
    experience: 'Beginner',
    goals: 'Looking to learn foundational concepts and build hands-on skills.'
  });
  const [errors, setErrors] = useState({});

  if (!workshop) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Workshop Not Found
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            We could not locate workshop "<code>{workshopId}</code>".
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            ← Return to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const category = getCategoryBySlug(workshop.categoryId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    return errs;
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Save registration locally (explicitly local UI demo without fake backend claims)
    try {
      const savedRegistrations = JSON.parse(localStorage.getItem('orbito_registrations') || '[]');
      savedRegistrations.push({
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        ...formData,
        registeredAt: new Date().toISOString()
      });
      localStorage.setItem('orbito_registrations', JSON.stringify(savedRegistrations));
    } catch {}

    setRegSuccess(true);
  };

  return (
    <div className="workshop-detail-page-shell">
      <Navbar />

      <main id="workshop-detail-main">
        {/* Breadcrumb Navigation & Back Link */}
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
                  <li className="breadcrumb-item">
                    <Link to={`/categories/${workshop.categoryId}`}>
                      {workshop.categoryTitle}
                    </Link>
                  </li>
                  <li className="breadcrumb-separator">/</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {workshop.title}
                  </li>
                </ol>
              </nav>

              <Link to={`/categories/${workshop.categoryId}`} className="back-to-categories-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Back to {workshop.categoryTitle}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Workshop Hero Banner */}
        <section className="workshop-hero-header-section" style={{ backgroundColor: category?.accentBg || '#F5F3FF' }}>
          <div className="container">
            <div className="workshop-hero-grid">
              <div className="workshop-hero-main-col">
                <div className="workshop-hero-badges-row">
                  <span className="hero-category-tag" style={{ color: category?.accentColor || '#7C3AED', backgroundColor: '#FFFFFF' }}>
                    {workshop.categoryTitle}
                  </span>
                  <span className="hero-type-pill">
                    {workshop.type}
                  </span>
                  <span className="hero-num-tag">
                    #{workshop.num || 1}
                  </span>
                </div>

                <h1 className="workshop-detail-title">
                  {workshop.title}
                </h1>

                <p className="workshop-detail-lead-desc">
                  {workshop.description}
                </p>

                <div className="workshop-hero-quick-meta">
                  <div className="quick-meta-item">
                    <span className="meta-label">Format</span>
                    <strong className="meta-val">{workshop.format || 'Interactive Workshop'}</strong>
                  </div>
                  <div className="quick-meta-item">
                    <span className="meta-label">Duration</span>
                    <strong className="meta-val">{workshop.duration || 'Flexible'}</strong>
                  </div>
                  <div className="quick-meta-item">
                    <span className="meta-label">Skill Level</span>
                    <strong className="meta-val">{workshop.level || 'All Levels'}</strong>
                  </div>
                  <div className="quick-meta-item">
                    <span className="meta-label">Location</span>
                    <strong className="meta-val">{workshop.location || 'Bhimavaram & Online'}</strong>
                  </div>
                </div>

                <div className="workshop-cta-action-row">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      setRegSuccess(false);
                      setRegModalOpen(true);
                    }}
                  >
                    <span>Register Now</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>

                  <div className="seats-indicator">
                    <span className="seats-dot"></span>
                    <span><strong>{workshop.seatsLeft || 8} seats</strong> remaining in current cohort</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Visual Artwork Card */}
              <div className="workshop-hero-visual-col" aria-hidden="true">
                <div className="workshop-art-card">
                  <svg viewBox="0 0 200 160" fill="none" style={{ width: '100%', height: '100%' }}>
                    <circle cx="100" cy="80" r="60" fill="#FFFFFF" stroke={category?.accentColor || '#A987FF'} strokeWidth="2.5" />
                    <circle cx="100" cy="80" r="44" fill={category?.accentBg || '#F5F3FF'} />
                    <polygon points="100,50 108,70 130,72 114,88 118,110 100,98 82,110 86,88 70,72 92,70" fill={category?.accentColor || '#7C3AED'} />
                    <circle cx="48" cy="40" r="5" fill="#FFB63E" />
                    <circle cx="152" cy="120" r="4" fill="#FF668D" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Information & Curriculum Breakdown */}
        <section className="section-padding">
          <div className="container">
            <div className="workshop-content-columns">
              <div className="workshop-content-left">
                <div className="detail-section-block">
                  <h2 className="detail-block-title">About This Workshop</h2>
                  <p className="detail-paragraph">
                    {workshop.description}. This guided experience is structured to give you deep immersion and practical mastery. You will work on real projects, receive personalized feedback, and connect with fellow learners who share your passion.
                  </p>
                </div>

                <div className="detail-section-block">
                  <h2 className="detail-block-title">What You Will Experience</h2>
                  <ul className="detail-check-list">
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Hands-on practice covering core techniques and frameworks.</span>
                    </li>
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Small-group cohort for focused mentorship and interactive Q&A.</span>
                    </li>
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Dedicated portfolio deliverables you can showcase and build upon.</span>
                    </li>
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Lifelong access to community discussion channels and cohort alumni.</span>
                    </li>
                  </ul>
                </div>

                <div className="detail-section-block">
                  <h2 className="detail-block-title">Lead Instructor</h2>
                  <div className="instructor-card">
                    <div className="instructor-avatar">
                      {workshop.instructor ? workshop.instructor.split(' ')[0][0] : 'I'}
                    </div>
                    <div className="instructor-info">
                      <strong className="instructor-name">{workshop.instructor || 'Senior Orbito Mentor'}</strong>
                      <span className="instructor-role">Industry Specialist & Experienced Educator</span>
                      <p className="instructor-bio">
                        Dedicated to making complex subjects intuitive, joyful, and directly applicable in daily practice and professional journeys.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Cohort Summary Card */}
              <div className="workshop-content-sidebar">
                <div className="cohort-sidebar-card">
                  <div className="sidebar-price-header">
                    <span className="price-title">Enrollment Fee</span>
                    <span className="price-amount">{workshop.price || 'Free'}</span>
                  </div>

                  <div className="sidebar-specs-list">
                    <div className="spec-row">
                      <span>Type</span>
                      <strong>{workshop.type}</strong>
                    </div>
                    <div className="spec-row">
                      <span>Category</span>
                      <strong>{workshop.categoryTitle}</strong>
                    </div>
                    <div className="spec-row">
                      <span>Duration</span>
                      <strong>{workshop.duration}</strong>
                    </div>
                    <div className="spec-row">
                      <span>Skill Level</span>
                      <strong>{workshop.level}</strong>
                    </div>
                    <div className="spec-row">
                      <span>Format</span>
                      <strong>{workshop.format}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '1.5rem' }}
                    onClick={() => {
                      setRegSuccess(false);
                      setRegModalOpen(true);
                    }}
                  >
                    Register for This Cohort
                  </button>

                  <p className="sidebar-guarantee-note">
                    🔒 Free cancellation up to 48 hours before the cohort starts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Registration Modal UI with Validation */}
      {regModalOpen && (
        <div className="modal-overlay open" onClick={() => setRegModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setRegModalOpen(false)}
              aria-label="Close registration dialog"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {regSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Registration Confirmed!
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  You are registered for <strong>{workshop.title}</strong>. A confirmation email has been dispatched to <strong>{formData.email}</strong>.
                </p>
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Cohort Details:</div>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginTop: '0.2rem' }}>{workshop.title} ({workshop.type})</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>Instructor: {workshop.instructor}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>Format: {workshop.format} ({workshop.duration})</div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setRegModalOpen(false)}
                >
                  Close & Continue Exploring
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Workshop Registration
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem', marginBottom: '0.35rem' }}>
                    {workshop.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Fill out the form below to reserve your seat in this cohort.
                  </p>
                </div>

                <form onSubmit={handleSubmitRegistration}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? 'input-error' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                    {errors.name && <span className="error-hint" style={{ color: '#DC2626', fontSize: '0.8rem' }}>{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'input-error' : ''}`}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <span className="error-hint" style={{ color: '#DC2626', fontSize: '0.8rem' }}>{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prior Experience Level</label>
                    <select
                      name="experience"
                      className="form-control"
                      value={formData.experience}
                      onChange={handleInputChange}
                    >
                      <option value="Beginner">Complete Beginner</option>
                      <option value="Some Knowledge">Some Practical Knowledge</option>
                      <option value="Intermediate">Intermediate / Practitioner</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Learning Goals (Optional)</label>
                    <textarea
                      name="goals"
                      rows="2"
                      className="form-control"
                      value={formData.goals}
                      onChange={handleInputChange}
                      placeholder="What do you hope to get out of this experience?"
                    />
                  </div>

                  <div style={{ marginTop: '1.25rem' }}>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      Confirm & Reserve Seat
                    </button>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'center', marginTop: '0.6rem' }}>
                      No payment charged now. Front-end registration preview demo.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
