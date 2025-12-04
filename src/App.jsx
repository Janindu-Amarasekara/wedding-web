import React from "react";
import { Routes, Route, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import HomePage from "./pages/Home";
import RSVPPage from "./pages/RSVP";

function App() {
  const location = useLocation();

  return (
    <div className="page">
      <Header currentPath={location.pathname} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function Header({ currentPath }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleLogoClick = () => {
    const queryString = searchParams.toString();
    navigate(`/${queryString ? `?${queryString}` : ''}`);
  };
  
  return (
    <header className="header">
      <div className="header-inner">
        <div onClick={handleLogoClick} className="header-brand">
          <span className="brand-small">The Wedding of</span>
          <span className="brand-names">Salma &amp; Janindu</span>
        </div>
        <nav className="nav">
          <NavLink to="/" label="Home" currentPath={currentPath} searchParams={searchParams} />
          <NavLink to="/rsvp" label="RSVP" currentPath={currentPath} searchParams={searchParams} />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, label, currentPath, searchParams }) {
  const isActive = currentPath === to;
  const queryString = searchParams.toString();
  const toWithParams = `${to}${queryString ? `?${queryString}` : ''}`;
  
  return (
    <Link
      to={toWithParams}
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
