import "../components/Product.css"

export default function Product ({ image, heading, description, index }) {
  const isImageRight = index % 2 === 0;

  return (
    <div className={`product`}>
      <div className={`product-image ${isImageRight ? "image-left" : "image-right"}`}>
        <img src={image} alt={heading} />
      </div>
      <div className={`product-content ${isImageRight ? "image-left" : "image-right"}`}>
        <h2>{heading}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};
