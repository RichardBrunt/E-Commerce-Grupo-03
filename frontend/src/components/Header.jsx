
import React from "react";
import "../assets/Header.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom'
import logoEcomme from "../assets/img/EcommerceLogoHeader.png";

const Header = () => {
  return (
    <header className="ml-header">
      <div className="ml-header-top">
        <div className="ml-logo-section">
          <Link to="/">
            <img
              src={logoEcomme}
              alt="Logo Ecomme PC Store"
              className="ml-logo"
            />
          </Link>
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
            <Link to="/register">Creá tu cuenta</Link>
            <Link to="/login">Ingresá</Link>
            <Link to="/my-products">Mis compras</Link>
            <Link to="/cart" aria-label="Carrito"><FaShoppingCart className="ml-cart-icon" /></Link>
          </nav>
        </div>
      </div>
      <nav className="ml-navbar">
        <Link to="#" className="ml-navbar-link">Categorías</Link>
        <Link to="#" className="ml-navbar-link">Ofertas</Link>
        <Link to="#" className="ml-navbar-link">Cupones</Link>
        <Link to="#" className="ml-navbar-link">Ayuda</Link>
      </nav>
    </header>
  );
};

export default Header;
