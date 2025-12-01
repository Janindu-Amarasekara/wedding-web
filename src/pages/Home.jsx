import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  WEDDING_DATE,
  WEDDING_TIME,
  WEDDING_END_TIME,
  WEDDING_VENUE,
  MAPS_URL
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
          <p className="hero-tagline">You&apos;re invited to celebrate</p>
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

        <div className="details-grid">
          <div className="detail-card">
            <h3>Ceremony</h3>
            <p className="detail-main">{WEDDING_DATE}</p>
            <p className="detail-sub">
              {WEDDING_TIME} – {WEDDING_END_TIME}
            </p>
          </div>

          <div className="detail-card">
            <h3>Location</h3>
            <p className="detail-main">{WEDDING_VENUE}</p>
            <button
              className="btn secondary full"
              type="button"
              onClick={() => window.open(MAPS_URL, "_blank")}
            >
              Open in Google Maps
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;


