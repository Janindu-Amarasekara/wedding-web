import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  WEDDING_DATE,
  WEDDING_TIME,
  WEDDING_END_TIME,
  WEDDING_VENUE,
  MAPS_URL,
  BRIDE_PARENTS,
  GROOM_PARENTS
} from "../shared";

function formatTitleAndName(rawTitle, rawName) {
  const title = (rawTitle || "").trim();
  const name = (rawName || "").trim();

  if (!title && !name) return "";

  const t = title.toLowerCase();

  let displayTitle = title;

  if (t === "mr" || t === "mr.") displayTitle = "Mr";
  else if (t === "mrs" || t === "mrs.") displayTitle = "Mrs";
  else if (t === "miss") displayTitle = "Miss";
  else if (t === "mr & mrs" || t === "mr and mrs") displayTitle = "Mr & Mrs";
  else if (t === "family of" || t === "family") displayTitle = "Family of";

  if (!name) return displayTitle;

  if (displayTitle === "Family of") {
    return `Family of ${name}`;
  }

  return `${displayTitle} ${name}`.trim();
}

function HomePage() {
  const [searchParams] = useSearchParams();

  const title = searchParams.get("title") || "";
  const name = searchParams.get("name") || "";

  const guestLabel = formatTitleAndName(title, name);

  return (
    <>
      <HeroSection guestLabel={guestLabel} />
      <DetailsSection />
    </>
  );
}

function HeroSection({ guestLabel }) {
  return (
    <section id="welcome" className="hero">
      <div className="hero-overlay">
        <div className="hero-card">
          {guestLabel && (
            <p className="hero-guest">
              Dear <span className="hero-guest-name">{guestLabel}</span>,
            </p>
          )}
          <p className="hero-tagline">You&apos;re invited to celebrate the wedding of</p>
          <h1 className="hero-names">Salma &amp; Janindu</h1>
          <p className="hero-date">{WEDDING_DATE}</p>
          <p className="hero-location">{WEDDING_VENUE}</p>

          <div className="hero-actions">
            <Link to="/rsvp" className="btn primary">
              RSVP
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailsSection() {
  return (
    <section id="details" className="section section-light">
      <div className="section-inner">
        <h2>Wedding Details</h2>
        <p className="section-intro">
          We are so excited to celebrate this special day with our family and
          friends. Here are the key details for our wedding celebration.
        </p>

        <div className="details-container">
          <div className="detail-item">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="detail-content">
              <h3>Date & Time</h3>
              <p className="detail-main">{WEDDING_DATE}</p>
              <p className="detail-sub">
                {WEDDING_TIME} – {WEDDING_END_TIME}
              </p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="detail-content">
              <h3>Venue</h3>
              <p className="detail-main">{WEDDING_VENUE}</p>
              <button
                className="btn secondary"
                type="button"
                onClick={() => window.open(MAPS_URL, "_blank")}
              >
                View on Map
              </button>
            </div>
          </div>
        </div>

        <div className="parents-section">
          <div className="parent-info">
            <div className="parent-icon-bride">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <p className="parent-label">Daughter of</p>
            <p className="parent-names">
              {BRIDE_PARENTS.father} &amp; {BRIDE_PARENTS.mother}
            </p>
            <p className="parent-bride-name">{BRIDE_PARENTS.brideName}</p>
          </div>
          <div className="parent-info">
            <div className="parent-icon-groom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <p className="parent-label">Son of</p>
            <p className="parent-names">
              {GROOM_PARENTS.father} &amp; {GROOM_PARENTS.mother}
            </p>
            <p className="parent-groom-name">{GROOM_PARENTS.groomName}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;


