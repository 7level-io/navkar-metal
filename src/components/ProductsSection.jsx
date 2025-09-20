import sectionsData from "../data/ProductData";
import Product from "./Product";
import "../components/ProductsSection.css"

export default function ProductsSection() {
  return (
    <div className="ProductsSection">
      {sectionsData.map((section, index) => (
        <Product
          key={index}
          index={index}
          image={section.image}
          heading={section.heading}
          description={section.description}
        />
      ))}
    </div>
  );
}
