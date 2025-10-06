import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null

  const name = `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || (user.usuario || user.email)
  const avatarUrl = user?.avatar && user.avatar.trim() !== ''
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff&rounded=true&size=128`

  return (
    <div className="profile-wrap">
      <div className="profile-card">
        <header className="profile-header">
          <img className="profile-avatar" src={avatarUrl} alt="Avatar" onError={(e)=>{ e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff&rounded=true&size=128` }} />
          <div>
            <h2 className="profile-title">{name}</h2>
            <p className="profile-sub">Mi perfil</p>
          </div>
        </header>
        <div className="profile-body">
          <div className="profile-grid">
            <div className="profile-item"><b>Usuario</b> {user.usuario || '-'}</div>
            <div className="profile-item"><b>Nombre</b> {user.nombre || '-'}</div>
            <div className="profile-item"><b>Apellido</b> {user.apellido || '-'}</div>
            <div className="profile-item"><b>Email</b> {user.email}</div>
          </div>
          <div className="profile-actions">
            <Link to="/profile/edit" className="profile-btn primary">Editar perfil</Link>
            <Link to="/gestion-stock" className="profile-btn">Gestión de stock</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
