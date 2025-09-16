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

  const validateInput = (name, value) => {
    switch (name) {
      case 'name':
        // Solo letras y espacios
        return /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(value) ? value : null;
      case 'cardNumber':
        // Solo números, máximo 16 dígitos
        return /^\d{0,16}$/.test(value) ? value : null;
      case 'expiration':
        // Formato MM/AA
        return /^(\d{0,2}\/?\d{0,2})$/.test(value) ? value : null;
      case 'cvv':
        // Solo 3 o 4 dígitos
        return /^\d{0,4}$/.test(value) ? value : null;
      default:
        return value;
    }
  };

  const formatInput = (name, value) => {
    if (name === 'expiration') {
      // Autoformato MM/AA
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatInput(name, value);
    const validatedValue = validateInput(name, formattedValue);
    
    if (validatedValue !== null) {
      setPaymentInfo((prev) => ({ ...prev, [name]: validatedValue }));
    }
  };

  const validateForm = () => {
    const errors = [];
    // Validar nombre (solo letras y espacios)
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(paymentInfo.name)) {
      errors.push('El nombre solo debe contener letras');
    }

    // Validar número de tarjeta (exactamente 16 dígitos)
    if (!/^\d{16}$/.test(paymentInfo.cardNumber)) {
      errors.push('El número de tarjeta debe tener 16 dígitos');
    }

    // Validar fecha de expiración (formato MM/AA)
    if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiration)) {
      errors.push('La fecha debe tener el formato MM/AA');
    } else {
      const [month, year] = paymentInfo.expiration.split('/');
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.push('El mes debe estar entre 01 y 12');
      }
    }

    // Validar CVV (3 o 4 dígitos)
    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.push('El CVV debe tener 3 o 4 dígitos');
    }

    return errors;
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Por favor corrija los siguientes errores:\n' + errors.join('\n'));
      return;
    }
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
                <p>Precio unitario: ${i.price.toLocaleString()}</p>
                <p>Cantidad: {i.qty}</p>
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
        <p>
          <b>Total: ${total.toLocaleString()}</b>
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={clear} className="clear-cart-button">
            Vaciar carrito
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
  )
}
