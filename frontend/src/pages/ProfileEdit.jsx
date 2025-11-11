import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function ProfileEdit() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    usuario: user?.usuario || '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })
  const [saving, setSaving] = useState(false)
  // Si el usuario cambia (p.ej. se carga desde localStorage), sincronizar el form
  useEffect(() => {
    setForm({
      usuario: user?.usuario || '',
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    })
  }, [user])
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
  const payload = { usuario: form.usuario, nombre: form.nombre, apellido: form.apellido, email: form.email, avatar: form.avatar }
    // Enviar solo campos que cambiaron para evitar conflictos innecesarios
    const diff = {}
    if (form.usuario !== (user?.usuario || '')) diff.usuario = form.usuario
    if (form.nombre !== (user?.nombre || '')) diff.nombre = form.nombre
    if (form.apellido !== (user?.apellido || '')) diff.apellido = form.apellido
    if (form.email !== (user?.email || '')) diff.email = form.email
    if (form.avatar !== (user?.avatar || '')) diff.avatar = form.avatar

    const res = await updateProfile(Object.keys(diff).length ? diff : {})
    if (res && !res.error) {
      navigate('/profile')
    } else {
      if (res?.status === 401) {
        alert('Tu sesión expiró o no es válida. Iniciá sesión nuevamente.')
      } else {
        alert(res?.error || 'No se pudo guardar. Intenta nuevamente')
      }
    }
    setSaving(false)
  }
  if (!user) return null
  return (
    <div className="profile-wrap">
      <div className="profile-card">
        <header className="profile-header">
          <img
            className="profile-avatar"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent((user?.nombre||'') + ' ' + (user?.apellido||''))}&background=000&color=fff&rounded=true&size=128`}
            alt="Avatar"
          />
          <div>
            <h2 className="profile-title">Editar perfil</h2>
            <p className="profile-sub">Actualiza tus datos</p>
          </div>
        </header>
        <form onSubmit={onSubmit} className="profile-form">
          <div className="profile-form-grid">
            <div className="profile-field">
              <label className="profile-label">Usuario</label>
              <input className="profile-input" name="usuario" value={form.usuario} onChange={onChange} />
            </div>
            <div className="profile-field">
              <label className="profile-label">Nombre</label>
              <input className="profile-input" name="nombre" value={form.nombre} onChange={onChange} />
            </div>
            <div className="profile-field">
              <label className="profile-label">Apellido</label>
              <input className="profile-input" name="apellido" value={form.apellido} onChange={onChange} />
            </div>
            <div className="profile-field">
              <label className="profile-label">Email</label>
              <input className="profile-input" name="email" type="email" value={form.email} onChange={onChange} />
            </div>
            <div className="profile-field">
              <label className="profile-label">URL de foto (avatar)</label>
              <input className="profile-input" name="avatar" value={form.avatar} onChange={onChange} placeholder="https://..." />
              <small style={{ color:'#666' }}>Si se deja vacío, se muestra un avatar con iniciales.</small>
            </div>
          </div>
          <div className="profile-form-actions">
            <button className="profile-btn" type="button" onClick={() => window.history.back()}>Cancelar</button>
            <button className="profile-btn primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
