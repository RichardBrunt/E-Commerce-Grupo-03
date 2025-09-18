// Cart.jsx
// Uso de useState, useEffect, useContext, useNavigate, renderizado condicional y validaciones básicas
import React, { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, total, removeItem, clear, updateQuantity } = useCart()

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
  if (!items.length) return <p>Tu carrito está vacío.</p>

  return (
    <section className="cart-container">
      <h1>Carrito de Compras</h1>

      {items.map(i => (
        <article className="card" key={i.id}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="row">
              <img
                className="img"
                src={i.image}
                alt={i.name}
                style={{ width: 100, height: 100 }}
              />
              <div>
                <h3>{i.name}</h3>
                <p>Precio unitario: ${i.price.toLocaleString()}</p>
                <div className="quantity-controls">
                  <button
                    className="qty-button"
                    onClick={() => updateQuantity(i.id, i.qty - 1)}
                    disabled={i.qty === 1}
                  >
                    -
                  </button>
                  <span className="item-quantity">{i.qty}</span>
                  <button
                    className="qty-button"
                    onClick={() => updateQuantity(i.id, i.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button className="remove-button" onClick={() => removeItem(i.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}

      <div className="cart-summary">
        <p><b>Total: ${total.toLocaleString()}</b></p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={clear} className="clear-cart-button">Vaciar carrito</button>
          <button className="checkout-button" onClick={() => setShowCheckout(true)}>
            Pagar
          </button>
        </div>
      </div>

      {showCheckout && (
        <div className="checkout-modal">
          <h2>Información de Pago</h2>
          <form onSubmit={handleCheckoutSubmit} className="checkout-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" name="name" value={paymentInfo.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Número de Tarjeta:</label>
              <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Fecha de Expiración (MM/AA):</label>
              <input type="text" name="expiration" placeholder="MM/AA" value={paymentInfo.expiration} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>CVV:</label>
              <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handleInputChange} required />
            </div>
            <div className="form-actions">
              <button type="submit">Confirmar Pago</button>
              <button type="button" onClick={() => setShowCheckout(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {showFinalConfirmation && (
        <div className="final-confirmation">
          <p>Para confirmar la compra haga click en confirmar</p>
          <div className="confirmation-actions">
            <button onClick={confirmPayment}>Confirmar</button>
            <button onClick={cancelFinalConfirmation}>Cancelar</button>
          </div>
        </div>
      )}
    </section>
  )
}
