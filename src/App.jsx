import "./App.css";
import BannerMarquee from "./components/BannerMarquee";
import TopNavbar from "./components/TopNavbar";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";
import Footer from "./components/Footer";

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
      <Footer />
    </>
  );
}

export default App;
