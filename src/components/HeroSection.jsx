import "./HeroSection.css";

export default function HeroSection() {
  const divCount = 12;
  const divs = Array.from({ length: divCount }, (_, index) => (
    <div key={index} className="lines">
    </div>
  ));
  return (
    <>
      <section className="HeroSection">
        <div className="lines-bg">{divs}</div>
        <div className="hero-heading">
          <h1>Navkar Metal</h1>
          <div className="grey-block"></div>
        </div>
      </section>
    </>
  );
}
