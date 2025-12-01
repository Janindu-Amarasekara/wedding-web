import React from "react";
import { WEDDING_DATE, WEDDING_TIME, WEDDING_VENUE, MAPS_URL } from "../shared";

function DetailsPage() {
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
            <p className="detail-sub">{WEDDING_TIME}</p>
            <p className="detail-body">
              Please arrive 30 minutes early to be seated before the ceremony
              begins.
            </p>
          </div>

          <div className="detail-card">
            <h3>Location</h3>
            <p className="detail-main">{WEDDING_VENUE}</p>
            <p className="detail-body">
              A reception with dinner, music, and dancing will follow the
              ceremony at the same location.
            </p>
            <button
              className="btn secondary full"
              type="button"
              onClick={() => window.open(MAPS_URL, "_blank")}
            >
              Open in Google Maps
            </button>
          </div>

          <div className="detail-card">
            <h3>Dress Code</h3>
            <p className="detail-main">Formal / Traditional</p>
            <p className="detail-body">
              We kindly ask our guests to dress in formal or traditional attire
              to help make the day feel extra special in photos and memories.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailsPage;


