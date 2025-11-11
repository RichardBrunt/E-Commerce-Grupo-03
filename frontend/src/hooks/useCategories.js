import { useEffect, useRef, useState } from 'react'
import { listCategories } from '@/services/api.js'

// Cache simple en memoria + localStorage con TTL
let memoryCache = null
let memoryCacheAt = 0

const LS_KEY = 'categories_cache_v1'
const LS_AT_KEY = 'categories_cache_at_v1'
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos

export function useCategories({ ttlMs } = {}) {
  const ttl = typeof ttlMs === 'number' ? ttlMs : (import.meta?.env?.VITE_CATEGORIES_CACHE_TTL_MS ? Number(import.meta.env.VITE_CATEGORIES_CACHE_TTL_MS) : DEFAULT_TTL)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef({ aborted: false })

  const loadFromCache = () => {
    // Memoria primero
    const now = Date.now()
    if (Array.isArray(memoryCache) && (now - memoryCacheAt) < ttl) {
      return memoryCache
    }
    // localStorage
    try {
      const raw = localStorage.getItem(LS_KEY)
      const at = Number(localStorage.getItem(LS_AT_KEY) || 0)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && (now - at) < ttl) {
          // sincronizar memoria
          memoryCache = parsed
          memoryCacheAt = at
          return parsed
        }
      }
    } catch (_) { /* ignore */ }
    return null
  }

  const saveCache = (list) => {
    try {
      memoryCache = list
      memoryCacheAt = Date.now()
      localStorage.setItem(LS_KEY, JSON.stringify(list))
      localStorage.setItem(LS_AT_KEY, String(memoryCacheAt))
    } catch (_) { /* ignore */ }
  }

  const fetchCategories = async ({ force = false } = {}) => {
    if (!force) {
      const cached = loadFromCache()
      if (cached) {
        setData(cached)
        return cached
      }
    }
    setIsLoading(true)
    setError(null)
    try {
      const list = await listCategories()
      if (!abortRef.current.aborted) {
        setData(list)
        saveCache(list)
      }
      return list
    } catch (err) {
      if (!abortRef.current.aborted) setError(err || new Error('Error al cargar categorías'))
      return null
    } finally {
      if (!abortRef.current.aborted) setIsLoading(false)
    }
  }

  useEffect(() => {
    abortRef.current.aborted = false
    // Stale-while-revalidate: mostrar caché si existe y SIEMPRE revalidar en background
    const cached = loadFromCache()
    if (cached) setData(cached)
    fetchCategories({ force: true })
    return () => { abortRef.current.aborted = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttl])

  return { data, isLoading, error, refresh: () => fetchCategories({ force: true }) }
}

export default useCategories
