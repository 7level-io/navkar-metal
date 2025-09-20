import { useState, useEffect, useRef } from "react";
// import { Menu, X } from "lucide-react";
import "./TopNavbar.css";
import { Link, useLocation } from "react-router-dom";

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navbarColor, setNavbarColor] = useState("default");
  const observer = useRef(null);

  const location = useLocation();

  // Detect scroll depth for shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section color detection (trigger when bottom of section hits top)
  useEffect(() => {
    const sections = document.querySelectorAll("[data-navbar-color]");
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setNavbarColor(entry.target.dataset.navbarColor || "default");
          }
        });
      },
      {
        rootMargin: "0px 0px -100% 0px", // bottom touches top
        threshold: 0,
      }
    );
    sections.forEach((section) => observer.current.observe(section));
    return () => observer.current?.disconnect();
  }, []);

  const getPageLabel = (pathname) => {
    if (pathname === "/") return "";
    const label = pathname
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return ` - ${label}`;
  };

  return (
    <header
      className={`navbar navbar-${navbarColor} ${
        scrolled && navbarColor === "default" ? "navbar-shadow" : ""
      }`}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/7level-revamp">7Level{getPageLabel(location.pathname)}</Link>
        </div>

        <nav className={`navbar-links ${isOpen ? "active" : ""}`}>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {/* {isOpen ? <X size={28} /> : <Menu size={28} />} */}
        </button>
      </div>
    </header>
  );
}
