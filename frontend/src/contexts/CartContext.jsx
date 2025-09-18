
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

// Creamos el contexto para el carrito
const CartCtx = createContext(null)
// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }) {
  // Inicializa desde localStorage (sin dependencias externas)
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Error loading cart:', e)
      return []
    }
  })

  // Persiste en localStorage cuando cambia el carrito
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items))
    } catch (e) {
      console.error('Error saving cart:', e)
    }
  }, [items])

  // Agregar item (acepta cantidad opcional)
  const addItem = (product, cantidad = 1) => {
    setItems(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + cantidad } : i
        )
      }
      return [...prev, { ...product, qty: cantidad }]
    })
  }

  // Actualizar cantidad (corrige el bug del id --)
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    )
  }

  // Eliminar y limpiar
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clear = () => setItems([])

  // Derivados memorizados
  const itemsCount = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((acc, i) => acc + i.price * i.qty, 0), [items])

  const contextValue = { items, addItem, updateQuantity, removeItem, clear, itemsCount, total }

  return (
    <CartCtx.Provider value={contextValue}>
      {children}
    </CartCtx.Provider>
  )
}



