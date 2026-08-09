import "../components/Product.css";

export default function Product({ image, heading }) {
  return (
    <div className="product">
      <a
        href="https://navkarmetals.7level.in/products"
        target="_blank"
        rel="noopener noreferrer"
        className="product-image"
        aria-label={heading}
      >
        <img src={image} alt={heading} />
        <div className="product-image-overlay" aria-hidden="true">
          <h2>{heading}</h2>
        </div>
      </a>
    </div>
  );
}
