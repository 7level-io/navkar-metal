import sectionsData from "../data/ProductData";
import Product from "./Product";
import "../components/ProductsSection.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ProductsSection() {
  const showcaseRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ".product-showcase-border.top, .product-showcase-border.bottom",
          { scaleX: 1 }
        );
        gsap.set(
          ".product-showcase-border.left, .product-showcase-border.right",
          { scaleY: 1 }
        );
        return;
      }

      // Check if showcase frame is visible (it's display: none on mobile <= 767px)
      const isMobile = window.innerWidth <= 767;
      if (isMobile) return;

      const tl = gsap.timeline();

      tl.to(
        ".product-showcase-border.top, .product-showcase-border.bottom",
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        ".product-showcase-border.left, .product-showcase-border.right",
        {
          scaleY: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0
      );
    }, showcaseRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="product-showcase" data-navbar-color="default" ref={showcaseRef}>
      <div className="product-showcase-frame" aria-hidden="true">
        <span className="product-showcase-border top"></span>
        <span className="product-showcase-border bottom"></span>
        <span className="product-showcase-border left"></span>
        <span className="product-showcase-border right"></span>
      </div>
      <div className="product-showcase-intro-container">
        <p className="section-eyebrow">PRODUCT CATALOGUE</p>
        <div className="product-showcase-intro">
          <h2>Start with the section you need.</h2>
          <p>
            From everyday structural sections to roofing sheets, choose a
            category to see available sizes and build your enquiry.
          </p>
        </div>
      </div>
      <div className="ProductsSection">
        {sectionsData.map((section, index) => (
          <Product
            key={index}
            index={index}
            image={section.image}
            heading={section.heading}
            description={section.description}
            message={section.message}
          />
        ))}
      </div>
    </section>
  );
}
