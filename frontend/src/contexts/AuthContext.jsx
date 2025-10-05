import React, { createContext, useContext, useEffect, useState } from 'react'
import { registerUser, loginUser, findUsersByEmail, updateUser } from '@/services/api.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('uade_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = async (email, password) => {
    try {
      // Autenticación contra json-server (persistencia)
      const found = await loginUser({ email, password })
      if (!found) return null
      setUser(found)
      localStorage.setItem('uade_user', JSON.stringify(found))
      return found
    } catch (e) {
      console.error('login error', e)
      return null
    }
  }

  const register = async (payload) => {
    try {
      // Persistencia: validar unicidad por email y crear en /users
      const { confirm, ...data } = payload || {}
      const existing = await findUsersByEmail(data.email)
      if (Array.isArray(existing) && existing.length > 0) return null

      // Guardamos los mismos campos que maneja el front (usuario/nombre/apellido/email/password)
      const created = await registerUser({ ...data })
      setUser(created)
      localStorage.setItem('uade_user', JSON.stringify(created))
      return created
    } catch (e) {
      console.error('register error', e)
      return null
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('uade_user')
  }

  const updateProfile = async (partial) => {
    try {
      if (!user?.id) return null
      const updated = await updateUser(user.id, partial)
      // json-server devuelve el objeto completo actualizado
      setUser(updated)
      localStorage.setItem('uade_user', JSON.stringify(updated))
      return updated
    } catch (e) {
      console.error('update profile error', e)
      return null
    }
  }

  return <AuthCtx.Provider value={{ user, login, logout, register, updateProfile }}>{children}</AuthCtx.Provider>
}
