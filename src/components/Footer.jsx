import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="orbito-site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Column 1: Brand & Tagline (No logo image or icon, clean typographic wordmark) */}
          <div className="footer-brand-column">
            <Link to="/" className="footer-brand-title" aria-label="Orbito Home">
              Orbito
            </Link>
            <p className="footer-tagline">Discover · Learn · Grow</p>
            <p className="footer-brand-desc">
              The modern workshop discovery platform empowering curious people to explore new interests, attend vibrant cohorts, and connect with inspiring mentors.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="footer-nav-column">
            <h3 className="footer-col-heading">Explore</h3>
            <ul className="footer-col-links">
              <li><Link to="/categories/technology-ai" className="footer-link">Browse Workshops</Link></li>
              <li><a href="/#categories-section" className="footer-link">Categories</a></li>
              <li><Link to="/categories/creativity-arts" className="footer-link">Discover My Interests</Link></li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div className="footer-nav-column">
            <h3 className="footer-col-heading">About</h3>
            <ul className="footer-col-links">
              <li><a href="/#how-it-works" className="footer-link">How Orbito Works</a></li>
              <li><a href="#about" className="footer-link">Our Mission</a></li>
              <li><a href="mailto:hello@orbito.io" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4: Help & Legal */}
          <div className="footer-nav-column">
            <h3 className="footer-col-heading">Help & Legal</h3>
            <ul className="footer-col-links">
              <li><a href="#faqs" className="footer-link">FAQs</a></li>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 5: Connect With Us */}
          <div className="footer-nav-column">
            <h3 className="footer-col-heading">Connect With Us</h3>
            <p className="footer-connect-desc">Follow our community updates and featured workshop cohorts:</p>
            <div className="footer-social-row">
              <a href="https://instagram.com" className="social-icon-btn social-ig" aria-label="Follow Orbito on Instagram" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://x.com" className="social-icon-btn social-x" aria-label="Follow Orbito on X" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" className="social-icon-btn social-li" aria-label="Connect with Orbito on LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://youtube.com" className="social-icon-btn social-yt" aria-label="Subscribe to Orbito on YouTube" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider and Copyright Row */}
        <div className="footer-divider-line" aria-hidden="true"></div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright-text">&copy; 2026 Orbito. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy" className="footer-bottom-link">Privacy Policy</a>
            <span className="footer-dot-sep">&bull;</span>
            <a href="#terms" className="footer-bottom-link">Terms of Service</a>
            <span className="footer-dot-sep">&bull;</span>
            <a href="#cookies" className="footer-bottom-link">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
