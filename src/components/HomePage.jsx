import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import { CategoryScroller } from './CategoryScroller/CategoryScroller';
import HowOrbitoWorks from './HowOrbitoWorks';
import JoinOrbitoCTA from './JoinOrbitoCTA';
import Footer from './Footer';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSelectCategory = (category) => {
    if (category?.slug) {
      navigate(`/categories/${category.slug}`);
    }
  };

  const handleOpenAuth = () => {
    // Triggers signup modal via the global trigger or custom event
    const signupBtn = document.querySelector('.btn-header-signup');
    if (signupBtn) {
      signupBtn.click();
    }
  };

  return (
    <div className="homepage-shell">
      <Navbar />

      <main id="main-content">
        {/* Hero Section: Left/Right activity collages, center title and CTAs */}
        <HeroSection />

        {/* Explore Your Interests Horizontal Category Scroller */}
        <section className="explore-interests-section" id="categories-section" aria-labelledby="interests-heading">
          <div className="interests-container">
            <CategoryScroller onSelectCategory={handleSelectCategory} />
          </div>
        </section>

        {/* How Orbito Works Section (3 Connected Steps with Looping Grey Arrows) */}
        <HowOrbitoWorks />

        {/* Join Orbito Promotional Call-To-Action Section */}
        <JoinOrbitoCTA onOpenAuth={handleOpenAuth} />
      </main>

      <Footer />
    </div>
  );
}
