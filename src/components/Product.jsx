import "../components/Product.css";
import RightArrow from "./RightArrow";

export default function Product({ image, heading }) {
  return (
    <a
      href="https://navkarmetals.7level.in/products"
      target="_blank"
      rel="noopener noreferrer"
      className="product-card"
      aria-label={`View ${heading} products`}
    >
      <div className="product-image-container">
        <img src={image} alt={heading} />
        <div className="product-overlay"></div>
      </div>
      <div className="product-content">
        <h3 className="product-heading">{heading}</h3>
        <div className="product-arrow">
          <RightArrow />
        </div>
      </div>
    </a>
  );
}
