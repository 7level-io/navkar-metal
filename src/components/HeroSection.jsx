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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".heading-content", {
        duration: 3,
        opacity: 0,
      });
      tl.to(
        ".lines-bg .lines:nth-child(4n+1), .lines-bg .lines:nth-child(4n+2), .lines-bg .lines:nth-child(3), .lines-bg .lines:nth-child(7)",
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.2,
          ease: "expoScale",
        },
        0
      );

      tl.to(
        ".hero-heading .border.top, .hero-heading .border.bottom",
        {
          scaleX: 1,
          duration: 3,
          ease: "expoScale",
        },
        0
      );

      tl.to(
        ".hero-heading h1 .border.right",
        {
          scaleY: 1,
          duration: 1,
          ease: "expoScale",
          delay: 0.5
        },
        1
      );

      tl.from(
        ".grey-block",
        {
          duration: 2,
          x: "100vw",
          ease: "back",
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
          Navkar Metal
          <span className="border right"></span>
        </h1>
        <div className="grey-block"></div>
      </div>
    </section>
  );
}
