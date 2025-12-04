import React from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/Home";
import RSVPPage from "./pages/RSVP";
import EnvelopePage from "./pages/Envelope";

function App() {
  const location = useLocation();
  const isEnvelopePage = location.pathname === "/envelope";

  return (
    <div className="page">
      {!isEnvelopePage && <Header currentPath={location.pathname} />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
          <Route path="/envelope" element={<EnvelopePage />} />
        </Routes>
      </main>
      {!isEnvelopePage && <Footer />}
    </div>
  );
}

function Header({ currentPath }) {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-inner">
        <div onClick={() => navigate("/")} className="header-brand">
          <span className="brand-small">The Wedding of</span>
          <span className="brand-names">Salma &amp; Janindu</span>
        </div>
        <nav className="nav">
          <NavLink to="/" label="Home" currentPath={currentPath} />
          <NavLink to="/rsvp" label="RSVP" currentPath={currentPath} />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, label, currentPath }) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      className={isActive ? "nav-link nav-link-active" : "nav-link"}
    >
      {label}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        With love, <span className="footer-names">Salma &amp; Janindu</span>
      </p>
      {/* <p className="footer-note">
        Inspired by modern wedding sites like{" "}
        <a
          href="https://withjoy.com/janindu-amarasekara-and-salma/welcome"
          target="_blank"
          rel="noreferrer"
        >
          our Joy page
        </a>
        .
      </p> */}
    </footer>
  );
}

export default App;
