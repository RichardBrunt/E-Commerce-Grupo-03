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
  const navigate = useNavigate() // SPA: navegación sin recargar la página
  const { login } = useAuth() // useContext para acceder a la función global de login

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
    <form onSubmit={onSubmit} className="card">
      <h2>Iniciar sesión</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      {/* Renderizado condicional: muestra error si existe */}
      {error && <p style={{color:'tomato'}}>{error}</p>}
      <button>Entrar</button>
      <p>¿No tenés cuenta? <Link to="/register">Registrate aqui</Link></p>
    </form>
  )
}

