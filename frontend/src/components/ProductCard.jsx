import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }){
  return (
    <article className="card">
      <img
        className="img"
        src={product.image}
        alt={product.name}
        style={{
          width: '100%',
          aspectRatio: '1/1',
          height: '220px',
          objectFit: 'cover',
          borderRadius: '10px',
          background: '#E0E0E0'
        }}
      />
      <h3>{product.name}</h3>
      <p>
      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
        .format(product.price)}
      </p>

      <p><span className="badge">{product.stock > 0 ? 'En stock' : 'Sin stock'}</span></p>
      <Link to={`/product/${product.id}`}>Ver detalle</Link>
    </article>
  )
}
