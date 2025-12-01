import React, { useState } from "react";

function RSVPPage() {
  return (
    <section id="rsvp" className="section section-light">
      <div className="section-inner">
        <h2>RSVP</h2>
        <p className="section-intro">
          Please let us know if you&apos;ll be able to celebrate with us. Your
          response will help us finalize the details for the day.
        </p>
        <RSVPForm />
      </div>
    </section>
  );
}

function RSVPForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    attending: "yes",
    guests: "1",
    message: ""
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Please enter your full name." });
      return;
    }
    if (!form.email.trim()) {
      setStatus({ type: "error", message: "Please enter your email." });
      return;
    }

    console.log("RSVP submitted", form);

    setStatus({
      type: "success",
      message:
        "Thank you for your response! We have received your RSVP and will be in touch with more details soon."
    });

    setForm((prev) => ({
      ...prev,
      attending: "yes",
      guests: "1",
      message: ""
    }));
  };

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="attending">Will you be attending?</label>
          <select
            id="attending"
            name="attending"
            value={form.attending}
            onChange={handleChange}
          >
            <option value="yes">Yes, I&apos;ll be there</option>
            <option value="no">Sorry, I can&apos;t make it</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="guests">Number of Guests (including you)</label>
          <select
            id="guests"
            name="guests"
            value={form.guests}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="message">
          Message to the couple (optional – dietary needs, song requests, etc.)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Share a note, prayer, or any special requests."
        />
      </div>

      {status.message && (
        <p
          className={`form-status ${
            status.type === "error" ? "error" : "success"
          }`}
        >
          {status.message}
        </p>
      )}

      <button className="btn primary full" type="submit">
        Send RSVP
      </button>
    </form>
  );
}

export default RSVPPage;


