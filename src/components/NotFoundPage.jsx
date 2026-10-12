import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { CATEGORIES } from '../data/workshops';

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <Navbar />

      <main className="container section-padding" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#7C3AED' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          404 - Page Not Found
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 2.5rem' }}>
          The category, workshop, or route you are looking for doesn't exist or has moved. Explore our 7 core categories below.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center', maxWidth: 700, marginBottom: '2.5rem' }}>
          {CATEGORIES.map(c => (
            <Link key={c.slug} to={`/categories/${c.slug}`} className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.95rem' }}>
              {c.title}
            </Link>
          ))}
        </div>

        <Link to="/" className="btn btn-primary btn-lg">
          ← Return to Orbito Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}
