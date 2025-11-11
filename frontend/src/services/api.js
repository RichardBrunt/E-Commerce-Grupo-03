import axios from 'axios'

// Base URL configurable (backend real por defecto)
const baseURL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8080'
const TOKEN_KEY = 'uade_jwt'

const api = axios.create({ baseURL })

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}
export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  delete api.defaults.headers.common['Authorization']
}

const existing = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
if (existing) api.defaults.headers.common['Authorization'] = `Bearer ${existing}`

// Mappers
const mapProduct = (p) => ({
  id: p.idProducto,
  name: p.nombreProducto,
  description: p.descripcion,
  price: p.precio,
  stock: p.stock,
  categoryId: p.categoriaId,
  modelId: p.modeloId,
  image: p.imagenUrl,
})
const mapCategory = (c) => ({ id: c.idCategoria, name: c.nombreCategoria })
const mapModel = (m) => ({ id: m.idModelo, name: m.nombreModelo, categoryId: m.categoriaId })

// Products (backend real)
export const listProducts = async (params={}) => {
  const query = {
    categoriaId: params.categoryId || undefined,
    modeloId: params.modelId || undefined,
    page: params.page ?? 0,
    size: params.size ?? 40,
  }
  const r = await api.get('/api/productos', { params: query })
  const content = r.data?.content ?? r.data
  return (content || []).map(mapProduct)
}
export const getProduct = async (id) => {
  const r = await api.get(`/api/productos/${id}`)
  return mapProduct(r.data)
}
export const createProduct = async (data) => {
  const payload = {
    nombreProducto: data.name,
    descripcion: data.description,
    precio: Number(data.price),
    stock: Number(data.stock),
    categoriaId: data.categoryId ? Number(data.categoryId) : undefined,
    modeloId: data.modelId ? Number(data.modelId) : undefined,
    imagenUrl: data.image || undefined,
  }
  const r = await api.post('/api/productos', payload)
  return mapProduct(r.data)
}
export const updateProduct = async (id, data) => {
  const payload = {
    nombreProducto: data.name,
    descripcion: data.description,
    precio: Number(data.price),
    stock: Number(data.stock),
    categoriaId: data.categoryId ? Number(data.categoryId) : undefined,
    modeloId: data.modelId ? Number(data.modelId) : undefined,
    imagenUrl: data.image || undefined,
  }
  const r = await api.put(`/api/productos/${id}`, payload)
  return mapProduct(r.data)
}
export const deleteProduct = (id) => api.delete(`/api/productos/${id}`)

// Categorías y Modelos
export const listCategories = async () => {
  const r = await api.get('/api/categorias')
  return (r.data || []).map(mapCategory)
}
export const createCategory = async ({ name }) => {
  const payload = { nombreCategoria: name }
  const r = await api.post('/api/categorias', payload)
  return mapCategory(r.data)
}
export const listModelsByCategory = async (categoryId) => {
  if (!categoryId) return []
  const r = await api.get(`/api/categorias/${categoryId}/modelos`)
  return (r.data || []).map(mapModel)
}
export const createModel = async (categoryId, { name }) => {
  const payload = { nombreModelo: name }
  const r = await api.post(`/api/categorias/${categoryId}/modelos`, payload)
  return mapModel(r.data)
}
export const deleteModel = async (categoryId, modelId) => {
  if (!categoryId || !modelId) throw new Error('categoryId y modelId son requeridos')
  await api.delete(`/api/categorias/${categoryId}/modelos/${modelId}`)
  return true
}

// Auth + Usuario actual
export const loginUser = async ({ email, password }) => {
  const r = await api.post('/api/auth/login', { email, password })
  const token = r.data?.token
  if (!token) throw new Error('Token no recibido')
  setAuthToken(token)
  return getMe()
}
export const registerUser = async ({ nombre, email, password }) => {
  const r = await api.post('/api/auth/register', { nombre, email, password })
  const token = r.data?.token
  if (!token) throw new Error('Token no recibido')
  setAuthToken(token)
  return getMe()
}
export const getMe = async () => {
  const r = await api.get('/api/users/me')
  const u = r.data || {}
  // Backend devuelve: { idUsuario, nombre, apellido, usuario, email, avatar }
  return {
    id: u.idUsuario ?? u.id ?? null,
    nombre: u.nombre,
    apellido: u.apellido,
    usuario: u.usuario,
    email: u.email,
    avatar: u.avatar,
  }
}
export const updateMe = async (partial = {}) => {
  // Enviar solo campos provistos
  const payload = {}
  if (typeof partial.nombre === 'string') payload.nombre = partial.nombre
  if (typeof partial.apellido === 'string') payload.apellido = partial.apellido
  if (typeof partial.usuario === 'string') payload.usuario = partial.usuario
  if (typeof partial.email === 'string') payload.email = partial.email
  if (typeof partial.avatar === 'string') payload.avatar = partial.avatar
  if (Object.keys(payload).length === 0) return getMe()
  const r = await api.put('/api/users/me', payload)
  const u = r.data || {}
  return {
    id: u.idUsuario ?? u.id ?? null,
    nombre: u.nombre,
    apellido: u.apellido,
    usuario: u.usuario,
    email: u.email,
    avatar: u.avatar,
  }
}

export default api
