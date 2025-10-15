// Login.jsx
// Componente controlado, validación de datos, manejo de estado y renderizado condicional
// Utiliza useState para estado local, useNavigate para navegación SPA, useAuth para contexto global
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import '../assets/Cart.css'
import '../assets/Login.css'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    const u = await login(email, password)
    if (!u) return setError('Credenciales inválidas')
    navigate('/cart')
  }

  return (
    <div className="auth-page">
      <section className="auth-hero-banner" aria-label="Bienvenida a la página de inicio de sesión">
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">Bienvenido de nuevo</h1>
          <p className="auth-hero-desc">Accedé a tu cuenta para continuar con tu compra.</p>
        </div>
        <div className="auth-hero-img-container">
          <img src="/img/banners/hero_intro_endframe__e6khcva4hkeq_large.jpg" alt="Macbook Banner" className="auth-hero-img" />
        </div>
      </section>
      <form onSubmit={onSubmit} className="auth-card">
        <header className="auth-header">
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtext">Ingresá con tu correo y contraseña para continuar.</p>
        </header>

        <div className="auth-fields">
          <div className="form-group input-group">
            <span className="field-icon" aria-hidden>✉️</span>
            <input
              className="auth-input"
              placeholder="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group input-group">
            <span className="field-icon" aria-hidden>🔒</span>
            <input
              className="auth-input"
              placeholder="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="toggle-visibility"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-actions">
          <a href="#" className="auth-link">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" className="btn-primary btn-block">Iniciar sesión</button>

        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">Regístrate ahora</Link>
        </div>
      </form>
    </div>
  )
}