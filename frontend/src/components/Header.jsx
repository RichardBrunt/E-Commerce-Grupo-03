
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/Header.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useFilters } from "@/contexts/FiltersContext.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";

const Header = () => {
  const { q, setQ } = useFilters()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onSearchSubmit = (e) => {
    e.preventDefault()
    // Navegar a Home para ver resultados filtrados por `q`
    navigate('/')
  }
  return (
    <header className="ml-header">
      <div className="ml-header-top">
        <div className="ml-logo-section">
          <Link to="/" aria-label="Ir a inicio">
            <img
              src="/img/EcommerceLogoHeader.png"
              alt="Ecommerce PC Store"
              className="ml-logo"
              decoding="async"
              fetchpriority="high"
              onError={(e) => { e.currentTarget.src = '/img/products/MacbookPro.jpg'; e.currentTarget.alt='Logo alternativo'; }}
            />
          </Link>
          <span className="ml-location">Enviar a <b>Capital Federal C1114</b></span>
        </div>
        <form className="ml-search-section" role="search" onSubmit={onSearchSubmit}>
          <input
            type="text"
            className="ml-search-input"
            placeholder="Buscar productos, marcas y más..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="ml-search-btn" aria-label="Buscar">
            <FaSearch />
          </button>
        </form>
        <div className="ml-header-actions">
          <button className="ml-free-shipping">ENVÍO GRATIS</button>
          <nav className="ml-user-nav">
            {!user && (
              <>
                <Link to="/register">Creá tu cuenta</Link>
                <Link to="/login">Ingresá</Link>
              </>
            )}
            {user && (<ProfileMenuInline />)}
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

// Menú de perfil inline (sin crear archivos nuevos)
function ProfileMenuInline(){
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = React.useRef(null)
  const navigate = useNavigate()
  React.useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])
  if(!user) return null
  const name = `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || (user.usuario || user.email)
  const onLogout = () => { logout(); navigate('/') }
  return (
    <div className="ml-profile" ref={ref}>
      <button className="ml-profile-btn" onClick={() => setOpen(v=>!v)} aria-haspopup="menu" aria-expanded={open}>
        <img
          src={user?.avatar && user.avatar.trim() !== ''
            ? user.avatar
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff&rounded=true&size=64`}
          alt="Avatar" width={28} height={28} style={{ borderRadius:'50%', border:'1px solid #333' }}
          onError={(e)=>{ e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff&rounded=true&size=64` }}
        />
        <span className="ml-profile-name">{name || 'Mi perfil'}</span>
        <span className="ml-caret">▾</span>
      </button>
      {open && (
        <div className="ml-profile-menu" role="menu">
          <div className="ml-profile-header">
            <div className="ml-profile-initials">{(name?.[0] || 'U').toUpperCase()}</div>
            <div>
              <div className="ml-profile-title">{name}</div>
              <div className="ml-profile-sub">Mi perfil</div>
            </div>
          </div>
          <nav className="ml-profile-list">
            <Link to="/profile" role="menuitem" className="ml-profile-item">Perfil</Link>
            <Link to="/profile/edit" role="menuitem" className="ml-profile-item">Editar perfil</Link>
            <Link to="/gestion-stock" role="menuitem" className="ml-profile-item">Gestión de stock</Link>
            <button onClick={onLogout} role="menuitem" className="ml-profile-item danger">Cerrar sesión</button>
          </nav>
        </div>
      )}
    </div>
  )
}
