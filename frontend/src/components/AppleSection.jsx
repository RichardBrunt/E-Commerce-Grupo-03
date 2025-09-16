import React from "react";

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

const categories = [
  "iPhone",
  "Macbook",
  "Airpods",
  "iPad",
  "Apple Watch",
  "TV & Casa",
  "Accesorios"
];

// Ejemplo de productos, reemplaza por tus datos reales
const products = [
  {
    name: "MacBook Pro M1",
    price: 1799999,
    oldPrice: 1999999,
    image: MacbookPro,
    inStock: true,
    offer: "10% OFF"
  },
  {
    name: "MacBook Pro M3",
    price: 1899999,
    oldPrice: 2099999,
    image: MacbookPro2,
    inStock: true,
    offer: "10% OFF"
  },
  {
    name: "MacBook Pro M4",
    price: 1699999,
    oldPrice: 1899999,
    image: MacbookPro3,
    inStock: false,
    offer: "10% OFF"
  },
  {
    name: "MacBook Pro M2",
    price: 1799999,
    image: MacbookPro4,
    inStock: true
  },
  {
    name: "iPhone 17 Pro",
    price: 1399999,
    oldPrice: 1499999,
    image: Iphone17pro,
    inStock: true,
    offer: "Nuevo"
  },
  {
    name: "iPhone 17",
    price: 1299999,
    image: Iphone17,
    inStock: true
  },
  {
    name: "iPhone 16",
    price: 1199999,
    image: Iphone16,
    inStock: false
  },
  {
    name: "iPhone Air",
    price: 899999,
    oldPrice: 999999,
    image: IphoneAir,
    inStock: true,
    offer: "10% OFF"
  },
  {
    name: "Smart TV 50''",
    price: 799999,
    image: SmartTV1,
    inStock: true
  },
  {
    name: "Smart TV 60''",
    price: 899999,
    image: SmartTV2,
    inStock: true
  },
  {
    name: "Smart TV 40''",
    price: 899999,
    oldPrice: 999999,
    image: SmartTV3,
    inStock: false,
    offer: "10% OFF"
  },
  {
    name: "Smart TV 43''",
    price: 1099999,
    image: SmartTV4,
    inStock: true
  }
];

const AppleSection = () => {
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
        {products.map((prod, idx) => (
          <div className="apple-card" key={idx}>
            {prod.offer && <span className="apple-card-offer">{prod.offer}</span>}
            <img src={prod.image} alt={prod.name} className="apple-card-img" />
            <h2 className="apple-card-title">{prod.name}</h2>
            <div className="apple-card-price-row">
              <span className="apple-card-price">${prod.price.toLocaleString()}</span>
            </div>
            <button
              className={`apple-btn ${prod.inStock ? "apple-btn-primary" : "apple-btn-disabled"}`}
              disabled={!prod.inStock}
            >
              {prod.inStock ? "Comprar Ahora" : "Sin Stock"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppleSection;
