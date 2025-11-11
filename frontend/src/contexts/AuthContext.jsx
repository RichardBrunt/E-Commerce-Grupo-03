import React, { createContext, useContext, useEffect, useState } from 'react'
import { registerUser, loginUser, updateMe, setAuthToken, clearAuthToken } from '@/services/api.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('uade_user')
    const token = localStorage.getItem('uade_jwt')
    if (token) setAuthToken(token)
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = async (email, password) => {
    try {
      const me = await loginUser({ email, password })
      if (!me) return null
      setUser(me)
      localStorage.setItem('uade_user', JSON.stringify(me))
      return me
    } catch (e) {
      console.error('login error', e)
      return null
    }
  }

  const register = async (payload) => {
    try {
      const { confirm, ...data } = payload || {}
      const me = await registerUser(data)
      setUser(me)
      localStorage.setItem('uade_user', JSON.stringify(me))
      return me
    } catch (e) {
      console.error('register error', e)
      return null
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('uade_user')
    clearAuthToken()
  }

  const updateProfile = async (partial) => {
    try {
      const serverUser = await updateMe(partial)
      const base = serverUser || {}
      const next = {
        id: base.id ?? user?.id ?? null,
        nombre: base?.nombre ?? partial?.nombre ?? user?.nombre ?? '',
        email: base?.email ?? partial?.email ?? user?.email ?? '',
        usuario: base?.usuario ?? partial?.usuario ?? user?.usuario ?? '',
        apellido: base?.apellido ?? partial?.apellido ?? user?.apellido ?? '',
        avatar: base?.avatar ?? partial?.avatar ?? user?.avatar ?? '',
        role: user?.role,
      }
      setUser(next)
      localStorage.setItem('uade_user', JSON.stringify(next))
      return { user: next }
    } catch (e) {
      console.error('update profile error', e)
      const message = e?.response?.data?.error || e?.message || 'No se pudo guardar'
      return { error: message, status: e?.response?.status }
    }
  }

  return <AuthCtx.Provider value={{ user, login, logout, register, updateProfile }}>{children}</AuthCtx.Provider>
}
