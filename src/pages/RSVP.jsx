import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function RSVPPage() {
  return (
    <section id="rsvp" className="section section-light rsvp-section">
      <div className="section-inner">
        <div className="rsvp-header">
          <div className="rsvp-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M13 8H7"></path>
              <path d="M17 12H7"></path>
            </svg>
          </div>
          <h2>RSVP</h2>
          <p className="section-intro">
            Please let us know if you&apos;ll be able to celebrate with us. Your
            response will help us finalize the details for the day.
          </p>
        </div>
        <RSVPForm />
      </div>
    </section>
  );
}

function RSVPForm() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    attending: "yes",
    guests: "1",
    message: "",
    honeypot: "", // Honeypot field - should remain empty
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA v3 script
  useEffect(() => {
    if (!recaptchaSiteKey) {
      console.warn("reCAPTCHA Site Key not found. Set VITE_RECAPTCHA_SITE_KEY in your .env file");
      setRecaptchaLoaded(true); // No key, skip loading
      return;
    }

    console.log("Loading reCAPTCHA v3 with site key:", recaptchaSiteKey.substring(0, 10) + "...");

    // Check if script is already loaded
    if (window.grecaptcha) {
      console.log("reCAPTCHA already loaded");
      setRecaptchaLoaded(true);
      return;
    }

    // Load the script dynamically
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("reCAPTCHA script loaded");
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          console.log("reCAPTCHA ready");
          setRecaptchaLoaded(true);
        });
      } else {
        console.warn("reCAPTCHA script loaded but grecaptcha not available");
        setRecaptchaLoaded(true);
      }
    };
    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script");
      setRecaptchaLoaded(true); // Continue without reCAPTCHA
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector(
        `script[src*="recaptcha/api.js"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [recaptchaSiteKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // If attending is "no", set guests to 0
      if (name === "attending" && value === "no") {
        updated.guests = "0";
      } else if (name === "attending" && value === "yes" && prev.guests === "0") {
        // If switching back to yes and guests was 0, set to 1
        updated.guests = "1";
      }
      return updated;
    });
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Wait for reCAPTCHA to load if it's required
    if (recaptchaSiteKey && !recaptchaLoaded) {
      setStatus({
        type: "error",
        message: "Please wait for security verification to load...",
      });
      return;
    }

    if (!form.firstName.trim()) {
      setStatus({ type: "error", message: "Please enter your first name." });
      return;
    } else if (form.firstName.trim().length < 3) {
      setStatus({
        type: "error",
        message: "First name must be at least 3 characters long.",
      });
      return;
    }

    if (!form.lastName.trim()) {
      setStatus({ type: "error", message: "Please enter your last name." });
      return;
    } else if (form.lastName.trim().length < 3) {
      setStatus({
        type: "error",
        message: "Last name must be at least 3 characters long.",
      });
      return;
    }

    // Honeypot check - if filled, it's likely a bot
    if (form.honeypot.trim() !== "") {
      // Silently fail - don't let bots know they were caught
      setStatus({
        type: "success",
        message:
          "Thank you for your response! We have received your RSVP and will be in touch with more details soon.",
      });
      setForm((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        attending: "yes",
        guests: "1",
        message: "",
        honeypot: "",
      }));
      return;
    }

    // Verify reCAPTCHA v3 (only if site key is configured)
    let recaptchaToken = null;
    if (recaptchaSiteKey) {
      if (!window.grecaptcha) {
        console.error("reCAPTCHA not loaded. Check your site key and network connection.");
        setStatus({
          type: "error",
          message: "Security verification not loaded. Please refresh the page and try again.",
        });
        return;
      }
      
      try {
        console.log("Executing reCAPTCHA...");
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {
          action: "submit_rsvp",
        });
        console.log("reCAPTCHA token generated:", recaptchaToken ? "Success" : "Failed");
        
        if (!recaptchaToken) {
          setStatus({
            type: "error",
            message: "reCAPTCHA verification failed. Please try again.",
          });
          return;
        }
      } catch (error) {
        console.error("reCAPTCHA error:", error);
        setStatus({
          type: "error",
          message: "reCAPTCHA verification failed. Please refresh and try again.",
        });
        return;
      }
    } else {
      console.warn("reCAPTCHA site key not configured - skipping verification");
    }

    // Submit to Supabase with server-side reCAPTCHA verification
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);
    
    try {
      // If we have a reCAPTCHA token, verify it server-side via Edge Function
      if (recaptchaToken) {
        // Call Supabase Edge Function to verify reCAPTCHA and save RSVP
        const { data: functionData, error: functionError } = await supabase.functions.invoke(
          'verify-recaptcha',
          {
            body: {
              token: recaptchaToken,
              rsvpData: {
                first_name: form.firstName.trim(),
                last_name: form.lastName.trim(),
                attending: form.attending === "yes",
                guests: form.attending === "yes" ? parseInt(form.guests, 10) : 0,
                message: form.message.trim() || null,
              }
            }
          }
        );

        if (functionError) {
          console.error('Edge Function error:', functionError);
          // Fallback to direct insert if Edge Function fails
          console.warn('Falling back to direct insert');
        } else if (functionData?.error) {
          console.error('reCAPTCHA verification failed:', functionData);
          setStatus({
            type: "error",
            message: functionData.error === 'reCAPTCHA score too low' 
              ? "Security verification failed. Please try again."
              : "Sorry, there was an error submitting your RSVP. Please try again later.",
          });
          setIsSubmitting(false);
          return;
        } else if (functionData?.success) {
          // Success via Edge Function
          console.log("RSVP submitted successfully with score:", functionData.score);
          setStatus({
            type: "success",
            message:
              "Thank you for your response! We have received your RSVP and will be in touch with more details soon.",
          });

          setForm((prev) => ({
            ...prev,
            firstName: "",
            lastName: "",
            attending: "yes",
            guests: "1",
            message: "",
          }));
          
          setIsSubmitting(false);
          return;
        }
      }

      // Fallback: Direct insert (for development or if Edge Function not set up)
      const { data, error } = await supabase
        .from('rsvps')
        .insert({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          attending: form.attending === "yes",
          guests: form.attending === "yes" ? parseInt(form.guests, 10) : 0,
          message: form.message.trim() || null,
          recaptcha_token: recaptchaToken || null
        });

      if (error) {
        console.error('Error submitting RSVP:', error);
      setStatus({
        type: "error",
        message: "Sorry, there was an error submitting your RSVP. Please try again later.",
      });
      setIsSubmitting(false);
      return;
      }

      console.log("RSVP submitted successfully:", data);

      setStatus({
        type: "success",
        message:
          "Thank you for your response! We have received your RSVP and will be in touch with more details soon.",
      });

      setForm((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        attending: "yes",
        guests: "1",
        message: "",
      }));
      
      setIsSubmitting(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatus({
        type: "error",
        message: "Sorry, there was an error submitting your RSVP. Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon">
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
          <h3>Your Information</h3>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="firstName">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon">
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
              <path d="M8 14h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 18h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M16 18h.01"></path>
            </svg>
          </div>
          <h3>Attendance Details</h3>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="attending">Will you be attending?</label>
            <div className="attending-options">
              <label
                className={`attending-option ${
                  form.attending === "yes" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={form.attending === "yes"}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Yes, I&apos;ll be there</span>
                </div>
              </label>
              <label
                className={`attending-option ${
                  form.attending === "no" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={form.attending === "no"}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span>Sorry, I can&apos;t make it</span>
                </div>
              </label>
            </div>
          </div>
          {form.attending === "yes" && (
            <div className="form-field">
              <label htmlFor="guests">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Number of Guests
              </label>
              <select
                id="guests"
                name="guests"
                value={form.guests}
                onChange={handleChange}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3>Special Message</h3>
        </div>
          <div className="form-field">
            <label htmlFor="message">Message to the couple (optional)</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="Share a note, prayer, dietary needs, or any special requests..."
            />
          </div>
          
          {/* Honeypot field - hidden from users but visible to bots */}
          <div className="form-field honeypot-field">
            <label htmlFor="website" style={{ display: "none" }}>
              Website (leave blank)
            </label>
            <input
              type="text"
              id="website"
              name="honeypot"
              value={form.honeypot}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                opacity: 0,
                pointerEvents: "none"
              }}
            />
          </div>
        </div>

      {status.message && (
        <div
          className={`form-status-card ${
            status.type === "error" ? "error" : "success"
          }`}
        >
          <div className="status-icon">
            {status.type === "error" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
          <p>{status.message}</p>
        </div>
      )}

      <div className="form-submit-wrapper">
        <button 
          className="btn primary rsvp-submit-btn" 
          type="submit"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? "Submitting..." : "Confirm"}</span>
          {!isSubmitting && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}

export default RSVPPage;
