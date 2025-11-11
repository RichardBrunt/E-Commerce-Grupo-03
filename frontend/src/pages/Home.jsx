import React, { useEffect, useState } from 'react'
import Banners from '@/components/Banners.jsx'
import { useNavigate } from 'react-router-dom'
import { listProducts, listCategories, getProduct } from '@/services/api.js'
import { useFilters } from '@/contexts/FiltersContext.jsx'
import { useCart } from '@/contexts/CartContext.jsx'
import ProductCard from '@/components/ProductCard.jsx'
import '@/assets/Home.css'
import useModelsByCategory from '@/hooks/useModelsByCategory.js'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedModelId, setSelectedModelId] = useState('')
  const { q, categoryId, order, setCategoryId, sortBy, setSortBy, setOrder } = useFilters()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const { data: models } = useModelsByCategory(categoryId)

  const normalize = (str) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar acentos
      .replace(/\s+/g, '') // quitar espacios
      .trim()

  useEffect(() => {
    setLoading(true)
    const params = { _sort: sortBy || 'name', _order: order }
    const query = (q || '').trim()
    if (query) params.name_like = query // hint al server, pero no dependemos 100% de esto
    if (categoryId) params.categoryId = Number(categoryId)
    if (selectedModelId) params.modelId = Number(selectedModelId)
    listProducts(params)
      .then((data) => {
        if (!query) return data
        const qn = normalize(query)
        return data.filter((p) => normalize(p.name).includes(qn))
      })
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [q, categoryId, selectedModelId, order, sortBy])

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  // Reset del modelo cuando cambia la categoría seleccionada
  useEffect(() => {
    setSelectedModelId('')
  }, [categoryId])

  const handleBuyNow = async () => {
    try {
      const prod = await getProduct('3')
      if (prod) {
        addItem(prod, 1)
        navigate('/cart')
      }
    } catch (_) {
      // fail-silent
    }
  }

  return (
    <section className="apple-section">
      <Banners categoryId={categoryId || '1'} onBuy={handleBuyNow} />

      {/* Scrollbar de modelos alineada con la grilla (columna derecha) */}
      <div className="apple-categories-container">
        <div className="apple-categories-spacer" />
        <div className="apple-categories-scroll">
          {categoryId ? (
            <>
              <button
                className="apple-category-btn"
                onClick={() => setSelectedModelId('')}
                style={{ fontWeight: !selectedModelId ? 700 : 500 }}
                aria-current={!selectedModelId ? 'true' : undefined}
              >
                Todos los modelos
              </button>
              {models.length === 0 && (
                <span className="apple-category-btn" aria-disabled="true">Sin modelos</span>
              )}
              {models.map(m => (
                <button
                  key={m.id}
                  className="apple-category-btn"
                  onClick={() => setSelectedModelId(String(m.id))}
                  style={{ fontWeight: String(selectedModelId) === String(m.id) ? 700 : 500 }}
                  aria-current={String(selectedModelId) === String(m.id) ? 'true' : undefined}
                >
                  {m.name}
                </button>
              ))}
            </>
          ) : (
            <>
              <span className="apple-category-btn" aria-disabled="true">Seleccione una categoría</span>
              {/* opcional: seguir mostrando categorías aquí si lo preferís */}
            </>
          )}
        </div>
      </div>

      {/* Contenido con sidebar izquierda para ordenación y grilla a la derecha */}
      <div className="apple-content">
        <aside className="apple-sort-sidebar" aria-label="Opciones de orden">
          <div className="apple-sort-group">
            <label htmlFor="sortby-select" className="apple-sort-label">Ordenar por:</label>
            <select id="sortby-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="apple-sort-select">
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
            </select>
          </div>
          <div className="apple-sort-group">
            <label htmlFor="order-select" className="apple-sort-label">Dirección:</label>
            <select id="order-select" value={order} onChange={(e) => setOrder(e.target.value)} className="apple-sort-select">
              <option value="asc">A-Z / Menor</option>
              <option value="desc">Z-A / Mayor</option>
            </select>
          </div>
        </aside>

        <div className="apple-products-grid">
          {loading ? <p>Cargando productos...</p> : products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  )
}