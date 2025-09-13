import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext.jsx';

export default function Cart() {
  const { items, total, removeItem, clear, updateQuantity } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    // Instead of processing the payment directly, show final confirmation
    setShowFinalConfirmation(true);
  };

  const confirmPayment = () => {
    alert('Pago realizado con éxito');
    setShowFinalConfirmation(false);
    setShowCheckout(false);
    // Optionally clear cart or payment info
    setPaymentInfo({ name: '', cardNumber: '', expiration: '', cvv: '' });
  };

  const cancelFinalConfirmation = () => {
    setShowFinalConfirmation(false);
  };

  if (!items.length) return <p>Tu carrito está vacío.</p>;
  return (
    <section className="cart-container">
      <h1>Carrito de Compras</h1>
      {items.map((i) => (
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
                <p>Cantidad: {i.qty}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(i.id, i.qty - 1)}
                    disabled={i.qty === 1}
                  >
                    -
                  </button>
                  <span className="item-quantity">{i.qty}</span>
                  <button onClick={() => updateQuantity(i.id, i.qty + 1)}>+</button>
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
        <p>
          <b>Total: ${total.toLocaleString()}</b>
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={clear} style={{ marginRight: '10px' }}>
            Vaciar carrito
          </button>
          <button
            onClick={() =>
              alert('Checkout simulado. Descuento de stock se realiza en backend/mock.')
            }
          >
            Checkout
          </button>
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
              <input
                type="text"
                name="name"
                value={paymentInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Número de Tarjeta:</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha de Expiración (MM/AA):</label>
              <input
                type="text"
                name="expiration"
                placeholder="MM/AA"
                value={paymentInfo.expiration}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>CVV:</label>
              <input
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Confirmar Pago</button>
              <button type="button" onClick={() => setShowCheckout(false)}>
                Cancelar
              </button>
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
  );
}
