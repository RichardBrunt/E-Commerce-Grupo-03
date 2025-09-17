import React, { useState, useRef, useEffect } from "react";
import "../assets/base.css";

const images = [
  "img-MacBook-Pro-Retina-14-Inch-07388-scaled-1250x1250.jpg",
  "apple-macbook-pro-m4-max-14-core-36gb-1tb-ssd-14-2-retina-001.jpg",
  "4-5bb84f0516520c080b17339291476696-1024-1024.jpg",
  "1-0b352ca347cc5568df17346209617833-1024-1024.jpg",
];

export default function ProductDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [quantityOptionsOpen, setQuantityOptionsOpen] = useState(false);
  const quantitySelectorRef = useRef(null);

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

  const handleThumbnailClick = (idx) => setCurrentImageIndex(idx);
  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };
  const handleMainImageClick = () => setModalOpen(true);
  const handleModalClick = () => setModalOpen(false);
  const handleQuantityDisplayClick = () => setQuantityOptionsOpen((v) => !v);
  const handleQuantityOptionClick = (val) => {
    setQuantity(val);
    setQuantityOptionsOpen(false);
  };

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
            <div className="thumbnails">
              {images.map((src, idx) => (
                <div
                  className={`thumbnail-item${idx === currentImageIndex ? " active" : ""}`}
                  data-index={idx}
                  key={src}
                  onClick={() => handleThumbnailClick(idx)}
                >
                  <img src={src} alt={`Miniatura ${idx + 1}`} />
                </div>
              ))}
            </div>
            <div className="main-image-container" onClick={handleMainImageClick}>
              <img
                id="mainProductImage"
                className="main-image"
                src={images[currentImageIndex]}
                alt="MacBook Pro 14 pulgadas M1 Pro"
              />
              <button className="nav-arrow prev" id="prevArrow" onClick={handlePrev}>
                &#10094;
              </button>
              <button className="nav-arrow next" id="nextArrow" onClick={handleNext}>
                &#10095;
              </button>
            </div>
          </div>
          <div className="product-info">
            <h1>
              MacBook Pro 14” M1 Pro
              <span className="favorite-icon">&#9825;</span>
            </h1>
            <div className="rating">
              <span className="score">4.9</span>
              <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            </div>
            <div className="price-section">
              <span className="price">$2,499.99</span>
            </div>
            <a href="#" className="btn btn-buy-now">
              Comprar ahora
            </a>
            <a href="#" className="btn btn-add-to-cart">
              Agregar al carrito
            </a>
            <div className="stock-info">
              <strong>Stock disponible</strong>
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
        <div className="product-specifications">
          <h2>Especificaciones</h2>
          <ul className="specifications-list">
            <li>
              <strong>Chipset:</strong>{" "}
              <span>Apple M1 Pro (CPU 10 núcleos, GPU 16 núcleos)</span>
            </li>
            <li>
              <strong>Pantalla:</strong>{" "}
              <span>14.2" Liquid Retina XDR (ProMotion)</span>
            </li>
            <li>
              <strong>Resolución:</strong> <span>3024 x 1964</span>
            </li>
            <li>
              <strong>Memoria RAM:</strong> <span>16 GB unificada</span>
            </li>
            <li>
              <strong>Almacenamiento:</strong> <span>512 GB SSD</span>
            </li>
            <li>
              <strong>Puertos:</strong>{" "}
              <span>3x Thunderbolt 4, HDMI, ranura SDXC, MagSafe 3</span>
            </li>
            <li>
              <strong>Teclado:</strong>{" "}
              <span>Magic Keyboard retroiluminado con Touch ID</span>
            </li>
            <li>
              <strong>Audio:</strong>{" "}
              <span>Sistema de 6 altavoces con sonido espacial</span>
            </li>
            <li>
              <strong>Sistema Operativo:</strong> <span>macOS</span>
            </li>
            <li>
              <strong>Dimensiones:</strong> <span>1.55 x 31.26 x 22.12 cm</span>
            </li>
            <li>
              <strong>Peso:</strong> <span>1.6 kg</span>
            </li>
          </ul>
        </div>
      </div>
      {modalOpen && (
        <div
          id="imageModal"
          className="image-modal"
          style={{ display: "flex" }}
          onClick={handleModalClick}
        >
          <img
            className="modal-image"
            id="modalImage"
            src={images[currentImageIndex]}
            alt="Imagen ampliada"
          />
        </div>
      )}
    </div>
  );
}
