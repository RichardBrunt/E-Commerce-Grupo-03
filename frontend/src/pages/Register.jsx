import React, { useState } from 'react';                     // useState (objeto form): guarda todos los campos del formulario
import { useNavigate } from 'react-router-dom';              // useNavigate: redirección programática tras registro
import { useAuth } from '@/contexts/AuthContext.jsx';        // useContext (vía useAuth): acceso a la función register del AuthContext

import './register.css';                                     // Importación de estilos locales

export default function Register() {
  const [form, setForm] = useState({                         // useState (objeto form): username, firstName, lastName, email, password
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();                            // useNavigate (React Router)
  const { register } = useAuth();                            // useContext (vía useAuth): obtiene register del contexto de autenticación

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  // Handler onChange genérico: actualiza dinámicamente la propiedad del objeto form según el atributo name del input

  const onSubmit = async (e) => {                            // Manejo de submit asíncrono: previene recarga y llama a register
    e.preventDefault();                                      // preventDefault: evita recarga completa del navegador
    await register(form);                                    // Llamada asincrónica a la lógica de autenticación (useAuth / register)
    navigate('/');                                           // Navegación programática tras registro exitoso (useNavigate)
  };

  return (
    <form onSubmit={onSubmit} className="register-form">
      <h2>Crear cuenta</h2>

      <div className="row">
        <input
          name="username"
          placeholder="Usuario"
          onChange={onChange}                                 // Inputs controlados (patrón): actualizan `form` vía onChange
          required
          className="register-input"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={onChange}                                 // Inputs controlados (patrón): `email` se guarda en form.email
          required
          className="register-input"
        />
      </div>

      <div className="row">
        <input
          name="firstName"
          placeholder="Nombre"
          onChange={onChange}                                 // Inputs controlados (patrón): `firstName` se guarda en form.firstName
          required
          className="register-input"
        />
        <input
          name="lastName"
          placeholder="Apellido"
          onChange={onChange}                                 // Inputs controlados (patrón): `lastName` se guarda en form.lastName
          required
          className="register-input"
        />
      </div>

      <input
        name="password"
        placeholder="Contraseña"
        type="password"
        onChange={onChange}                                   // Inputs controlados (patrón): `password` se guarda en form.password
        required
        className="register-input"
      />
      <button type="submit" className="register-button">
        Registrarme
      </button>
    </form>
  );
}