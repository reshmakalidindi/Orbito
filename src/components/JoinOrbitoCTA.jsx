import React from 'react';

export default function JoinOrbitoCTA({ onOpenAuth }) {
  return (
    <section className="join-orbito-section" aria-labelledby="join-orbito-title">
      <div className="join-orbito-container">
        <div className="join-orbito-panel">
          {/* Left Side Decorative Elements */}
          <div className="join-deco-left" aria-hidden="true">
            {/* Circular Photo of Two Friends with Coral Ring */}
            <div className="join-photo-frame frame-coral">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
                alt="Two smiling friends sharing a learning activity"
                className="join-circle-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <svg className="photo-fallback-svg" viewBox="0 0 100 100" fill="none" style={{ display: 'none' }}>
                <circle cx="50" cy="50" r="48" fill="#FFF0F5" />
                <circle cx="36" cy="40" r="14" fill="#FF668D" />
                <path d="M18 78C18 64 26 58 36 58C46 58 54 64 54 78" fill="#FF668D" />
                <circle cx="64" cy="44" r="13" fill="#FDA4AF" />
                <path d="M48 78C48 66 55 60 64 60C73 60 80 66 80 78" fill="#FDA4AF" />
              </svg>
            </div>

            {/* Playful Planet Illustration (clean white background, no colored blob) */}
            <div className="join-deco-planet">
              <svg className="planet-illustration-svg" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="32" fill="#A987FF" />
                <circle cx="68" cy="52" r="8" fill="#C4B5FD" opacity="0.6" />
                <ellipse cx="60" cy="60" rx="52" ry="16" stroke="#242428" strokeWidth="4.5" transform="rotate(-25 60 60)" />
                <polygon points="102,32 104,26 106,32 112,34 106,36 104,42 102,36 96,34" fill="#A987FF" />
              </svg>
            </div>

            {/* Small accent strokes */}
            <svg className="join-accent-strokes-left" viewBox="0 0 90 90" fill="none">
              <path d="M20,30 C35,20 50,35 65,25" stroke="#FF668D" strokeWidth="3" strokeLinecap="round" />
              <path d="M30,55 C42,48 56,58 70,50" stroke="#A987FF" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="15" cy="65" r="3" fill="#A987FF" />
              <circle cx="78" cy="35" r="3" fill="#FF668D" />
            </svg>
          </div>

          {/* Centered Content Area */}
          <div className="join-orbito-content">
            <div className="join-heading-wrapper">
              <svg className="join-heading-purple-lines left" width="46" height="32" viewBox="0 0 46 32" fill="none" aria-hidden="true">
                <path d="M4 10C16 5 30 12 42 8" stroke="#A987FF" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M10 22C22 17 34 24 42 20" stroke="#A987FF" strokeWidth="3.5" strokeLinecap="round" />
              </svg>

              <h2 className="join-orbito-heading" id="join-orbito-title">Join Orbito</h2>

              <svg className="join-heading-purple-lines right" width="46" height="32" viewBox="0 0 46 32" fill="none" aria-hidden="true">
                <path d="M4 8C16 12 30 5 42 10" stroke="#A987FF" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M4 20C12 24 24 17 36 22" stroke="#A987FF" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>

            <p className="join-orbito-description">
              Join a community of curious learners, explore new interests, attend workshops, and take the first step towards your next passion.
            </p>

            <button
              type="button"
              className="btn-join-signup auth-trigger-signup"
              id="btn-join-orbito-cta"
              aria-label="Sign up for free on Orbito"
              onClick={onOpenAuth}
            >
              Sign up for free
            </button>
          </div>

          {/* Right Side Decorative Elements */}
          <div className="join-deco-right" aria-hidden="true">

            {/* Circular Photo of Learner with Laptop (Yellow Ring) */}
            <div className="join-photo-frame frame-yellow">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
                alt="Person learning on a laptop"
                className="join-circle-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <svg className="photo-fallback-svg" viewBox="0 0 100 100" fill="none" style={{ display: 'none' }}>
                <circle cx="50" cy="50" r="48" fill="#FFFBEB" />
                <circle cx="50" cy="38" r="16" fill="#FFB63E" />
                <path d="M26 80C26 64 36 58 50 58C64 58 74 64 74 80" fill="#FFB63E" />
                <rect x="34" y="68" width="32" height="18" rx="3" fill="#242428" />
              </svg>
            </div>

            {/* Hand-Drawn Yellow Lightbulb & Small Star */}
            <div className="join-deco-lightbulb">
              <svg viewBox="0 0 100 120" fill="none" style={{ width: '100%', height: '100%' }}>
                <path d="M45,22 C32,22 22,32 22,46 C22,55 28,62 33,68 C36,71 38,76 38,80 L52,80 C52,76 54,71 57,68 C62,62 68,55 68,46 C68,32 58,22 45,22 Z" fill="#FFB63E" stroke="#242428" strokeWidth="3.2" />
                <rect x="37" y="80" width="16" height="5" rx="1.5" fill="#FFFFFF" stroke="#242428" strokeWidth="2.5" />
                <rect x="40" y="85" width="10" height="4" rx="1" fill="#242428" />
                <line x1="45" y1="10" x2="45" y2="15" stroke="#242428" strokeWidth="3" strokeLinecap="round" />
                <line x1="20" y1="26" x2="24" y2="30" stroke="#242428" strokeWidth="3" strokeLinecap="round" />
                <line x1="70" y1="26" x2="66" y2="30" stroke="#242428" strokeWidth="3" strokeLinecap="round" />
                <polygon points="80,68 83,75 91,76 85,82 87,90 80,85 73,90 75,82 69,76 77,75" fill="#FFB63E" stroke="#242428" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Circular Photo of Diverse Friends (Mint-Green Ring) */}
            <div className="join-photo-frame frame-mint">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80"
                alt="Diverse group of friends learning together"
                className="join-circle-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <svg className="photo-fallback-svg" viewBox="0 0 100 100" fill="none" style={{ display: 'none' }}>
                <circle cx="50" cy="50" r="48" fill="#ECFDF5" />
                <circle cx="35" cy="42" r="12" fill="#65D6B0" />
                <path d="M20 78C20 66 26 60 35 60C44 60 50 66 50 78" fill="#65D6B0" />
                <circle cx="65" cy="42" r="12" fill="#059669" />
                <path d="M50 78C50 66 56 60 65 60C74 60 80 66 80 78" fill="#059669" />
              </svg>
            </div>

            {/* Small decorative strokes */}
            <svg className="join-accent-strokes-right" viewBox="0 0 90 90" fill="none">
              <path d="M15,25 C30,18 45,30 60,20" stroke="#FFB63E" strokeWidth="3" strokeLinecap="round" />
              <path d="M25,50 C40,42 55,54 70,45" stroke="#65D6B0" strokeWidth="3" strokeLinecap="round" />
              <circle cx="75" cy="65" r="3.5" fill="#A987FF" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
