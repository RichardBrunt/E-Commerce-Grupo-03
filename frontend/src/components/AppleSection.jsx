import React, { useEffect, useState } from "react";

import bannerMacbook from "../assets/img/products/MacbookBannerBody.jpg";
import MacbookPro from "../assets/img/products/MacbookPro.jpg";
import MacbookPro2 from "../assets/img/products/MacbookPro2.jpg";
import MacbookPro3 from "../assets/img/products/MacbookPro3.jpg";
import MacbookPro4 from "../assets/img/products/MacbookPro4.jpg";
import Iphone17pro from "../assets/img/products/Iphone 17pro.jpg";
import Iphone16 from "../assets/img/products/Iphone16.jpg";
import Iphone17 from "../assets/img/products/Iphone17.jpg";
import IphoneAir from "../assets/img/products/IphoneAir.jpg";
import SmartTV1 from "../assets/img/products/SmartTV1.jpg";
import SmartTV2 from "../assets/img/products/SmartTV2.jpg";
import SmartTV3 from "../assets/img/products/SmartTV3.jpg";
import SmartTV4 from "../assets/img/products/SmartTV4.jpg";
import "../assets/AppleSection.css";
import { listProducts } from "../services/api";

const categories = [
  "iPhone",
  "Macbook",
  "Airpods",
  "iPad",
  "Apple Watch",
  "TV & Casa",
  "Accesorios"
];




const AppleSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  return (
    <section className="apple-section">
      {/* Banner principal */}
      <section className="apple-hero-banner">
        <div className="apple-hero-content">
          <h1 className="apple-hero-title">MacBook Air M2</h1>
          <p className="apple-hero-desc">Potencia y portabilidad en su máxima expresión.</p>
          <div className="apple-hero-price-row">
            <span className="apple-hero-price">$1.499.999</span>
            <button className="apple-hero-btn-main">Comprar Ahora</button>
          </div>
        </div>
        <div className="apple-hero-img-container">
          <img src={bannerMacbook} alt="Macbook Banner" className="apple-hero-img" />
        </div>
      </section>

      {/* Scrollbar de categorías */}
      <div className="apple-categories-scroll">
        {categories.map((cat) => (
          <button key={cat} className="apple-category-btn">{cat}</button>
        ))}
      </div>

      {/* Cards de productos */}
      <div className="apple-products-grid">
        {loading ? <p>Cargando productos...</p> : products.map((prod, idx) => (
          <div className="apple-card" key={prod.id || idx}>
            {/* Puedes adaptar la lógica de oferta y stock según los datos reales */}
            {prod.offer && <span className="apple-card-offer">{prod.offer}</span>}
            <img src={prod.image} alt={prod.name} className="apple-card-img" />
            <h2 className="apple-card-title">{prod.name}</h2>
            <div className="apple-card-price-row">
              <span className="apple-card-price">${prod.price?.toLocaleString()}</span>
            </div>
            <button
              className={`apple-btn ${prod.stock > 0 ? "apple-btn-primary" : "apple-btn-disabled"}`}
              disabled={prod.stock === 0}
            >
              {prod.stock > 0 ? "Comprar Ahora" : "Sin Stock"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppleSection;
