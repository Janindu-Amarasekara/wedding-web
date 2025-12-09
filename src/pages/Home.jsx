import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  WEDDING_DATE,
  WEDDING_TIME,
  WEDDING_END_TIME,
  WEDDING_VENUE,
  MAPS_URL,
  BRIDE_PARENTS,
  GROOM_PARENTS,
} from "../shared";

// Function to generate calendar event with mobile support
function generateCalendarEvent() {
  // Parse the date: "Friday, January 16, 2026"
  // Split by comma: ["Friday", "January 16", "2026"]
  const parts = WEDDING_DATE.split(", ");
  const monthDay = parts[1]; // "January 16"
  const year = parts[2]; // "2026"

  // Split month and day: "January 16" -> ["January", "16"]
  const monthDayParts = monthDay.split(" ");
  const month = monthDayParts[0]; // "January"
  const day = monthDayParts[1]; // "16"

  // Convert month name to number
  const monthNames = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  // Parse time: "6:30 PM" -> 18:30
  function parseTime(timeStr) {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, "0")}${minutes.padStart(2, "0")}`;
  }

  const startTime = parseTime(WEDDING_TIME);
  const endTime = parseTime(WEDDING_END_TIME);

  // Format dates for different calendar systems
  const dayPadded = day.padStart(2, "0");
  const monthNum = monthNames[month];

  // Verify we have valid values
  if (!monthNum || !dayPadded || !year) {
    console.error("Error parsing date:", { month, day, year, WEDDING_DATE });
    alert("Error: Could not parse wedding date. Please contact us.");
    return;
  }

  // For ICS format - use local time without timezone (floating time)
  const startDateTime = `${year}${monthNum}${dayPadded}T${startTime}00`;
  const endDateTime = `${year}${monthNum}${dayPadded}T${endTime}00`;

  // For Google Calendar - format: YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS
  const googleStartDateTime = `${year}${monthNum}${dayPadded}T${startTime}00`;
  const googleEndDateTime = `${year}${monthNum}${dayPadded}T${endTime}00`;

  // Debug output
  console.log("Parsed wedding date:", {
    original: WEDDING_DATE,
    year,
    month,
    day,
    monthNum,
    dayPadded,
    startTime,
    endTime,
    startDateTime,
    endDateTime,
  });

  // Detect device type
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;

  // Create ICS file content
  const now = new Date();
  const nowStr = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${now.getTime()}@wedding-invitation`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:Wedding of Salma & Janindu`,
    `DESCRIPTION:You're invited to celebrate the wedding of Salma & Janindu\\n\\nVenue: ${WEDDING_VENUE}`,
    `LOCATION:${WEDDING_VENUE}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Wedding tomorrow!",
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT1440M",
    "ACTION:EMAIL",
    "DESCRIPTION:Reminder: Wedding in 1 day",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  // Helper function to create Google Calendar URL
  function createGoogleCalendarUrl() {
    const datesParam = `${googleStartDateTime}/${googleEndDateTime}`;
    const textParam = encodeURIComponent("Wedding of Salma & Janindu");
    // Include reminder info in details since Google Calendar URL doesn't reliably support custom reminders
    const detailsParam = encodeURIComponent(
      `You're invited to celebrate the wedding of Salma & Janindu\n\nVenue: ${WEDDING_VENUE}\n\nNote: Please set a reminder for 1 day before the event.`
    );
    const locationParam = encodeURIComponent(WEDDING_VENUE);
    // Note: Google Calendar URL 'remind' parameter is unreliable, so we rely on ICS file reminders
    // For Chrome/iOS, users can manually set the reminder or use the ICS file download option
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${textParam}&dates=${datesParam}&details=${detailsParam}&location=${locationParam}`;
  }

  // For iOS - Apple Calendar for Safari, Google Calendar for Chrome
  if (isIOS) {
    // Detect if it's Chrome on iOS
    const isChrome = /CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

    if (isChrome) {
      // Chrome on iOS - use Google Calendar link (Chrome doesn't handle ICS downloads well)
      const googleCalendarUrl = createGoogleCalendarUrl();
      window.open(googleCalendarUrl, "_blank");
      return;
    } else {
      // Safari on iOS - download ICS file (opens in Apple Calendar)
      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });

      // Create object URL and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "wedding.ics");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      return;
    }
  }

  // For Android - use Google Calendar link
  if (isAndroid) {
    const googleCalendarUrl = createGoogleCalendarUrl();
    window.open(googleCalendarUrl, "_blank");
    return;
  }

  // For desktop - download ICS file
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "wedding-invitation.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function formatTitleAndName(rawTitle, rawName, withFamily = false) {
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

  let formattedName = name;
  if (withFamily) {
    formattedName = `${name} & Family`;
  }

  if (displayTitle === "Family of") {
    return `Family of ${formattedName}`;
  }

  return `${displayTitle} ${formattedName}`.trim();
}

function HomePage() {
  const [searchParams] = useSearchParams();

  const title = searchParams.get("title") || "";
  const firstname = searchParams.get("firstname") || "";
  const lastname = searchParams.get("lastname") || "";
  const withFamily = searchParams.get("family") === "true" || searchParams.get("family") === "1";

  // Combine firstname and lastname into full name
  const fullName = [firstname, lastname].filter(Boolean).join(" ");

  const guestLabel = formatTitleAndName(title, fullName, withFamily);

  return (
    <>
      <HeroSection guestLabel={guestLabel} searchParams={searchParams} />
      <DetailsSection />
    </>
  );
}

function HeroSection({ guestLabel, searchParams }) {
  return (
    <section id="welcome" className="hero">
      <div className="hero-overlay">
        <div className="hero-card">
          {guestLabel && (
            <p className="hero-guest">
              Dear <span className="hero-guest-name">{guestLabel}</span>,
            </p>
          )}
          <p className="hero-tagline">
            You&apos;re invited to celebrate the wedding of
          </p>
          <h1 className="hero-names">
            <span className="hero-name">Salma</span>
            <span className="hero-ampersand">&amp;</span>
            <span className="hero-name">Janindu</span>
          </h1>
          <p className="hero-date">{WEDDING_DATE}</p>
          <p className="hero-location">{WEDDING_VENUE}</p>

          <div className="hero-actions">
            <Link
              to={`/rsvp${
                searchParams.toString() ? `?${searchParams.toString()}` : ""
              }`}
              className="btn primary"
            >
              Are You Joining Us?
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
              <button
                className="btn secondary calendar-btn"
                type="button"
                onClick={generateCalendarEvent}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
