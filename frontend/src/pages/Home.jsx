import React, { useEffect, useState } from 'react'
import { listProducts, listCategories } from '@/services/api.js'
import ProductCard from '@/components/ProductCard.jsx'
import CategoryFilter from '@/components/CategoryFilter.jsx'

export default function Home(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([]) // Este estado guardará TODOS los productos
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    // Solo se llama a la API UNA vez para obtener todos los productos y categorías
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          listCategories(),
          listProducts() // Ya no se pasan parámetros de búsqueda a la API
        ])
        setCategories(cats);
        setProducts(prods);
      } catch (e){
        setError('No se pudieron cargar datos');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []) // El array de dependencias vacío hace que se ejecute solo al montar el componente.

  // Se crea una lista de productos filtrados y ordenados en el frontend
  const filteredAndSortedProducts = products
    .filter(p => {
      // 1. Filtra por nombre (buscador)
      const matchesSearch = p.name.toLowerCase().includes(q.toLowerCase());
      // 2. Filtra por categoría
      const matchesCategory = categoryId ? p.categoryId === parseInt(categoryId) : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // 3. Ordena por nombre (ascendente/descendente)
      if (order === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <section>
      <header className="row">
        <input placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
        <CategoryFilter categories={categories} value={categoryId} onChange={setCategoryId} />
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </header>
      {filteredAndSortedProducts.length === 0 ? <p>Sin resultados</p> : (
        <div className="grid">
          {filteredAndSortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  )
}