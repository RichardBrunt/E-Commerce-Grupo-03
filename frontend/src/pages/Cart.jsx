import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function Cart() {
  // Hooks para el estado y la navegación
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, removeItem, clear, updateQuantity } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  // Efecto para verificar autenticación al intentar pagar
  useEffect(() => {
    if (showCheckout && !user) {
      navigate('/login');
    }
  }, [showCheckout, user, navigate]);

  // Validación de entrada en tiempo real
  const validateInput = (name, value) => {
    switch (name) {
      case 'name':
        // Validación de nombre: solo letras y espacios
        return /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(value) ? value : null;
      case 'cardNumber':
        // Validación de número de tarjeta: solo números, máximo 16 dígitos
        return /^\d{0,16}$/.test(value) ? value : null;
      case 'expiration':
        // Validación de fecha de expiración: formato MM/AA
        return /^(\d{0,2}\/?\d{0,2})$/.test(value) ? value : null;
      case 'cvv':
        // Validación de CVV: solo 3 o 4 dígitos
        return /^\d{0,4}$/.test(value) ? value : null;
      default:
        return value;
    }
  };

  // Formateo de entrada para mantener consistencia
  const formatInput = (name, value) => {
    if (name === 'expiration') {
      // Auto-formato para fecha de expiración MM/AA
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    return value;
  };

  // Manejador de cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatInput(name, value);
    const validatedValue = validateInput(name, formattedValue);
    
    if (validatedValue !== null) {
      setPaymentInfo((prev) => ({ ...prev, [name]: validatedValue }));
    }
  };

  // Validación completa del formulario antes del envío
  const validateForm = () => {
    const errors = [];

    // Validación del nombre (solo letras y espacios)
    if (!paymentInfo.name.trim()) {
      errors.push('El nombre es obligatorio');
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(paymentInfo.name)) {
      errors.push('El nombre solo debe contener letras');
    }

    // Validación del número de tarjeta (16 dígitos exactos)
    if (!paymentInfo.cardNumber) {
      errors.push('El número de tarjeta es obligatorio');
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber)) {
      errors.push('El número de tarjeta debe tener 16 dígitos');
    }

    // Validación de la fecha de expiración (formato MM/AA)
    if (!paymentInfo.expiration) {
      errors.push('La fecha de expiración es obligatoria');
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiration)) {
      errors.push('La fecha debe tener el formato MM/AA');
    } else {
      const [month, year] = paymentInfo.expiration.split('/');
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear() % 100;
      
      if (monthNum < 1 || monthNum > 12) {
        errors.push('El mes debe estar entre 01 y 12');
      }
      if (yearNum < currentYear) {
        errors.push('La tarjeta está vencida');
      }
    }

    // Validación del CVV (3 o 4 dígitos)
    if (!paymentInfo.cvv) {
      errors.push('El CVV es obligatorio');
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.push('El CVV debe tener 3 o 4 dígitos');
    }

    return errors;
  };

  // Manejador del envío del formulario
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el usuario esté autenticado
    if (!user) {
      navigate('/login');
      return;
    }

    // Validar el formulario
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Por favor corrija los siguientes errores:\n' + errors.join('\n'));
      return;
    }

    // Si todo está bien, mostrar confirmación final
    setShowFinalConfirmation(true);
  };

  // Función para confirmar el pago final
  const confirmPayment = () => {
    try {
      // En un caso real, aquí se procesaría el pago con un servicio de pagos
      alert('¡Pago realizado con éxito!');
      
      // Limpiar el estado del carrito y el formulario
      clear(); // Limpia el carrito usando la función del contexto
      setPaymentInfo({ name: '', cardNumber: '', expiration: '', cvv: '' });
      
      // Cerrar los modales
      setShowFinalConfirmation(false);
      setShowCheckout(false);
      
      // Redirigir al inicio o a una página de confirmación
      navigate('/');
    } catch (error) {
      alert('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
      console.error('Error en el pago:', error);
    }
  };

  // Función para cancelar la confirmación final
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
