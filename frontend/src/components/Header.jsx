
import React from "react";
import "../assets/Header.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import logoEcomme from "../assets/img/EcommerceLogoHeader.png";

const Header = () => {
  return (
    <header className="ml-header">
      <div className="ml-header-top">
        <div className="ml-logo-section">
          <img
            src={logoEcomme}
            alt="Logo Ecomme PC Store"
            className="ml-logo"
          />
          <span className="ml-location">Enviar a <b>Capital Federal C1114</b></span>
        </div>
        <div className="ml-search-section">
          <input
            type="text"
            className="ml-search-input"
            placeholder="Buscar productos, marcas y más..."
          />
          <button className="ml-search-btn">
            <FaSearch />
          </button>
        </div>
        <div className="ml-header-actions">
          <button className="ml-free-shipping">ENVÍO GRATIS</button>
          <nav className="ml-user-nav">
            <a href="#">Creá tu cuenta</a>
            <a href="#">Ingresá</a>
            <a href="#">Mis compras</a>
            <FaShoppingCart className="ml-cart-icon" />
          </nav>
        </div>
      </div>
      <nav className="ml-navbar">
  <a href="#" className="ml-navbar-link">Categorías</a>
  <a href="#" className="ml-navbar-link">Ofertas</a>
  <a href="#" className="ml-navbar-link">Cupones</a>
  <a href="#" className="ml-navbar-link">Ayuda</a>
      </nav>
    </header>
  );
};

export default Header;
