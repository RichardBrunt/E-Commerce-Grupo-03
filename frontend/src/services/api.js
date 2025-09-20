import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000' })

// Products
export const listProducts = (params={}) => api.get('/products', { params }).then(r => r.data)
// Compatibilidad con json-server actual: usar query param ?id=
export const getProduct = async (id) => {
  const data = await api.get('/products', { params: { id } }).then(r => r.data)
  return Array.isArray(data) ? data[0] || null : data || null
}
export const createProduct = (data) => api.post('/products', data).then(r => r.data)
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data).then(r => r.data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// Categories
export const listCategories = () => api.get('/categories').then(r => r.data)
export const createCategory = (data) => api.post('/categories', data).then(r => r.data)

// Users (fake auth)
export const registerUser = (data) => api.post('/users', data).then(r => r.data)
export const loginUser = async ({ email, password }) => {
  const users = await api.get('/users', { params: { email, password }}).then(r => r.data)
  return users[0] || null
}
