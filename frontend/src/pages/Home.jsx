import React, { useEffect, useState } from 'react'
import { listProducts, listCategories } from '@/services/api.js'
import { useFilters } from '@/contexts/FiltersContext.jsx'
import ProductCard from '@/components/ProductCard.jsx'
import '@/assets/Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { q, categoryId, order, setCategoryId, sortBy, setSortBy, setOrder } = useFilters()

  useEffect(() => {
    setLoading(true)
    const params = { _sort: sortBy || 'name', _order: order }
    if (q) params.q = q
    if (categoryId) params.categoryId = Number(categoryId)
    listProducts(params).then(setProducts).finally(() => setLoading(false))
  }, [q, categoryId, order, sortBy])

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  return (
    <section className="apple-section">
      <section className="apple-hero-banner">
        <div className="apple-hero-content">
          <h1 className="apple-hero-title">MacBook Air M2</h1>
          <p className="apple-hero-desc">Potencia y portabilidad en su máxima expresión.</p>
          <div className="apple-hero-price-row">
            <span className="apple-hero-price">$1.499.999</span>
            <button className="apple-hero-btn-main">Comprar Ahora</button>
          </div>
        </div>
        <div className="apple-hero-img-container">
          <img src="/img/banners/hero_intro_endframe__e6khcva4hkeq_large.jpg" alt="Macbook Banner" className="apple-hero-img" />
        </div>
      </section>

      {/* Scrollbar de categorías */}
      <div className="apple-categories-scroll" style={{ marginBottom: 8, alignItems: 'center' }}>
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