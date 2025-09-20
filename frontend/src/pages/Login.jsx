// Login.jsx
// Componente controlado, validación de datos, manejo de estado y renderizado condicional
// Utiliza useState para estado local, useNavigate para navegación SPA, useAuth para contexto global
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function Login(){
  // Estado local para inputs y errores (useState, hook de React)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate() // SPA: navegación sin recargar la página
  const { login } = useAuth() // useContext para acceder a la función global de login

  // Estilos inline (CSS-in-JS) respetando la paleta: usa variables con fallbacks
  const styles = {
    page: {
      minHeight: 'calc(100vh - 120px)',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem 1rem'
    },
    card: {
      width: '100%',
      maxWidth: 420,
      background: 'var(--surface, #141414)',
      color: 'var(--text, #eaeaea)',
      border: '1px solid var(--border, #2a2a2a)',
      borderRadius: 18,
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0,0,0,.35)',
      boxSizing: 'border-box',
      overflow: 'hidden',
      display: 'grid',
      gap: '1rem'
    },
    title: { textAlign: 'center', fontSize: '1.5rem', margin: '0 0 1rem 0' },
    inputGroup: { position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', borderRadius: 12 },
    input: {
      width: '100%',
      maxWidth: '100%',
      display: 'block',
      boxSizing: 'border-box',
      padding: '.75rem .9rem .75rem 2.2rem',
      background: '#111',
      color: 'var(--text, #eaeaea)',
      border: '1px solid var(--border, #2a2a2a)',
      borderRadius: 12
    },
    icon: { position: 'absolute', left: '.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted, #aaa)', pointerEvents: 'none' },
    actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '.75rem 0 1rem 0' },
    linkMuted: { color: 'var(--muted, #aaa)', fontSize: '.9rem' },
    link: { color: 'var(--text, #eaeaea)', textDecoration: 'underline' },
    submit: {
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      display: 'block',
      background: '#000',
      color: '#fff',
      border: '1px solid #333',
      borderRadius: 12,
      padding: '.9rem 1rem',
      fontWeight: 700,
      cursor: 'pointer'
    },
    footer: { textAlign: 'center', color: 'var(--muted, #aaa)', marginTop: '1rem' },
    toggleBtn: { position: 'absolute', right: '.6rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--muted, #aaa)', cursor: 'pointer', maxWidth: '2rem' },
    error: { color: 'tomato', marginTop: '.5rem' }
  }

  // Validación y manejo de submit
  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    // Validación de datos (formulario controlado)
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    // Lógica de autenticación (API simulada, contexto global)
    const u = await login(email, password)
    if (!u) return setError('Credenciales inválidas')
    // Redirección programática (SPA)
    navigate('/cart')
  }

  // Renderizado condicional de errores y formulario
  return (
    <div style={styles.page}>
      <form onSubmit={onSubmit} style={styles.card}>
        <h2 style={styles.title}>Iniciar sesión</h2>

        <div style={{ display: 'grid', gap: '.75rem' }}>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>✉️</span>
            <input
              style={styles.input}
              placeholder="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <span style={styles.icon}>🔒</span>
            <input
              style={styles.input}
              placeholder="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(s => !s)} style={styles.toggleBtn} aria-label="Mostrar u ocultar contraseña">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <span style={styles.linkMuted}>
            <a href="#" style={styles.link}>¿Olvidaste tu contraseña?</a>
          </span>
        </div>

        <button type="submit" style={styles.submit}>Iniciar sesión</button>

        <div style={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={styles.link}>Regístrate ahora</Link>
        </div>
      </form>
    </div>
  )
}
