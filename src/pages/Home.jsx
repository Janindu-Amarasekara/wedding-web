import React from "react";
import { Link } from "react-router-dom";
import { WEDDING_DATE, WEDDING_VENUE } from "../shared";

function HomePage() {
  return <HeroSection />;
}

function HeroSection() {
  return (
    <section id="welcome" className="hero">
      <div className="hero-overlay">
        <div className="hero-card">
          <p className="hero-tagline">You&apos;re invited to celebrate</p>
          <h1 className="hero-names">Salma &amp; Janindu</h1>
          <p className="hero-date">{WEDDING_DATE}</p>
          <p className="hero-location">{WEDDING_VENUE}</p>

          <div className="hero-actions">
            <Link to="/rsvp" className="btn primary">
              RSVP
            </Link>
            <Link to="/details" className="btn ghost">
              View details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;


