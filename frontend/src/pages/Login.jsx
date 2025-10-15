import React, { useState } from 'react'                      // useState: estado local para email, password, error, isAdmin
import { useNavigate, Link } from 'react-router-dom'         // useNavigate: navegación programática; Link: navegación SPA sin recarga
import { useAuth } from '@/contexts/AuthContext.jsx'         // useContext (vía useAuth): acceso a la función login del AuthContext

import './login.css'                                         // Importación de estilos locales

export default function Login() {
  const [email, setEmail] = useState('')                     // useState: guarda el email del input
  const [password, setPassword] = useState('')               // useState: guarda la contraseña del input
  const [error, setError] = useState(null)                   // useState: guarda mensajes de error para mostrar feedback
  const [isAdmin, setIsAdmin] = useState(false)              // useState: flag que alterna entre modo usuario / admin

  const navigate = useNavigate()                             // useNavigate: se usa para redirigir tras el login
  const { login } = useAuth()                                // useContext (vía useAuth): obtiene la función login del contexto

  const onSubmit = async (e) => {                            // Manejo de submit asíncrono: previene recarga y llama a login
    e.preventDefault()                                       // preventDefault: evita recarga completa del navegador
    const u = await login(email, password, isAdmin)          // Llamada asincrónica a la lógica de autenticación (useAuth / login)
    if (!u) return setError('Credenciales inválidas')        // Renderizado condicional: setea error si falla la autenticación
    navigate(isAdmin ? '/admin' : '/')                       // Navegación programática tras login exitoso (useNavigate)
  }

  return (
    <form onSubmit={onSubmit} className="login-form">
      <h2>{isAdmin ? "Iniciar sesión (Administrador)" : "Iniciar sesión"}</h2>

      <input
        placeholder="Email"
        value={email}                                         // Inputs controlados (patrón): el valor viene del estado
        onChange={e => setEmail(e.target.value)}             // Inputs controlados (patrón): onChange actualiza el estado
        required
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={password}                                      // Inputs controlados (patrón): el valor viene del estado
        onChange={e => setPassword(e.target.value)}          // Inputs controlados (patrón): onChange actualiza el estado
        required
      />

      {error && <p className="error">{error}</p>}            // Renderizado condicional: muestra el mensaje de error si existe
      <button>Entrar</button>

      {!isAdmin && (                                         // Renderizado condicional: muestra el enlace a registro solo en modo usuario
        <p>¿No tenés cuenta? <Link className="register-link" to="/register">Registrate</Link></p>
      )}

      <p
        onClick={() => setIsAdmin(!isAdmin)}                  // Toggle: invierte el flag isAdmin (usa useState)
        className="change-link"
      >
        {isAdmin ? "← Volver al login de usuario" : "Login de administrador"}
      </p>
    </form>
  )
}