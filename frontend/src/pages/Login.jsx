import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import './login.css';

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false) // false = usuario, true = admin
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    const u = await login(email, password, isAdmin) 
    // ↑ Podés pasar "isAdmin" a tu lógica de login para diferenciar
    if (!u) return setError('Credenciales inválidas')
    navigate(isAdmin ? '/admin' : '/') // redirige distinto si es admin
  }

  return (
    <form onSubmit={onSubmit} className="login-form">
      <h2>{isAdmin ? "Iniciar sesión (Administrador)" : "Iniciar sesión"}</h2>
      
      <input 
        placeholder="Email" 
        value={email} 
        onChange={e=>setEmail(e.target.value)} 
        required 
      />
      <input 
        placeholder="Contraseña" 
        type="password" 
        value={password} 
        onChange={e=>setPassword(e.target.value)} 
        required 
      />

      {error && <p className="error">{error}</p>}
      <button>Entrar</button>

      {!isAdmin && (
        <p>¿No tenés cuenta? <Link className="register-link" to="/register">Registrate</Link></p>
      )}

      {/* link discreto para cambiar entre usuario/admin */}
      <p 
        onClick={() => setIsAdmin(!isAdmin)} 
        className="change-link"
      >
        {isAdmin ? "← Volver al login de usuario" : "Login de administrador"}
      </p>
    </form>
  )
}
