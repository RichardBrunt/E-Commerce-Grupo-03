import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

export const Navbar = () => {
  const { itemsCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  return (
    <nav className="navbar">
      <Link to="/">UADE Shop</Link>
      <div className="row">
        <Link to="/my-products">Mis publicaciones</Link>
        <Link to="/cart">Carrito <span className="badge">{itemsCount}</span></Link>
        {!user && <Link to="/login">Login</Link>}
        {user && <button onClick={handleLogout} style={{marginLeft:8}}>Cerrar sesión</button>}
      </div>
    </nav>
  )
}
