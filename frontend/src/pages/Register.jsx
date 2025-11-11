// Register.jsx
// Componente controlado, validación de datos, manejo de estado y renderizado condicional
// Utiliza useState para estado local, useNavigate para navegación SPA, useAuth para contexto global
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import '../assets/Cart.css'
import '../assets/Login.css'

export default function Register(){
  // Estado local
  const [form, setForm] = useState({ usuario:'', nombre:'', apellido:'', email:'', password:'', confirm:'' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Validación y manejo de submit
  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    // Validación de datos (formulario controlado)
    if (!form.usuario || !form.nombre || !form.apellido || !form.email || !form.password || !form.confirm) {
      setError('Completa todos los campos')
      return
    }
    if (!form.email.includes('@')) {
      setError('Email inválido')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.usuario.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres')
      return
    }
    // Lógica de registro (API simulada, contexto global)
    try {
      setSubmitting(true)
      const u = await register(form)
      if (!u) {
        setError('El email ya está registrado')
        return
      }
      // Redirección programática (SPA)
      navigate('/cart')
    } finally {
      setSubmitting(false)
    }
  }

  // UI con estilos compartidos con Login
  return (
    <div className="auth-page">
      <section className="auth-hero-banner" aria-label="Bienvenida a la página de registro">
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">Crear tu cuenta</h1>
          <p className="auth-hero-desc">Registrate para guardar tus compras y acelerar tu checkout.</p>
        </div>
        <div className="auth-hero-img-container">
          <img src="/img/banners/hero_intro_endframe__e6khcva4hkeq_large.jpg" alt="Macbook Banner" className="auth-hero-img" />
        </div>
      </section>

      <form onSubmit={onSubmit} className="auth-card">
        <header className="auth-header">
          <h2 className="auth-title">Crear cuenta</h2>
          <p className="auth-subtext">Completá tus datos para registrarte.</p>
        </header>

        <div className="auth-fields">
          <div className="form-row">
            <div className="form-group input-group">
              <input className="auth-input" name="usuario" placeholder="Usuario" onChange={onChange} value={form.usuario} required />
            </div>
            <div className="form-group input-group">
              <input className="auth-input" name="email" placeholder="Correo electrónico" type="email" onChange={onChange} value={form.email} required autoComplete="email" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group input-group">
              <input className="auth-input" name="nombre" placeholder="Nombre" onChange={onChange} value={form.nombre} required />
            </div>
            <div className="form-group input-group">
              <input className="auth-input" name="apellido" placeholder="Apellido" onChange={onChange} value={form.apellido} required />
            </div>
          </div>

          <div className="form-group input-group">
            <input className="auth-input" name="password" placeholder="Contraseña" type={showPw ? 'text' : 'password'} onChange={onChange} value={form.password} required autoComplete="new-password" />
            <button type="button" className="toggle-visibility" onClick={()=>setShowPw(s=>!s)} aria-label={showPw? 'Ocultar contraseña':'Mostrar contraseña'}>
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="form-group input-group">
            <input className="auth-input" name="confirm" placeholder="Confirmar contraseña" type={showConfirm ? 'text' : 'password'} onChange={onChange} value={form.confirm} required autoComplete="new-password" />
            <button type="button" className="toggle-visibility" onClick={()=>setShowConfirm(s=>!s)} aria-label={showConfirm? 'Ocultar confirmación':'Mostrar confirmación'}>
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Registrando…' : 'Registrarme'}
        </button>

        <div className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login" className="auth-link">Iniciar sesión</Link>
        </div>
      </form>
    </div>
  )
}

