import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listProducts, listCategories, getProduct } from '@/services/api.js'
import { useFilters } from '@/contexts/FiltersContext.jsx'
import { useCart } from '@/contexts/CartContext.jsx'
import ProductCard from '@/components/ProductCard.jsx'
import '@/assets/Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { q, categoryId, order, setCategoryId, sortBy, setSortBy, setOrder } = useFilters()
  const { addItem } = useCart()
  const navigate = useNavigate()

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
    listProducts(params)
      .then((data) => {
        if (!query) return data
        const qn = normalize(query)
        return data.filter((p) => normalize(p.name).includes(qn))
      })
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [q, categoryId, order, sortBy])

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

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
      <section className="apple-hero-banner">
        <div className="apple-hero-content">
          <h1 className="apple-hero-title">MacBook Air M4</h1>
          <p className="apple-hero-desc">Potencia y portabilidad en su máxima expresión.</p>
          <div className="apple-hero-price-row">
            <span className="apple-hero-price">$1.499.999</span>
            <button className="apple-hero-btn-main" onClick={handleBuyNow}>Comprar Ahora</button>
          </div>
        </div>
        <div className="apple-hero-img-container">
          <img src="/img/banners/hero_intro_endframe__e6khcva4hkeq_large.jpg" alt="Macbook Banner" className="apple-hero-img" />
        </div>
      </section>

      {/* Scrollbar de categorías alineada con la grilla (columna derecha) */}
      <div className="apple-categories-container">
        <div className="apple-categories-spacer" />
        <div className="apple-categories-scroll">
          <button
            className="apple-category-btn"
            onClick={() => setCategoryId('')}
            style={{ fontWeight: !categoryId ? 700 : 500 }}
            aria-current={!categoryId ? 'true' : undefined}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className="apple-category-btn"
              onClick={() => setCategoryId(String(cat.id))}
              style={{ fontWeight: String(categoryId) === String(cat.id) ? 700 : 500 }}
              aria-current={String(categoryId) === String(cat.id) ? 'true' : undefined}
            >
              {cat.name}
            </button>
          ))}
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