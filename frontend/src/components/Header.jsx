
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Header.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useFilters } from "@/contexts/FiltersContext.jsx";

const Header = () => {
  const { q, setQ } = useFilters()
  return (
    <header className="ml-header">
      <div className="ml-header-top">
        <div className="ml-logo-section">
          <Link to="/">
            <img
              src="/img/EcommerceLogoHeader.png"
              alt="Logo Ecomme PC Store"
              className="ml-logo"
              onError={(e) => { e.currentTarget.src = "/img/products/MacbookPro.jpg"; }}
            />
          </Link>
          <span className="ml-location">Enviar a <b>Capital Federal C1114</b></span>
        </div>
        <div className="ml-search-section">
          <input
            type="text"
            className="ml-search-input"
            placeholder="Buscar productos, marcas y más..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="ml-search-btn" aria-label="Buscar">
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
        <a href="#" className="ml-navbar-link">Ofertas</a>
        <a href="#" className="ml-navbar-link">Cupones</a>
        <a href="#" className="ml-navbar-link">Ayuda</a>
      </nav>
    </header>
  );
};

export default Header;
