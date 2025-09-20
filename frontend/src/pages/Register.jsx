// Register.jsx
// Componente controlado, validación de datos, manejo de estado y renderizado condicional
// Utiliza useState para estado local, useNavigate para navegación SPA, useAuth para contexto global
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function Register(){
  // Estado local para inputs y errores (useState, hook de React)
  const [form, setForm] = useState({ usuario:'', nombre:'', apellido:'', email:'', password:'', confirm:'' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate() // SPA: navegación sin recargar la página
  const { register } = useAuth() // useContext para acceder a la función global de registro
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Estilos inline, consistentes con Login.jsx y paleta del proyecto
  const styles = {
    page: { minHeight: 'calc(100vh - 120px)', display: 'grid', placeItems: 'center', padding: '2rem 1rem' },
    card: {
      width: '100%', maxWidth: 520,
      background: 'var(--surface, #141414)', color: 'var(--text, #eaeaea)',
      border: '1px solid var(--border, #2a2a2a)', borderRadius: 18,
      padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,.35)',
      boxSizing: 'border-box', overflow: 'hidden', display: 'grid', gap: '1rem'
    },
    title: { textAlign: 'center', fontSize: '1.5rem', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' },
    inputGroup: { position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', borderRadius: 12 },
    input: {
      width: '100%', maxWidth: '100%', display: 'block', boxSizing: 'border-box',
      padding: '.75rem .9rem', background: '#111', color: 'var(--text, #eaeaea)',
      border: '1px solid var(--border, #2a2a2a)', borderRadius: 12
    },
    submit: {
      width: '100%', maxWidth: '100%', boxSizing: 'border-box', display: 'block',
      background: '#000', color: '#fff',
      border: '1px solid #333', borderRadius: 12, padding: '.9rem 1rem', fontWeight: 700,
      cursor: 'pointer', opacity: submitting ? .7 : 1
    },
    error: { color: 'tomato', marginTop: '.25rem' }
  }

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

  // Renderizado condicional de errores y formulario
  return (
    <div style={styles.page}>
      <form onSubmit={onSubmit} style={styles.card}>
        <h2 style={styles.title}>Crear cuenta</h2>

        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <input name="usuario" placeholder="Usuario" onChange={onChange} value={form.usuario} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <input name="email" placeholder="Correo electrónico" type="email" onChange={onChange} value={form.email} style={styles.input} required />
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <input name="nombre" placeholder="Nombre" onChange={onChange} value={form.nombre} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <input name="apellido" placeholder="Apellido" onChange={onChange} value={form.apellido} style={styles.input} required />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <input name="password" placeholder="Contraseña" type="password" onChange={onChange} value={form.password} style={styles.input} required />
        </div>
        <div style={styles.inputGroup}>
          <input name="confirm" placeholder="Confirmar contraseña" type="password" onChange={onChange} value={form.confirm} style={styles.input} required />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.submit} disabled={submitting}>
          {submitting ? 'Registrando…' : 'Registrarme'}
        </button>
      </form>
    </div>
  )
}

