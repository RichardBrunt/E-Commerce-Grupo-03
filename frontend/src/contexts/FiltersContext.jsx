import React, { createContext, useContext, useMemo, useState } from 'react'

const FiltersCtx = createContext(null)
export const useFilters = () => useContext(FiltersCtx)

export function FiltersProvider({ children }) {
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState('') // string|number
  const [order, setOrder] = useState('asc') // 'asc' | 'desc'
  const [sortBy, setSortBy] = useState('name') // 'name' | 'price'

  const value = useMemo(
    () => ({ q, setQ, categoryId, setCategoryId, order, setOrder, sortBy, setSortBy }),
    [q, categoryId, order, sortBy]
  )

  return <FiltersCtx.Provider value={value}>{children}</FiltersCtx.Provider>
}
