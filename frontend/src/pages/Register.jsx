import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

import './register.css';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { register } = useAuth();
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate('/');
  };

  return (
    <form onSubmit={onSubmit} className="register-form">
      <h2>Crear cuenta</h2>
      <div className="row">
        <input
          name="username"
          placeholder="Usuario"
          onChange={onChange}
          required
          className="register-input"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={onChange}
          required
          className="register-input"
        />
      </div>
      <div className="row">
        <input
          name="firstName"
          placeholder="Nombre"
          onChange={onChange}
          required
          className="register-input"
        />
        <input
          name="lastName"
          placeholder="Apellido"
          onChange={onChange}
          required
          className="register-input"
        />
      </div>
      <input
        name="password"
        placeholder="Contraseña"
        type="password"
        onChange={onChange}
        required
        className="register-input"
      />
      <button type="submit" className="register-button">
        Registrarme
      </button>
    </form>
  );
}