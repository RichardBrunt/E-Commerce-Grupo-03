import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }){
  // Initialize cart from localStorage
  const [items, setItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Persist cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (p) => {
    setItems(prev => {
      const found = prev.find(i => i.id === p.id)
      if (found) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...p, qty: 1 }]
    })
  }
  const updateQuantity = (id, qty) => {
    if (qty < 1) return; // enforce minimum quantity
    setItems(prev => prev.map(item => item.id === id ? { ...item, qty } : item))
  }
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clear = () => setItems([])
  const itemsCount = useMemo(() => items.reduce((acc,i)=>acc+i.qty,0), [items])
  const total = useMemo(() => items.reduce((acc,i)=>acc+i.price*i.qty,0), [items])

  return (
    <CartCtx.Provider value={{ items, addItem, updateQuantity, removeItem, clear, itemsCount, total }}>
      {children}
    </CartCtx.Provider>
  )
}
