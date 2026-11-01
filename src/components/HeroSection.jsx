import "./HeroSection.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef(null);

  const divCount = 12;
  const divs = Array.from({ length: divCount }, (_, index) => (
    <div key={index} className="lines"></div>
  ));

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".heading-content", { opacity: 1 });
        gsap.set(
          ".lines-bg .lines:nth-child(4n+1), .lines-bg .lines:nth-child(4n+2), .lines-bg .lines:nth-child(3), .lines-bg .lines:nth-child(7)",
          { scaleY: 1 }
        );
        gsap.set(".hero-heading .border.top, .hero-heading .border.bottom", {
          scaleX: 1,
        });
        return;
      }

      const tl = gsap.timeline();

      tl.from(".heading-content", {
        duration: 0.6,
        opacity: 0,
        ease: "power2.out",
      });
      tl.to(
        ".lines-bg .lines:nth-child(4n+1), .lines-bg .lines:nth-child(4n+2), .lines-bg .lines:nth-child(3), .lines-bg .lines:nth-child(7)",
        {
          scaleY: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        ".hero-heading .border.top, .hero-heading .border.bottom",
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
        },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="HeroSection" ref={sectionRef}>
      <div className="lines-bg">{divs}</div>
      <div className="hero-heading">
        <span className="border top"></span>
        <span className="border bottom"></span>
        <h1 className="heading-content">
          Navkar Metals
          <span className="border right"></span>
        </h1>
        <div className="grey-block"></div>
      </div>
    </section>
  );
}
