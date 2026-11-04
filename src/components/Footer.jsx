import "./Footer.css";
import logo from "../assets/imgs/logo.svg";
import sevenLevelLogo from "../assets/7level.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <img src={logo} alt="Navkar Metals" className="footer-logo" width="24" height="20" />
            <span className="footer-title">Navkar Metals</span>
          </div>
          <p className="footer-copy">© {currentYear} Navkar Metals. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <a
            href="https://7level.in"
            target="_blank"
            rel="noopener noreferrer"
            className="powered-by-link"
            aria-label="Powered by 7level"
          >
            <span className="powered-by-text">Powered by</span>
            <div className="powered-by-badge">
              <img
                src={sevenLevelLogo}
                alt="7level"
                className="powered-by-logo"
                width="18"
                height="18"
              />
              <span className="powered-by-name">7level</span>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
