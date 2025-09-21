import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, listProducts, listCategories } from "@/services/api.js";
import ProductCard from "@/components/ProductCard.jsx";
import { useCart } from "@/contexts/CartContext.jsx";
import "../assets/base.css";
import "../assets/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(prod => setProduct(prod))
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [id]);

  // Cargar productos relacionados cuando tenemos el producto
  useEffect(() => {
    if (!product?.categoryId) return;
    setRelatedLoading(true);
    listProducts({ categoryId: product.categoryId, _limit: 8 })
      .then(items => {
        const filtered = (items || []).filter(p => String(p.id) !== String(product.id));
        setRelated(filtered.slice(0, 4));
      })
      .finally(() => setRelatedLoading(false));
  }, [product]);

  // Obtener nombre de categoría para el subtítulo
  useEffect(() => {
    if (!product?.categoryId) return;
    listCategories()
      .then(cats => {
        const m = (cats || []).find(c => String(c.id) === String(product.categoryId));
        setCategoryName(m?.name || "");
      })
      .catch(() => setCategoryName(""));
  }, [product?.categoryId]);

  if (loading) return <div className="producto"><p>Cargando...</p></div>;
  if (error || !product) return <div className="producto"><p>{error || 'Producto no encontrado'}</p></div>;

  const resolveImage = (url) => {
    if (!url) return "/img/products/MacbookPro.jpg";
    if (typeof url === "string" && (url.startsWith("http") || url.startsWith("/img/"))) {
      return url;
    }
    // Si viene de /src/assets/... devolvemos un placeholder de /public/img existente
    return "/img/products/MacbookPro.jpg";
  };

  const images = (Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean))
    .map(resolveImage);

  // Resumen estilo Mercado Libre: selecciona puntos clave de specs
  const getHighlights = (prod) => {
    const specs = prod?.specs || {}
    const order = [
      'Número de puertos', // por si en algún producto existe
      'Pantalla',
      'Resolución',
      'Chipset',
      'Memoria RAM',
      'Almacenamiento',
      'Conectividad',
      'Cámara',
      'Batería',
      'Puertos',
      'Color',
    ]
    const list = []
    for (const key of order) {
      const val = specs[key]
      if (val && String(val).trim()) list.push(`${key}: ${val}`)
      if (list.length >= 4) break // mostrar 4 ítems destacados
    }
    return list
  }
  const highlights = getHighlights(product)

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100vh", padding: "2rem 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#FFFFFF", borderRadius: 16, padding: 32, boxShadow: "0 2px 16px #E0E0E0" }}>
        <div style={{ display: "flex", gap: 32 }}>
          {/* Galería lateral */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {images.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`Miniatura ${idx + 1}`}
                style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: idx === currentImageIndex ? "2px solid #FFD700" : "2px solid #E0E0E0", cursor: "pointer", background: "#FFF" }}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
          {/* Imagen principal y datos */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", gap: 32 }}>
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                style={{ width: 350, height: 350, objectFit: "contain", borderRadius: 12, background: "#E0E0E0", cursor: "pointer" }}
                onClick={() => setModalOpen(true)}
              />
              <div style={{ flex: 1, color: "#1A1A1A" }}>
                {/* Grid principal: izquierda (título, rating, precio, acciones) | derecha (highlights) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'start' }}>
                  <div>
                    <h1 style={{ fontSize: 36, margin: 0 }}>{product.name} <span style={{ fontSize: 24, color: "#FFD700" }}>&#9825;</span></h1>
                    <div style={{ fontSize: 18, margin: "8px 0" }}>
                      <span style={{ color: "#FFD700", fontWeight: 700 }}>{product.rating || 4.9}</span> <span style={{ color: "#FFD700" }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 700, margin: "16px 0", color: "#000000" }}>
                      {product.price ? `$${Number(product.price).toLocaleString()}` : ''}
                    </div>
                    <div>
                      <button
                        style={{
                          width: "100%",
                          background: "#000000",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 24,
                          padding: "16px 0",
                          borderRadius: 12,
                          border: 0,
                          marginBottom: 12,
                          cursor: "pointer",
                          transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = '#FFD700';
                          e.currentTarget.style.color = '#000000';
                          e.currentTarget.style.boxShadow = '0 2px 12px #FFD70055';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = '#000000';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => {
                          addItem(product, cantidad);
                          navigate('/cart');
                        }}
                      >
                        Comprar ahora
                      </button>
                      <button
                        style={{
                          width: "100%",
                          background: "#FFFFFF",
                          color: "#000000",
                          fontWeight: 500,
                          fontSize: 18,
                          padding: "12px 0",
                          borderRadius: 8,
                          border: "1px solid #E0E0E0",
                          marginBottom: 16,
                          cursor: "pointer",
                          transition: "background 0.2s, color 0.2s, border 0.2s",
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = '#E0E0E0';
                          e.currentTarget.style.color = '#1A1A1A';
                          e.currentTarget.style.border = '1px solid #FFD700';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.color = '#000000';
                          e.currentTarget.style.border = '1px solid #E0E0E0';
                        }}
                        onClick={() => addItem(product, cantidad)}
                      >
                        Agregar al carrito
                      </button>
                      <div style={{ color: product.stock > 0 ? "#1A1A1A" : "#FF3B3B", fontWeight: 700, marginBottom: 8 }}>
                        {product.stock > 0 ? `Stock disponible (${product.stock})` : "Sin stock"}
                      </div>
                      {/* Cantidad */}
                      <div style={{ marginBottom: 16 }}>
                        <select
                          style={{ padding: 8, borderRadius: 6, background: "#FFF", color: "#1A1A1A", border: "1px solid #E0E0E0" }}
                          value={cantidad}
                          onChange={e => setCantidad(Number(e.target.value))}
                        >
                          {[1,2,3,4,5,6].map(n => (
                            <option key={n} value={n}>{`${n} unidad${n>1?"es":""}`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Envío */}
                    <div style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span role="img" aria-label="camión de envío" style={{ fontSize: 20 }}>🚚</span>
                        <span style={{ fontSize: 18, color: '#1A1A1A', fontWeight: 700 }}>Costo de envío:</span>
                        <span style={{ fontSize: 18, color: '#00A650', fontWeight: 700 }}>Gratis</span>
                      </div>
                      <p style={{ margin: '8px 0 0', color: '#666' }}>Envío a todo el país</p>
                    </div>
                    {highlights.length > 0 && (
                      <div style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 12, padding: 16 }}>
                        <h3 style={{ margin: 0, color: '#1A1A1A', fontSize: 20, marginBottom: 8 }}>Lo que tenés que saber de este producto</h3>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#333333', fontSize: 16, lineHeight: 1.35, listStyleType: 'disc', listStylePosition: 'outside' }}>
                          {highlights.map(item => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Especificaciones */}
            <div style={{ background: "#F5F5F5", borderRadius: 12, padding: 24, marginTop: 24 }}>
              <h2 style={{ color: "#1A1A1A", fontSize: 28, marginBottom: 16 }}>Especificaciones</h2>
              <table style={{ width: "100%", color: "#333333", fontSize: 18, borderCollapse: "collapse" }}>
                <tbody>
                  {product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: "1px solid #E0E0E0" }}>
                      <td style={{ fontWeight: 700, padding: "8px 0", width: 220 }}>{key}:</td>
                      <td style={{ padding: "8px 0" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Relacionados */}
        {(relatedLoading || (related && related.length > 0)) && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ color: "#1A1A1A", fontSize: 28, marginBottom: 8 }}>
              Productos relacionados {categoryName ? <span style={{ color: '#666', fontSize: 22 }}>· Más de {categoryName}</span> : null}
            </h2>
            {relatedLoading && (
              <p style={{ color: '#666', marginBottom: 12 }}>Cargando relacionados...</p>
            )}
            <div style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
            }}>
              {related.map(r => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        )}
        {/* Modal de imagen */}
        {modalOpen && images.length > 0 && (
          <div
            id="imageModal"
            className="image-modal"
            style={{ display: "flex", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#000A", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
            onClick={() => setModalOpen(false)}
          >
            <img
              className="modal-image"
              id="modalImage"
              src={images[currentImageIndex]}
              alt="Imagen ampliada"
              style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: 16, boxShadow: "0 2px 16px #E0E0E0" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}