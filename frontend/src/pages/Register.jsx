import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function Register(){
  const [form, setForm] = useState({ usuario:'', nombre:'', apellido:'', email:'', password:'' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { register } = useAuth()
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
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
    const u = await register(form)
    if (!u) {
      setError('El email ya está registrado')
      return
    }
    navigate('/cart')
  }

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
      {error && <p style={{color:'tomato'}}>{error}</p>}
    </form>
  )
}
