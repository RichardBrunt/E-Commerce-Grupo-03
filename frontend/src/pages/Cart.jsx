// Cart.jsx
// Ejemplo de uso de hooks (useState, useContext), renderizado condicional, SPA, validación de datos
import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Cart(){
  // useContext para acceder al estado global del carrito y usuario
  const { items, total, removeItem, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate() // SPA: navegación sin recargar la página
  // useState para manejar el estado local del modal de pago y los datos del formulario
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState({ name: '', cardNumber: '', expiration: '', cvv: '' })

  // Manejo de inputs controlados
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentInfo(prev => ({ ...prev, [name]: value }))
  }

  // Validación y manejo de submit del pago
  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    // Validación básica (podrías agregar más lógica)
    alert('Pago realizado con éxito')
    setShowCheckout(false)
    setPaymentInfo({ name: '', cardNumber: '', expiration: '', cvv: '' })
  }

  // Renderizado condicional: si el carrito está vacío
  if (!items.length) return <p>Tu carrito está vacío.</p>
  return (
    <section>
      {/* Renderizado de lista con .map() */}
      {items.map(i => (
        <article className="card" key={i.id}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div className="row">
              <img className="img" src={i.image} alt={i.name} style={{width:100, height:100}}/>
              <div>
                <h3>{i.name}</h3>
                <p>Cantidad: {i.qty}</p>
              </div>
            </div>
            <button onClick={()=>removeItem(i.id)}>Eliminar</button>
          </div>
        </article>
      ))}
      <p><b>Total: ${total.toLocaleString()}</b></p>
      <button onClick={clear}>Vaciar carrito</button>
      <button onClick={()=>alert('Checkout simulado. Descuento de stock se realiza en backend/mock.')}>Checkout</button>
      {/* Renderizado condicional: si el usuario está logueado muestra el modal de pago, si no redirige a login */}
      <button onClick={() => {
        if (!user) {
          navigate('/login')
        } else {
          setShowCheckout(true)
        }
      }}>Pagar</button>
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
    </section>
  )
}
