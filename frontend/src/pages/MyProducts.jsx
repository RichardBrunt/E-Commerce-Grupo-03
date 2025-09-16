import React, { useEffect, useState } from 'react'
import { createProduct, deleteProduct, listProducts, updateProduct, listCategories } from '@/services/api.js'

export default function MyProducts(){
  const [mode, setMode] = useState('list')
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ name:'', price:0, stock:0, image:'', description:'', category:'' })
  const [categoryOptions, setCategoryOptions] = useState([])

  const reload = async () => {
    try {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        listProducts({ _sort:'id', _order:'asc' }),
        listCategories()
      ])
      setProducts(prods)
      setCategoryOptions(cats.map(c => c.name))
    } catch(err){
      setError('No se pudo cargar gestión de stock')
    } finally { setLoading(false) }
  }

  useEffect(()=>{ reload() }, [])

  const resetForm = () => setForm({ name:'', price:0, stock:0, image:'', description:'', category:'' })

  const goList = () => { setMode('list'); setSelected(null); resetForm() }
  const goNew = () => { setMode('edit'); setSelected(null); resetForm() }
  const goEdit = (p) => { 
    setMode('edit'); 
    setSelected(p); 
    setForm({ 
      name:p.name||'', 
      price:p.price||0, 
      stock:p.stock||0, 
      image:p.image||'', 
      description:p.description||'', 
      category:p.category||'' 
    }) 
  }
  const goView = (p) => { setMode('view'); setSelected(p) }

  const onSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name?.trim()) nextErrors.name = 'El nombre es obligatorio'
    if (form.price === '' || Number(form.price) <= 0) nextErrors.price = 'El precio debe ser mayor a 0'
    if (form.stock === '' || Number(form.stock) < 0) nextErrors.stock = 'El stock no puede ser negativo'
    if (!form.category?.trim()) nextErrors.category = 'La categoría es obligatoria'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    try {
      setSaving(true)
      if (selected) await updateProduct(selected.id, form)
      else await createProduct(form)
      await reload()
      goList()
    } catch(err){
      setError('No se pudo guardar')
    } finally { setSaving(false) }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <section className="card" style={{ padding:24 }}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <h2>Gestión de Stock</h2>
        {mode === 'list' && <button className="btn btn-primary" onClick={goNew}>Agregar nuevo</button>}
        {mode !== 'list' && <button className="btn btn-secondary" onClick={goList}>Volver al listado</button>}
      </div>

      {mode === 'list' && (
        <div style={{overflowX:'auto'}}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((r, idx) => (
                <tr key={r.id} style={{background: idx%2? 'var(--bg)':'var(--secondary)'}}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.category}</td>
                  <td>{r.price}</td>
                  <td>{r.stock}</td>
                  <td className="row">
                    <button className="btn btn-info" onClick={()=>goView(r)}>Ver</button>
                    <button className="btn btn-secondary" onClick={()=>goEdit(r)}>Editar</button>
                    <button className="btn btn-danger" onClick={()=>deleteProduct(r.id).then(reload)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mode === 'view' && selected && (
        <div className="row" style={{gap:24, alignItems:'flex-start'}}>
          <img className="img" src={selected.image} alt={selected.name} style={{maxWidth:320}}/>
          <div>
            <h3>{selected.name}</h3>
            <p>{selected.description}</p>
            <p><b>Precio:</b> {selected.price}</p>
            <p><b>Stock:</b> {selected.stock}</p>
            <p><b>Categoría:</b> {selected.category}</p>
            <div className="row" style={{gap:8}}>
              <button className="btn btn-secondary" onClick={()=>goEdit(selected)}>Editar</button>
            </div>
          </div>
        </div>
      )}

      {mode === 'edit' && (
        <form onSubmit={onSubmit} style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(320px, 1fr))', gap:24}}>
          <label>
            Nombre
            <input placeholder="Ej: Teclado mecánico TKL" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          </label>
          {errors.name && <small style={{color:'#d32f2f'}}>{errors.name}</small>}

          <label>
            Precio
            <input type="number" min="1" step="1" placeholder="Ej: 89999" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
          </label>
          {errors.price && <small style={{color:'#d32f2f'}}>{errors.price}</small>}

          <label>
            Stock
            <input type="number" min="0" step="1" placeholder="Ej: 5" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} />
          </label>
          {errors.stock && <small style={{color:'#d32f2f'}}>{errors.stock}</small>}

          <label>
            URL de imagen
            <input placeholder="https://..." value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
          </label>

          <label>
            Descripción
            <textarea placeholder="Breve descripción del producto" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          </label>

          <label>
            Categoría
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
              <option value="">Seleccione categoría</option>
              {categoryOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          {errors.category && <small style={{color:'#d32f2f'}}>{errors.category}</small>}

          <div className="row" style={{gap:16, gridColumn:'1 / -1'}}>
            <button disabled={saving} type="submit" className="btn btn-primary">
              {saving ? 'Guardando...' : (selected ? 'Guardar cambios' : 'Crear')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={goList}>Cancelar</button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Limpiar</button>
          </div>
        </form>
      )}
    </section>
  )
}
