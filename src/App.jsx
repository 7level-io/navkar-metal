import "./App.css";
import BannerMarquee from "./components/BannerMarquee";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import TopNavbar from "./components/TopNavbar";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";

function App() {
  return (
    <Router>
      <BannerMarquee />
      <TopNavbar />
      <HeroSection />
      <ProductsSection />
    </Router>
  );
}

export default App;
