import React from 'react';
import { Link } from 'react-router-dom';

export default function HowOrbitoWorks() {
  return (
    <section className="how-orbito-works-section" id="how-it-works" aria-labelledby="how-it-works-title">
      <div className="how-works-container">
        {/* Section Header */}
        <div className="how-works-header">
          <span className="how-works-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            How Orbito Works
          </span>
          <h2 className="how-works-title" id="how-it-works-title">How Orbito works</h2>
          <p className="how-works-subtitle">
            Three simple, connected steps to turn your curiosity into hands-on passion.
          </p>
        </div>

        {/* Asymmetric Connected Steps Board */}
        <div className="how-works-board">
          {/* Looping Curved Grey Arrows SVG Overlay (Desktop) */}
          <svg className="how-works-arrows-svg" viewBox="0 0 1000 620" fill="none" aria-hidden="true">
            {/* Arrow 1: Card 1 (Left column) to Card 2 (Upper Right) */}
            <path className="journey-curved-arrow" d="M 430 190 C 490 120, 500 130, 545 135" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="554,136 542,128 543,142" fill="#9CA3AF" />

            {/* Arrow 2: Card 2 (Upper Right) to Card 3 (Lower Right) */}
            <path className="journey-curved-arrow" d="M 740 270 C 785 305, 785 335, 745 365" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="737,370 750,373 746,360" fill="#9CA3AF" />
          </svg>

          {/* Left Column: Card 1 + Lower-Left Note */}
          <div className="how-works-left-col">
            {/* Step 1: Explore workshops */}
            <div className="how-step-card step-card-1">
              <div className="step-card-header">
                <span className="step-card-num num-purple">1</span>
                <span className="step-card-tag tag-purple">Step 1 · Explore</span>
              </div>

              {/* Playful Purple Illustration */}
              <div className="step-illustration-wrap ill-purple" aria-hidden="true">
                <svg viewBox="0 0 280 140" fill="none" style={{ width: '100%', height: '100%', maxHeight: 140 }}>
                  <circle cx="140" cy="70" r="58" stroke="#DDD6FE" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="140" cy="70" r="38" fill="#EDE9FE" />
                  <rect x="52" y="38" width="56" height="42" rx="8" fill="#FFFFFF" stroke="#A987FF" strokeWidth="2" />
                  <line x1="60" y1="50" x2="96" y2="50" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="60" y1="60" x2="84" y2="60" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="94" cy="62" r="3" fill="#A987FF" />

                  <rect x="172" y="58" width="56" height="42" rx="8" fill="#FFFFFF" stroke="#A987FF" strokeWidth="2" />
                  <line x1="180" y1="70" x2="216" y2="70" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="180" y1="80" x2="204" y2="80" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="214" cy="82" r="3" fill="#A987FF" />

                  <g transform="translate(116, 32)">
                    <circle cx="24" cy="24" r="22" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="3" />
                    <circle cx="24" cy="24" r="14" fill="#F5F3FF" />
                    <polygon points="24,14 26.5,21 34,21 28,25 30,32 24,28 18,32 20,25 14,21 21.5,21" fill="#A987FF" />
                    <line x1="40" y1="40" x2="56" y2="56" stroke="#7C3AED" strokeWidth="4.5" strokeLinecap="round" />
                  </g>
                  <path d="M42 28L44 22L46 28L52 30L46 32L44 38L42 32L36 30Z" fill="#A987FF" />
                  <path d="M234 32L235.5 27L237 32L242 33.5L237 35L235.5 40L234 35L229 33.5Z" fill="#C4B5FD" />
                </svg>
              </div>

              <div className="step-card-body">
                <h3 className="step-heading">Explore workshops</h3>
                <p className="step-description">
                  Browse workshops find activities that match your interests,
                </p>
                <a href="#categories-section" className="step-action-link link-purple" id="how-link-explore">
                  <span>Start exploring</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            {/* Lower-Left Handwritten Sticker Note */}
            <div className="handwritten-note-sticker" aria-label="Explore · Discover · Learn sticky note">
              <div className="note-pin" aria-hidden="true"></div>
              <div className="note-inner">
                <div className="note-icon-wrap" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="note-text-content">
                  <span className="note-handwritten-text">Explore · Discover · Learn</span>
                  <span className="note-sub-text">Join curious minds & vibrant cohorts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Card 2 (Upper Right) & Card 3 (Below them) */}
          <div className="how-works-right-col">
            {/* Step 2: Not sure what to explore? (Upper Right) */}
            <div className="how-step-card step-card-2">
              <div className="step-card-header">
                <span className="step-card-num num-pink">2</span>
                <span className="step-card-tag tag-pink">Step 2 · Quick Quiz</span>
              </div>
              <div className="step-card-content-split">
                <div className="step-card-body">
                  <h3 className="step-heading">Not sure what to explore?</h3>
                  <p className="step-description">
                    Take a quick, interactive quiz to discover your interests, preferences, and the activities you might enjoy,
                  </p>
                  <Link to="/categories/creativity-arts" className="step-action-link link-pink" id="how-link-quiz">
                    <span>Discover my interests</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>

                {/* Playful Pink Illustration */}
                <div className="step-illustration-wrap ill-pink" aria-hidden="true">
                  <svg viewBox="0 0 120 110" fill="none" style={{ width: '100%', height: '100%' }}>
                    <rect x="24" y="20" width="72" height="80" rx="10" fill="#FFFFFF" stroke="#FF668D" strokeWidth="2.5" />
                    <rect x="44" y="14" width="32" height="12" rx="4" fill="#FFE4E6" stroke="#FF668D" strokeWidth="2" />
                    <rect x="34" y="38" width="12" height="12" rx="3" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1.8" />
                    <polyline points="37 44 40 47 45 40" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="52" y1="44" x2="84" y2="44" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                    <rect x="34" y="58" width="12" height="12" rx="3" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1.8" />
                    <polyline points="37 64 40 67 45 60" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="52" y1="64" x2="80" y2="64" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                    <rect x="34" y="78" width="12" height="12" rx="3" fill="#FFFFFF" stroke="#FDA4AF" strokeWidth="1.8" />
                    <line x1="52" y1="84" x2="74" y2="84" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="92" cy="24" r="14" fill="#FF668D" />
                    <text x="92" y="29" fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="800" fill="#FFFFFF" textAnchor="middle">?</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3: Find your next passion (Lower Right) */}
            <div className="how-step-card step-card-3">
              <div className="step-card-header">
                <span className="step-card-num num-orange">3</span>
                <span className="step-card-tag tag-orange">Step 3 · Recommendations</span>
              </div>
              <div className="step-card-content-split">
                <div className="step-card-body">
                  <h3 className="step-heading">Find your next passion</h3>
                  <p className="step-description">
                    Get personalized workshop recommendations based on your quiz answers and choose a learning experience that feels right for you,
                  </p>
                  <Link to="/categories/lifestyle-wellness" className="step-action-link link-orange" id="how-link-recommendations">
                    <span>See my recommendations</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>

                {/* Playful Orange Illustration */}
                <div className="step-illustration-wrap ill-orange" aria-hidden="true">
                  <svg viewBox="0 0 120 110" fill="none" style={{ width: '100%', height: '100%' }}>
                    <circle cx="60" cy="55" r="42" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="2" />
                    <circle cx="60" cy="55" r="30" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
                    <circle cx="60" cy="55" r="18" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
                    <polygon points="60,45 63,51 70,52 65,57 66,64 60,60 54,64 55,57 50,52 57,51" fill="#EA580C" />
                    <circle cx="28" cy="30" r="4" fill="#FFB63E" />
                    <circle cx="94" cy="74" r="3.5" fill="#F97316" />
                    <path d="M88 28L90 22L92 28L98 30L92 32L90 38L88 32L82 30Z" fill="#FFB63E" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
