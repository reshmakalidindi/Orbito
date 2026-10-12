import React from 'react';
import { Link } from 'react-router-dom';

export default function WorkshopCard({ workshop }) {
  if (!workshop) return null;

  // Determine badge color class based on type
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Webinar':
        return 'badge-webinar';
      case 'Outdoor activity':
        return 'badge-outdoor';
      case 'Activity':
        return 'badge-activity';
      case 'Workshop':
      default:
        return 'badge-workshop';
    }
  };

  // Generate a category/type specific SVG miniature icon
  const renderWorkshopArt = () => {
    switch (workshop.type) {
      case 'Webinar':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        );
      case 'Outdoor activity':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <polygon points="12 2 2 22 22 22 12 2"></polygon>
            <line x1="12" y1="9" x2="12" y2="15"></line>
            <circle cx="12" cy="18" r="0.5"></circle>
          </svg>
        );
      case 'Activity':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        );
      case 'Workshop':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        );
    }
  };

  return (
    <div className="workshop-card" data-workshop-id={workshop.id}>
      <div className="workshop-card-inner">
        {/* Top Header: Number and Type Badge */}
        <div className="workshop-card-top-row">
          <span className="workshop-num-tag">#{workshop.num || workshop.id.slice(0, 4)}</span>
          <span className={`workshop-type-badge ${getTypeBadgeClass(workshop.type)}`}>
            {workshop.type}
          </span>
        </div>

        {/* Thumbnail Illustration Banner */}
        <div className="workshop-art-banner" aria-hidden="true">
          <div className="art-circle-icon">
            {renderWorkshopArt()}
          </div>
          <span className="art-category-pill">{workshop.categoryTitle || 'Orbito Workshop'}</span>
        </div>

        {/* Title and Exact Description */}
        <div className="workshop-content-body">
          <h3 className="workshop-title">
            <Link to={`/workshops/${workshop.id}`}>
              {workshop.title}
            </Link>
          </h3>

          <p className="workshop-description">
            {workshop.description}
          </p>

          {/* Metadata badges: Duration, Level, Instructor */}
          <div className="workshop-metadata-row">
            {workshop.duration && (
              <span className="meta-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {workshop.duration}
              </span>
            )}
            {workshop.level && (
              <span className="meta-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                {workshop.level}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Price & View Details Button */}
        <div className="workshop-card-footer">
          <div className="workshop-price-wrap">
            <span className="price-label">Fee</span>
            <span className="price-value">{workshop.price || 'Free'}</span>
          </div>

          <Link
            to={`/workshops/${workshop.id}`}
            className="btn-view-details"
            aria-label={`View details for ${workshop.title}`}
          >
            <span>View Details</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
