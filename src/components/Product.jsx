import "../components/Product.css";
import RightArrow from "./RightArrow";

export default function Product({
  image,
  heading,
  description,
  index,
  message,
}) {
  const isImageRight = index % 2 === 0;

  return (
    <div className={`product`}>
      <div
        className={`product-image ${
          isImageRight ? "image-left" : "image-right"
        }`}
      >
        <img src={image} alt={heading} />
      </div>
      <div
        className={`product-content ${
          isImageRight ? "image-left" : "image-right"
        }`}
      >
        <h2>{heading}</h2>
        {description && <p>{description}</p>}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-button"
        >
          Enquire<RightArrow />
        </a>
      </div>
    </div>
  );
}
