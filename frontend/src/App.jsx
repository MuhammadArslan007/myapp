import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import "./App.css";

const NAV_ITEMS = ["Home", "Services", "Certifications", "Blog", "Contact"];

export default function App() {
  const [page, setPage] = useState("Home");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (data) => {
    setUser({ username: data.username, role: data.role });
    setPage("Home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("Home");
  };

  const renderPage = () => {
    if (page === "Login") return <Login onLogin={handleLogin} />;
    if (page === "Home") return <Home />;
    if (page === "Services") return <Services />;
    if (page === "Certifications") return <Certifications />;
    if (page === "Contact") return <Contact />;
    if (page === "Blog") return <Blog />;
    return <Home />;
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setPage("Home")}>
          <span className="brand-name">Arslan DevOps</span>
          <span className="brand-tag">Portfolio</span>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                className={`nav-btn ${page === item ? "active" : ""}`}
                onClick={() => { setPage(item); setMenuOpen(false); }}
              >
                {item}
              </button>
            </li>
          ))}
          {user ? (
            <li>
              <span className="nav-user">Hi, {user.username}</span>
              <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <li>
              <button
                className={`nav-btn ${page === "Login" ? "active" : ""}`}
                onClick={() => { setPage("Login"); setMenuOpen(false); }}
              >
                Admin
              </button>
            </li>
          )}
        </ul>
      </nav>

      <main className="main-content">{renderPage()}</main>

      <footer className="footer">
        <p>Muhammad Arslan &copy; 2026 | DevOps Portfolio | PSEB Program</p>
      </footer>
    </div>
  );
}
