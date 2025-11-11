import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import '../assets/Header.css'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!user) return null

  const name = `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || (user.usuario || user.email)

  const onLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="ml-profile" ref={ref}>
      <button className="ml-profile-btn" onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff&rounded=true&size=64`}
          alt="Avatar"
          width={28}
          height={28}
          style={{ borderRadius: '50%', border:'1px solid #333' }}
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
