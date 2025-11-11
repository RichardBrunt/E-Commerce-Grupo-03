// Cart.jsx
// Uso de useState, useEffect, useContext, useNavigate, renderizado condicional y validaciones básicas
import React, { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import '@/assets/Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, total, removeItem, clear, updateQuantity } = useCart()
  // selección de items (estilo ML)
  const [selected, setSelected] = useState(() => new Set(items.map(i => i.id)))
  useEffect(() => { setSelected(new Set(items.map(i => i.id))) }, [items])
  const allSelected = selected.size === items.length && items.length > 0
  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(items.map(i => i.id)))
  }
  const toggleItem = (id) => {
    setSelected(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  }

  // Estado del modal de pago y del paso de confirmación
  const [showCheckout, setShowCheckout] = useState(false)
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false)

  // Estado controlado del formulario
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  })

  // Si intenta pagar y no hay usuario, redirige a /login
  useEffect(() => {
    if (showCheckout && !user) navigate('/login')
  }, [showCheckout, user, navigate])

  // Formateo liviano para MM/AA
  const formatInput = (name, value) => {
    if (name === 'expiration') {
      let v = value.replace(/\D/g, '')
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4)
      return v
    }
    return value
  }

  // Validaciones básicas
  const validateInput = (name, value) => {
    switch (name) {
      case 'name':
        return /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]*$/.test(value) ? value : null
      case 'cardNumber':
        return /^\d{0,16}$/.test(value) ? value : null
      case 'expiration':
        return /^(\d{0,2}\/?\d{0,2})$/.test(value) ? value : null
      case 'cvv':
        return /^\d{0,4}$/.test(value) ? value : null
      default:
        return value
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const formatted = formatInput(name, value)
    const validated = validateInput(name, formatted)
    if (validated !== null) {
      setPaymentInfo(prev => ({ ...prev, [name]: validated }))
    }
  }

  // Validación completa antes de enviar
  const validateForm = () => {
    const errors = []

    if (!paymentInfo.name.trim()) {
      errors.push('El nombre es obligatorio')
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(paymentInfo.name)) {
      errors.push('El nombre solo debe contener letras y espacios')
    }

    if (!/^\d{16}$/.test(paymentInfo.cardNumber)) {
      errors.push('El número de tarjeta debe tener 16 dígitos')
    }

    if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiration)) {
      errors.push('La fecha debe tener formato MM/AA')
    } else {
      const [mm, yy] = paymentInfo.expiration.split('/')
      const m = parseInt(mm, 10)
      const y = parseInt(yy, 10)
      const currentYY = new Date().getFullYear() % 100
      if (m < 1 || m > 12) errors.push('El mes debe estar entre 01 y 12')
      if (y < currentYY) errors.push('La tarjeta está vencida')
    }

    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.push('El CVV debe tener 3 o 4 dígitos')
    }

    return errors
  }

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    const errors = validateForm()
    if (errors.length) {
      alert('Por favor corrija:\n- ' + errors.join('\n- '))
      return
    }
    setShowFinalConfirmation(true)
  }

  const confirmPayment = () => {
    alert('¡Pago realizado con éxito!')
    clear()
    setPaymentInfo({ name: '', cardNumber: '', expiration: '', cvv: '' })
    setShowFinalConfirmation(false)
    setShowCheckout(false)
    navigate('/')
  }

  const cancelFinalConfirmation = () => setShowFinalConfirmation(false)

  // Si el carrito está vacío
  if (!items.length) {
    return (
      <section className="cart-page">
        <div className="cart-empty">
          <img src="/img/banners/hero_intro_endframe__e6khcva4hkeq_large.jpg" alt="Carrito vacío" />
          <div>
            <h2>Tu carrito está vacío</h2>
            <p>¿Buscás algo? Explorá la tienda y encontrá lo que necesitás.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Ir al inicio</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      {/* Banner estilo Home con mensaje de agradecimiento */}
      <div className="cart-hero-banner" role="img" aria-label="Gracias por tu compra">
        <div className="cart-hero-content">
          <h1 className="cart-hero-title">¡Gracias por tu compra!</h1>
          <p className="cart-hero-desc">Tu pedido está en proceso. Te avisaremos cuando se envíe.</p>
        </div>
        <div className="cart-hero-img-container">
          <img
            className="cart-hero-img"
            src="/img/banners/hero_intro_endframe__e6khcva4hkeq_large.jpg"
            alt="Banner de compra confirmada"
          />
        </div>
      </div>
      <div className="cart-grid">
        <div className="cart-items">
          <div className="cart-group">
            <div className="cart-group-header">
              <label className="checkbox">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                <span className="cart-group-title">Productos del carrito <span aria-hidden>›</span></span>
              </label>
            </div>
            {items.map(i => (
            <article className="cart-item" key={i.id}>
              <label className="checkbox item-check">
                <input type="checkbox" checked={selected.has(i.id)} onChange={() => toggleItem(i.id)} />
              </label>
              <img className="cart-item-img" src={i.image} alt={i.name} />
              <div className="cart-item-body">
                <h3 className="cart-item-name">{i.name}</h3>
                <div className="cart-item-meta">
                  <span className="cart-item-unit">${i.price.toLocaleString()} c/u</span>
                  <span className="cart-item-stock">En stock</span>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control" aria-label="Cantidad">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(i.id, i.qty - 1)}
                      disabled={i.qty === 1}
                      aria-label="Disminuir"
                    >−</button>
                    <span className="qty-value" aria-live="polite">{i.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(i.id, i.qty + 1)}
                      aria-label="Aumentar"
                    >＋</button>
                  </div>
                  <button className="link-danger" onClick={() => removeItem(i.id)}>Eliminar</button>
                </div>
                {(typeof i.stock === 'number' && i.stock - i.qty <= 1) && (
                  <div className="cart-item-note">Último disponible</div>
                )}
              </div>
              <div className="cart-item-price">
                <span className="price">${(i.price * i.qty).toLocaleString()}</span>
              </div>
            </article>
          ))}
          </div>
        </div>

        <aside className="cart-summary" aria-label="Resumen de compra">
          <h2 className="summary-title">Resumen de compra</h2>
          <div className="summary-row">
            <span>Subtotal ({items.reduce((a, i) => a + i.qty, 0)} productos)</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Envío</span>
            <span>Calculado al finalizar</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button className="btn-primary btn-block" onClick={() => setShowCheckout(true)}>Continuar compra</button>
          <button className="btn-ghost btn-block" onClick={clear}>Vaciar carrito</button>
        </aside>
      </div>

      {showCheckout && (
        <div className="checkout-overlay" role="dialog" aria-modal="true">
          <div className="checkout-card">
            <h2>Información de pago</h2>
            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="name" value={paymentInfo.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Número de tarjeta</label>
                <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Vencimiento (MM/AA)</label>
                  <input type="text" name="expiration" placeholder="MM/AA" value={paymentInfo.expiration} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Confirmar pago</button>
                <button type="button" className="btn-ghost" onClick={() => setShowCheckout(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFinalConfirmation && (
        <div className="checkout-overlay" role="dialog" aria-modal="true">
          <div className="checkout-card">
            <h2>¡Estás a un paso de realizar tu compra!</h2>
            <p className="checkout-subtext">Revisá los datos y confirmá para finalizar tu pedido.</p>
            <div className="form-actions">
              <button className="btn-primary" onClick={confirmPayment}>Confirmar compra</button>
              <button className="btn-ghost" onClick={cancelFinalConfirmation}>Volver</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
