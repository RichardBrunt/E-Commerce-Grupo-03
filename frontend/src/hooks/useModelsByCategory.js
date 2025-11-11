import { useEffect, useRef, useState } from 'react'
import { listModelsByCategory } from '@/services/api.js'

// Cache por categoría en memoria + localStorage con TTL
// Estructura: { [categoryId]: { at: number, list: [] } }
let memoryCache = {}
const LS_KEY = 'models_cache_v1'
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos

export function useModelsByCategory(categoryId, { ttlMs } = {}) {
  const ttl = typeof ttlMs === 'number'
    ? ttlMs
    : (import.meta?.env?.VITE_MODELS_CACHE_TTL_MS ? Number(import.meta.env.VITE_MODELS_CACHE_TTL_MS) : DEFAULT_TTL)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef({ aborted: false })

  const readLs = () => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return {}
      const parsed = JSON.parse(raw)
      return typeof parsed === 'object' && parsed ? parsed : {}
    } catch (_) { return {} }
  }
  const writeLs = (obj) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(obj)) } catch (_) { /* ignore */ }
  }

  const loadFromCache = (cid) => {
    if (!cid) return null
    const now = Date.now()
    // memoria primero
    const mem = memoryCache?.[cid]
    if (mem && (now - mem.at) < ttl && Array.isArray(mem.list)) return mem.list
    // localStorage
    const all = readLs()
    const item = all?.[cid]
    if (item && (now - item.at) < ttl && Array.isArray(item.list)) {
      // sincronizar memoria
      memoryCache[cid] = { at: item.at, list: item.list }
      return item.list
    }
    return null
  }

  const saveCache = (cid, list) => {
    if (!cid) return
    const at = Date.now()
    memoryCache[cid] = { at, list }
    const all = readLs()
    all[cid] = { at, list }
    writeLs(all)
  }

  const fetchModels = async ({ force = false } = {}) => {
    if (!categoryId) { setData([]); return [] }
    if (!force) {
      const cached = loadFromCache(String(categoryId))
      if (cached) {
        setData(cached)
        return cached
      }
    }
    setIsLoading(true)
    setError(null)
    try {
      const list = await listModelsByCategory(categoryId)
      if (!abortRef.current.aborted) {
        setData(list)
        saveCache(String(categoryId), list)
      }
      return list
    } catch (err) {
      if (!abortRef.current.aborted) setError(err || new Error('Error al cargar modelos'))
      return null
    } finally {
      if (!abortRef.current.aborted) setIsLoading(false)
    }
  }

  useEffect(() => {
    abortRef.current.aborted = false
    // reset cuando cambia categoría
    if (!categoryId) {
      setData([])
      return () => { abortRef.current.aborted = true }
    }
    // Stale-while-revalidate: mostrar caché y SIEMPRE revalidar
    const cached = loadFromCache(String(categoryId))
    if (cached) setData(cached)
    fetchModels({ force: true })
    return () => { abortRef.current.aborted = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, ttl])

  return { data, isLoading, error, refresh: () => fetchModels({ force: true }) }
}

export default useModelsByCategory
