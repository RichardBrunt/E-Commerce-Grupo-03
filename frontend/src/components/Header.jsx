
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Header.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useFilters } from "@/contexts/FiltersContext.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";

const Header = () => {
  const { q, setQ } = useFilters()
  const { user, logout } = useAuth()
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
            {!user && (
              <>
                <Link to="/register">Creá tu cuenta</Link>
                <Link to="/login">Ingresá</Link>
              </>
            )}
            {user && (
              <>
                <Link to="/gestion-stock">Gestión de stock</Link>
                <span style={{ display:'inline-flex', alignItems:'center', gap:8, marginLeft: 8 }}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent((user.nombre||'') + ' ' + (user.apellido||'')) || encodeURIComponent(user.usuario||user.email)}&background=000&color=fff&rounded=true&size=64`}
                    alt="Avatar"
                    width={28}
                    height={28}
                    style={{ borderRadius: '50%', border:'1px solid #333' }}
                  />
                  <span className="badge" style={{ margin: 0 }}>Hola, {user.usuario || user.firstName || user.email}</span>
                </span>
                <button onClick={logout} className="btn btn-outline" style={{ marginLeft: 8 }}>Cerrar sesión</button>
              </>
            )}
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
