// Eliminado: este archivo estaba duplicado. Usar src/pages/ProductDetail.jsx

// Este archivo ha sido eliminado para evitar confusión.

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/api";
import "../assets/base.css";


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [quantityOptionsOpen, setQuantityOptionsOpen] = useState(false);
  const quantitySelectorRef = useRef(null);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        quantitySelectorRef.current &&
        !quantitySelectorRef.current.contains(e.target)
      ) {
        setQuantityOptionsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleQuantityDisplayClick = () => setQuantityOptionsOpen((v) => !v);
  const handleQuantityOptionClick = (val) => {
    setQuantity(val);
    setQuantityOptionsOpen(false);
  };

  if (loading) return <div>Cargando producto...</div>;
  if (!product) return <div>No se encontró el producto.</div>;

  return (
    <div style={{ background: "var(--dark-mode-bg)", minHeight: "100vh" }}>
      <header className="header">
        <img
          src="EcommerceLogoNegro_Sin_Fondo.png"
          alt="Logo de la tienda"
          className="logo"
        />
      </header>
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="main-image-container">
              <img
                id="mainProductImage"
                className="main-image"
                src={product.image}
                alt={product.name}
              />
            </div>
          </div>
          <div className="product-info">
            <h1>
              {product.name}
              <span className="favorite-icon">&#9825;</span>
            </h1>
            <div className="rating">
              <span className="score">{product.rating || "4.9"}</span>
              <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            </div>
            <div className="price-section">
              <span className="price">${product.price?.toLocaleString()}</span>
            </div>
            <a href="#" className="btn btn-buy-now">
              Comprar ahora
            </a>
            <a href="#" className="btn btn-add-to-cart">
              Agregar al carrito
            </a>
            <div className="stock-info">
              <strong>Stock disponible: {product.stock}</strong>
              <div
                className="quantity-selector"
                ref={quantitySelectorRef}
              >
                <div
                  className="quantity-display"
                  id="quantityDisplay"
                  onClick={handleQuantityDisplayClick}
                >
                  {`Cantidad: ${quantity} unidad${quantity > 1 ? "es" : ""}`}
                </div>
                <div
                  className={`quantity-options${quantityOptionsOpen ? " active" : ""}`}
                  id="quantityOptions"
                >
                  {[1, 2, 3, 4, 5, 6].map((val) => (
                    <div
                      key={val}
                      onClick={() => handleQuantityOptionClick(val)}
                    >
                      {val} unidad{val > 1 ? "es" : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="payment-method-placeholder">
              Seleccionar método de pago
            </div>
          </div>
        </div>
        {/* Puedes agregar especificaciones si existen en el producto */}
        {product.specifications && (
          <div className="product-specifications">
            <h2>Especificaciones</h2>
            <ul className="specifications-list">
              {product.specifications.map((spec, idx) => (
                <li key={idx}>
                  <strong>{spec.label}:</strong> <span>{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
