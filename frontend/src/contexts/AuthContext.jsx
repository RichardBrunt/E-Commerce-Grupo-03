import React, { createContext, useContext, useEffect, useState } from 'react'

const USERS = [
  { email: "santino@mail.com", password: "pass1", nombre: "santino", apellido: "amadey", usuario: "santinoa" },
  { email: "julian@mail.com", password: "pass2", nombre: "julian", apellido: "resumil", usuario: "julianr" },
  { email: "santiago@mail.com", password: "pass3", nombre: "santiago", apellido: "calderon", usuario: "santiagoc" },
  { email: "juan@mail.com", password: "pass4", nombre: "juan", apellido: "gonzales", usuario: "juang" },
  { email: "richard@mail.com", password: "pass5", nombre: "richard", apellido: "brunt", usuario: "richardb" },
  { email: "ignacio@mail.com", password: "pass6", nombre: "ignacio", apellido: "alba", usuario: "ignacioa" },
  { email: "valentino@mail.com", password: "pass7", nombre: "valentino", apellido: "cagnina", usuario: "valentinoc" },
  { email: "juanpablo@mail.com", password: "pass8", nombre: "juan pablo", apellido: "garcia", usuario: "juanpablog" },
]

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('uade_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = async (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      localStorage.setItem('uade_user', JSON.stringify(found))
      return found
    }
    return null
  }

  const register = async (payload) => {
    // Solo permite registro si el email no existe
    const exists = USERS.find(u => u.email === payload.email)
    if (exists) return null
    const newUser = {
      email: payload.email,
      password: payload.password,
      nombre: payload.nombre,
      apellido: payload.apellido,
      usuario: payload.usuario
    }
    USERS.push(newUser)
    setUser(newUser)
    localStorage.setItem('uade_user', JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('uade_user')
  }

  return <AuthCtx.Provider value={{ user, login, logout, register }}>{children}</AuthCtx.Provider>
}
