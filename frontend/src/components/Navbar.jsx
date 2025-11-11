// Navbar.jsx
// Ejemplo de uso de contexto global, hooks, SPA, renderizado condicional
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

export const Navbar = () => {
  // useContext para acceder al estado global del carrito y usuario
  const { itemsCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate() // SPA: navegación sin recargar la página
  // Función para cerrar sesión y redirigir (SPA)
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  // Renderizado condicional: muestra login o cerrar sesión según el estado
  return (
    <nav className="navbar">
      <Link to="/">UADE Shop</Link>
      <div className="row">
        <Link to="/gestion-stock">Gestión de Stock</Link>
        <Link to="/cart">Carrito <span className="badge">{itemsCount}</span></Link>
        {/* Renderizado condicional: si no hay usuario muestra Login, si hay usuario muestra Cerrar sesión */}
        {!user && <Link to="/login">Login</Link>}
        {user && (
          <button onClick={handleLogout} className="apple-btn apple-btn-primary apple-btn-compact" style={{ marginLeft: 8 }}>
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  )
}
