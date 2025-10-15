import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }){
  const navigate = useNavigate()

  const resolveImage = (url) => {
    if (!url) return "/img/products/MacbookPro.jpg";
    if (typeof url === "string" && (url.startsWith("http") || url.startsWith("/img/"))) {
      return url;
    }
    return "/img/products/MacbookPro.jpg";
  };

  return (
    <div className="apple-card">
      {product.offer && <span className="apple-card-offer">{product.offer}</span>}
      <img src={resolveImage(product.image)} alt={product.name} className="apple-card-img" />
      <h2 className="apple-card-title">{product.name}</h2>
      <div className="apple-card-price-row">
        <span className="apple-card-price">${product.price?.toLocaleString()}</span>
      </div>
      <button
        className={`apple-btn ${product.stock > 0 ? 'apple-btn-primary' : 'apple-btn-disabled'}`}
        disabled={product.stock === 0}
        onClick={() => product.stock > 0 && navigate(`/product/${product.id}`)}
      >
        {product.stock > 0 ? 'Comprar Ahora' : 'Sin Stock'}
      </button>
    </div>
  )
}
