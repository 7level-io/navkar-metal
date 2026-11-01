import "./App.css";
import BannerMarquee from "./components/BannerMarquee";
import TopNavbar from "./components/TopNavbar";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";

function App() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <BannerMarquee />
      <TopNavbar />
      <main id="main-content">
        <HeroSection />
        <ProductsSection />
      </main>
    </>
  );
}

export default App;
