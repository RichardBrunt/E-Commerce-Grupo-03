import React, { createContext, useContext, useMemo, useState } from 'react'

const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }){
  const [items, setItems] = useState([])

  // Ahora addItem acepta un segundo parámetro opcional: cantidad
  const addItem = (p, cantidad = 1) => {
    setItems(prev => {
      const found = prev.find(i => i.id === p.id)
      if (found) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + cantidad } : i)
      return [...prev, { ...p, qty: cantidad }]
    })
  }
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clear = () => setItems([])
  const itemsCount = useMemo(() => items.reduce((acc,i)=>acc+i.qty,0), [items])
  const total = useMemo(() => items.reduce((acc,i)=>acc+i.price*i.qty,0), [items])

  return (
    <CartCtx.Provider value={{ items, addItem, removeItem, clear, itemsCount, total }}>
      {children}
    </CartCtx.Provider>
  )
}
