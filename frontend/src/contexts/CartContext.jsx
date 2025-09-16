import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

// Creamos el contexto para el carrito
const CartCtx = createContext(null)
// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartCtx)

// Proveedor del contexto del carrito
export function CartProvider({ children }){
  // Estado local del carrito usando useState, inicializado desde localStorage
  const [items, setItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  // Efecto para persistir el carrito en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [items]); // Se ejecuta cuando items cambia

  // Método para agregar un item al carrito
  const addItem = (product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Si el item ya existe, actualiza la cantidad
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      // Si el item no existe, añádelo con cantidad 1
      return [...prevItems, { ...product, qty: 1 }];
    });
  };

  // Método para actualizar la cantidad de un item
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return; // Validación de cantidad mínima
    setItems(prevItems => 
      prevItems.map(item =>
        item.id === id 
          ? { ...item, qty: newQty }
          : item
      )
    );
  };

  // Método para eliminar un item del carrito
  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Método para vaciar el carrito
  const clear = () => setItems([]);

  // Cálculos memorizados para evitar recálculos innecesarios
  const itemsCount = useMemo(() => 
    items.reduce((total, item) => total + item.qty, 0), 
    [items]
  );

  const total = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.qty), 0), 
    [items]
  );

  // Valor del contexto que se proveerá a los componentes
  const contextValue = {
    items,          // Array de items en el carrito
    addItem,        // Función para agregar items
    updateQuantity, // Función para actualizar cantidad
    removeItem,     // Función para eliminar items
    clear,         // Función para vaciar el carrito
    itemsCount,    // Número total de items
    total          // Suma total del carrito
  };

  return (
    <CartCtx.Provider value={contextValue}>
      {children}
    </CartCtx.Provider>
  );
}
