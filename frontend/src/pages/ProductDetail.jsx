import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listProducts } from "@/services/api.js";
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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const paymentRef = useRef(null);

  // Cerrar el menú de métodos de pago al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (paymentRef.current && !paymentRef.current.contains(e.target)) {
        setPaymentOpen(false);
      }
    }
    if (paymentOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [paymentOpen]);

  useEffect(() => {
    setLoading(true);
    listProducts({ id })
      .then(arr => setProduct(arr && arr[0] ? arr[0] : null))
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="producto"><p>Cargando...</p></div>;
  if (error || !product) return <div className="producto"><p>{error || 'Producto no encontrado'}</p></div>;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);

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
                <h1 style={{ fontSize: 36, margin: 0 }}>{product.name} <span style={{ fontSize: 24, color: "#FFD700" }}>&#9825;</span></h1>
                <div style={{ fontSize: 18, margin: "8px 0" }}>
                  <span style={{ color: "#FFD700", fontWeight: 700 }}>{product.rating || 4.9}</span> <span style={{ color: "#FFD700" }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                </div>
                <div style={{ fontSize: 36, fontWeight: 700, margin: "16px 0", color: "#000000" }}>
                  {product.price ? `$${Number(product.price).toLocaleString()}` : ''}
                </div>
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
                  {product.stock > 0 ? "Stock disponible" : "Sin stock"}
                </div>
                {/* Cantidad y método de pago (placeholder) */}
                <div style={{ marginBottom: 16 }}>
                  <select
                    style={{ padding: 8, borderRadius: 6, background: "#FFF", color: "#1A1A1A", border: "1px solid #E0E0E0" }}
                    value={cantidad}
                    onChange={e => setCantidad(Number(e.target.value))}
                  >
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{`Cantidad: ${n} unidad${n>1?"es":""}`}</option>)}
                  </select>
                </div>
                <div
                  ref={paymentRef}
                  style={{
                    color: "#333333",
                    fontSize: 15,
                    border: "1px solid #E0E0E0",
                    borderRadius: 8,
                    padding: 12,
                    textAlign: "center",
                    position: "relative",
                    background: paymentOpen ? "#FFF" : undefined,
                    cursor: "pointer"
                  }}
                  onClick={() => setPaymentOpen((v) => !v)}
                >
                  {selectedPayment ? (
                    <span style={{ fontWeight: 600 }}>
                      {selectedPayment}
                    </span>
                  ) : (
                    "Seleccionar método de pago"
                  )}
                  {paymentOpen && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "100%",
                        background: "#FFF",
                        border: "1px solid #E0E0E0",
                        borderRadius: 8,
                        marginTop: 4,
                        zIndex: 10,
                        boxShadow: "0 2px 8px #0001"
                      }}
                    >
                      {['Visa', 'Mastercard', 'American Express', 'Naranja', 'Cabal'].map((card) => (
                        <div
                          key={card}
                          style={{
                            padding: 10,
                            cursor: "pointer",
                            borderBottom: "1px solid #E0E0E0",
                            color: "#1A1A1A",
                            fontWeight: 500,
                            background: selectedPayment === card ? "#FFD70022" : "#FFF"
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedPayment(card);
                            setPaymentOpen(false);
                          }}
                          onMouseOver={e => e.currentTarget.style.background = '#FFD70033'}
                          onMouseOut={e => e.currentTarget.style.background = selectedPayment === card ? '#FFD70022' : '#FFF'}
                        >
                          {card}
                        </div>
                      ))}
                    </div>
                  )}
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