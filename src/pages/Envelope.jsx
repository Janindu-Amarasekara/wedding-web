import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Envelope() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const title = searchParams.get("title") || "";
  const name = searchParams.get("name") || "";

  const guestLabel = formatTitleAndName(title, name);

  const handleOpen = () => {
    // Add animation class to envelope page
    const envelopePage = document.querySelector(".envelope-page");
    if (envelopePage) {
      envelopePage.style.animation = "envelopeFadeOut 0.8s ease-out forwards";
    }
    
    // Navigate to homepage after a short delay for animation
    setTimeout(() => {
      const params = new URLSearchParams();
      if (title) params.set("title", title);
      if (name) params.set("name", name);
      const queryString = params.toString();
      navigate(`/${queryString ? `?${queryString}` : ""}`, { replace: true });
    }, 800);
  };

  return (
    <div className="envelope-page">
      <div className="envelope-container">
        <div className="envelope-card">
          <div className="envelope-flap">
            <div className="flap-top"></div>
          </div>
          
          <div className="envelope-content">
            <h1 className="envelope-title">Wedding Invitation</h1>
            
            <div className="envelope-seal-section">
              <div className="wax-seal">
                <div className="seal-circle"></div>
                <div className="seal-design">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18"/>
                  </svg>
                </div>
              </div>
              
              <button className="open-here-btn" onClick={handleOpen}>
                Open Here
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div className="envelope-recipient">
              <div className="monogram-logo">
                <img src="./src/public/sj-logo.png" alt="Salma & Janindu Monogram" />
              </div>
              {guestLabel && (
                <p className="recipient-text">
                  <span className="recipient-label">To:</span> {guestLabel}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTitleAndName(rawTitle, rawName) {
  const title = (rawTitle || "").trim();
  const name = (rawName || "").trim();

  if (!title && !name) return "";

  const t = title.toLowerCase();

  let displayTitle = title;

  if (t === "mr" || t === "mr.") displayTitle = "MR";
  else if (t === "mrs" || t === "mrs.") displayTitle = "MRS";
  else if (t === "miss") displayTitle = "MISS";
  else if (t === "mr & mrs" || t === "mr and mrs") displayTitle = "MR & MRS";
  else if (t === "family of" || t === "family") displayTitle = "FAMILY OF";

  if (!name) return displayTitle;

  if (displayTitle === "FAMILY OF") {
    return `FAMILY OF ${name.toUpperCase()}`;
  }

  return `${displayTitle} ${name.toUpperCase()}`.trim();
}

export default Envelope;

