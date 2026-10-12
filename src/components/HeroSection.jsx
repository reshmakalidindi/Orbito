import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero-meetup-section" aria-labelledby="hero-title">
      <div className="hero-balanced-container">
        {/* Left Side: Activity Collage 1 (Crochet Club & Painting Class) */}
        <div className="hero-left-collage-col">
          <div className="hero-collage-wrapper">
            <img
              src="/assets/images/activity-collage-1.png?v=3"
              alt="Crochet Club and Painting Class workshops"
              className="hero-flanking-collage-img hero-left-img"
              onError={(e) => {
                e.target.src = 'assets/images/activity-collage-1.png';
              }}
            />
          </div>
        </div>

        {/* Middle Content: Heading, Caption & CTAs */}
        <div className="hero-middle-content-col">
          <h1 className="hero-heading" id="hero-title">
            Your Next Passion Is<br />
            Closer Than You Think.
          </h1>

          <p className="hero-caption">
            Discover workshops, explore new interests, and find learning experiences that match who you are and who you want to become.
          </p>

          <div className="hero-actions-group">
            <Link to="/categories/technology-ai" className="btn-hero-primary" id="btn-discover-interests">
              Discover My Interests
            </Link>
            <a href="#categories-section" className="btn-hero-secondary" id="btn-explore-workshops">
              Explore Workshops
            </a>
          </div>
        </div>

        {/* Right Side: Activity Collage 2 (Cooking Club & Tech Workshop) */}
        <div className="hero-right-collage-col">
          <div className="hero-collage-wrapper">
            <img
              src="/assets/images/activity-collage-2.png?v=3"
              alt="Cooking Club and Tech Workshop"
              className="hero-flanking-collage-img hero-right-img"
              onError={(e) => {
                e.target.src = 'assets/images/activity-collage-2.png';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
