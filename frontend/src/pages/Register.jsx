// Register.jsx
// Componente controlado, validación de datos, manejo de estado y renderizado condicional
// Utiliza useState para estado local, useNavigate para navegación SPA, useAuth para contexto global
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function Register(){
  // Estado local para inputs y errores (useState, hook de React)
  const [form, setForm] = useState({ usuario:'', nombre:'', apellido:'', email:'', password:'' })
  const [error, setError] = useState(null)
  const navigate = useNavigate() // SPA: navegación sin recargar la página
  const { register } = useAuth() // useContext para acceder a la función global de registro
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Validación y manejo de submit
  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    // Validación de datos (formulario controlado)
    if (!form.usuario || !form.nombre || !form.apellido || !form.email || !form.password) {
      setError('Completa todos los campos')
      return
    }
    if (!form.email.includes('@')) {
      setError('Email inválido')
      return
    }
    if (form.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres')
      return
    }
    // Lógica de registro (API simulada, contexto global)
    const u = await register(form)
    if (!u) {
      setError('El email ya está registrado')
      return
    }
    // Redirección programática (SPA)
    navigate('/cart')
  }

  // Renderizado condicional de errores y formulario
  return (
    <form onSubmit={onSubmit} className="card">
      <h2>Crear cuenta</h2>
      <div className="row">
        <input name="usuario" placeholder="Usuario" onChange={onChange} required />
        <input name="email" placeholder="Email" type="email" onChange={onChange} required />
      </div>
      <div className="row">
        <input name="nombre" placeholder="Nombre" onChange={onChange} required />
        <input name="apellido" placeholder="Apellido" onChange={onChange} required />
      </div>
      <input name="password" placeholder="Contraseña" type="password" onChange={onChange} required />
      <button>Registrarme</button>
      {/* Renderizado condicional: muestra error si existe */}
      {error && <p style={{color:'tomato'}}>{error}</p>}
    </form>
  )
}
