import React, { useEffect, useMemo, useState } from 'react'
import { createProduct, deleteProduct, listProducts, updateProduct, listCategories, createCategory } from '@/services/api.js'
import '../assets/Cart.css'
import '../assets/MyProducts.css'

export default function MyProducts(){
  const [mode, setMode] = useState('list')
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ name:'', price:0, stock:0, image:'', imagesText:'', description:'', categoryId:'' })
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [mainImageError, setMainImageError] = useState(false)
  const [extraImgErrors, setExtraImgErrors] = useState({}) // { url: true }

  const reload = async () => {
    try {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        listProducts({ _sort:'id', _order:'asc' }),
        listCategories()
      ])
      setProducts(prods)
      setCategories(cats)
    } catch(err){
      setError('No se pudo cargar gestión de stock')
    } finally { setLoading(false) }
  }

  useEffect(()=>{ reload() }, [])

  const resetForm = () => setForm({ name:'', price:0, stock:0, image:'', imagesText:'', description:'', categoryId:'' })

  const goList = () => { setMode('list'); setSelected(null); resetForm() }
  const goNew = () => { setMode('edit'); setSelected(null); resetForm() }
  const goEdit = (p) => { 
    setMode('edit'); 
    setSelected(p); 
    // Resolver categoryId a partir de p.categoryId o p.category (nombre)
    const cid = p.categoryId ?? categories.find(c => c.name === p.category)?.id ?? ''
    setForm({ 
      name:p.name||'', 
      price:p.price||0, 
      stock:p.stock||0, 
      image:p.image||'', 
      imagesText:(Array.isArray(p.images)? p.images.filter(u=>u && u!==p.image).join('\n') : ''),
      description:p.description||'', 
      categoryId: cid !== undefined && cid !== null ? String(cid) : ''
    }) 
  }
  const goView = (p) => { setMode('view'); setSelected(p) }

  const onSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name?.trim()) nextErrors.name = 'El nombre es obligatorio'
    if (form.price === '' || Number(form.price) <= 0) nextErrors.price = 'El precio debe ser mayor a 0'
    if (form.stock === '' || Number(form.stock) < 0) nextErrors.stock = 'El stock no puede ser negativo'
    if (!form.categoryId) nextErrors.categoryId = 'La categoría es obligatoria'
    if (!form.image?.trim()) nextErrors.image = 'La imagen principal es obligatoria'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    try {
      setSaving(true)
      const extras = (form.imagesText || '')
        .split(/\n|,/) // permitir comas o saltos de línea
        .map(s => s.trim())
        .filter(Boolean)
      // Construir objeto producto según estructura del json
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image?.trim() || '',
        images: [form.image?.trim(), ...extras].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i),
        description: form.description?.trim() || '',
        categoryId: Number(form.categoryId)
      }
      if (selected) await updateProduct(selected.id, payload)
      else await createProduct(payload)
      await reload()
      goList()
    } catch(err){
      setError('No se pudo guardar')
    } finally { setSaving(false) }
  }

  const removeExtraUrl = (urlToRemove) => {
    const parts = (form.imagesText || '').split(/\n|,/).map(s=>s.trim()).filter(Boolean)
    const next = parts.filter(u => u !== urlToRemove)
    setForm(prev => ({ ...prev, imagesText: next.join('\n') }))
    setExtraImgErrors(prev => {
      const copy = { ...prev }
      delete copy[urlToRemove]
      return copy
    })
  }

  const categoryNameById = useMemo(() => {
    const map = new Map()
    categories.forEach(c => map.set(String(c.id), c.name))
    return (id) => map.get(String(id)) || ''
  }, [categories])

  const addCategory = async () => {
    const name = newCategory.trim()
    if (!name) return
    try {
      const created = await createCategory({ name })
      await reload()
      setForm(prev => ({ ...prev, categoryId: String(created.id) }))
      setNewCategory('')
    } catch (e) {
      setError('No se pudo crear la categoría')
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <section style={{ padding:24, background:'#ffffff', color:'#111', border:'1px solid #e5e5e5', borderRadius:16, maxWidth: 1200, margin: '1.5rem auto' }}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{margin:0}}>Gestión de Stock</h2>
          <small style={{color:'#aaa'}}>Alta, edición y baja de productos y stock</small>
        </div>
        {mode === 'list' && (
          <button
            className="btn-primary"
            onClick={goNew}
          >
            Agregar nuevo
          </button>
        )}
        {mode !== 'list' && <button className="btn-primary" onClick={goList}>Volver al listado</button>}
      </div>

      {mode === 'list' && (
        <div className="table-card table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th className="col-price">Precio</th>
                <th className="col-stock">Stock</th>
                <th className="col-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((r) => (
                <tr key={r.id}>
                  <td className="col-id">{r.id}</td>
                  <td>
                    <div className="name-cell">
                      <img className="thumb" src={r.image} alt={r.name} />
                      <div className="name-text">
                        <div className="name-main">{r.name}</div>
                        <small className="name-sub">#{r.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{categoryNameById(r.categoryId)}</td>
                  <td className="col-price price">${r.price?.toLocaleString?.('es-AR') ?? r.price}</td>
                  <td className="col-stock">
                    <span className={`stock-pill ${r.stock > 0 ? 'ok' : 'out'}`}>
                      {r.stock > 0 ? `Disponible (${r.stock})` : 'Sin stock'}
                    </span>
                  </td>
                  <td className="col-actions">
                    <div className="actions">
                      <button className="btn-primary btn-sm" onClick={()=>goView(r)}>Ver</button>
                      <button className="btn-ghost btn-sm" onClick={()=>goEdit(r)}>Editar</button>
                      <button className="btn-ghost danger btn-sm" onClick={()=>deleteProduct(r.id).then(reload)}>Eliminar</button>
                      <a
                        className="btn-ghost btn-sm"
                        href={`/product/${r.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en tienda ↗
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mode === 'view' && selected && (
        <div style={{ marginTop: 16, background:'#fff', border:'1px solid #E0E0E0', borderRadius: 12, boxShadow:'0 2px 12px rgba(0,0,0,.06)', padding: 16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 340px', gap: 16, alignItems:'start' }}>
            {/* Miniaturas */}
            <div style={{ display:'grid', gap: 8 }}>
              {[...(selected.images || [selected.image]).filter(Boolean)].map((src, i) => (
                <img key={src + i} src={src} alt={`thumb-${i+1}`} style={{ width: 100, height: 100, objectFit:'contain', border:'1px solid #eee', borderRadius: 8, background:'#fafafa' }} />
              ))}
            </div>
            {/* Imagen principal y descripción */}
            <div style={{ display:'grid', gap: 8 }}>
              <img src={selected.image} alt={selected.name} style={{ width: '100%', height: 320, objectFit:'contain', borderRadius: 12, background:'#f2f2f2' }} />
              <div>
                <h3 style={{ margin:'8px 0' }}>{selected.name}</h3>
                <p style={{ margin:'4px 0', color:'#555' }}>{selected.description || 'Sin descripción'}</p>
              </div>
            </div>
            {/* Panel derecho con datos */}
            <div style={{ border:'1px solid #eee', borderRadius: 12, padding: 12, background:'#fcfcfc', display:'grid', gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>${selected.price?.toLocaleString?.() || selected.price}</div>
              <div style={{ color: selected.stock>0 ? '#00a650' : '#e53935', fontWeight: 700, fontSize: 16 }}>
                {selected.stock>0 ? `Stock disponible (${selected.stock})` : 'Sin stock'}
              </div>
              <div style={{ color:'#333' }}>Categoría: <b>{categoryNameById(selected.categoryId) || '—'}</b></div>
              <div style={{ display:'grid', gap: 8 }}>
                <button className="btn-primary btn-md" onClick={()=>goEdit(selected)}>Editar</button>
                <a
                  href={`/product/${selected.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-md"
                  style={{ textAlign:'center', textDecoration:'none' }}
                  
                >
                  Ver en tienda ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'edit' && (
        <div className="checkout-card" style={{ marginTop: 16, width: 'min(1100px, 96vw)', marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 style={{ margin: '0 0 .25rem 0' }}>{selected ? 'Editar producto' : 'Nuevo producto'}</h3>
          <p className="checkout-subtext">Actualizá la información del producto y su stock.</p>
          <form onSubmit={onSubmit} className="checkout-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input placeholder="Ej: Teclado mecánico TKL" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
                {errors.name && <small style={{color:'#d32f2f'}}>{errors.name}</small>}
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" min="1" step="1" placeholder="Ej: 89999" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
                {errors.price && <small style={{color:'#d32f2f'}}>{errors.price}</small>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Stock</label>
                <input type="number" min="0" step="1" placeholder="Ej: 5" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} />
                {errors.stock && <small style={{color:'#d32f2f'}}>{errors.stock}</small>}
              </div>
              <div className="form-group">
                <label>URL de imagen principal <span style={{color:'#d32f2f'}}>*</span></label>
                <input aria-required="true" placeholder="https://... o /img/products/archivo.jpg" value={form.image} onChange={e=>{ setForm({...form, image:e.target.value}); setMainImageError(false) }} />
                {errors.image && <small style={{color:'#d32f2f'}}>{errors.image}</small>}
              </div>
            </div>
            <div className="form-group">
              <label>URLs adicionales (opcional, separadas por coma o salto de línea)</label>
              <textarea placeholder="https://img1.jpg, https://img2.jpg\nhttps://img3.jpg" value={form.imagesText} onChange={e=>{ setForm({...form, imagesText:e.target.value}); setExtraImgErrors({}) }} />
              <small className="checkout-subtext">Estas se mostrarán en la galería del detalle del producto.</small>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea placeholder="Breve descripción del producto" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            </div>
            {/* Previsualización de imágenes */}
            <div className="form-group">
              <label>Previsualización</label>
              <div style={{ display:'grid', gridTemplateColumns: '260px 1fr', gap: '1rem', alignItems: 'start' }}>
                <div style={{ position:'relative', background:'#f5f5f5', border:'1px solid #E0E0E0', borderRadius: '.5rem', display:'grid', placeItems:'center', padding: '.5rem', minHeight: 220 }}>
                  {form.image?.trim() ? (
                    <>
                      <img src={form.image.trim()} alt="Imagen principal" style={{ width: '100%', height: 220, objectFit: 'contain' }} onError={()=>setMainImageError(true)} onLoad={()=>setMainImageError(false)} />
                      {mainImageError && (
                        <span style={{ position:'absolute', bottom: 8, left: 8, background:'#e53935', color:'#fff', padding:'2px 6px', borderRadius:4, fontSize:12 }}>URL inválida</span>
                      )}
                    </>
                  ) : (
                    <span className="checkout-subtext">Sin imagen principal</span>
                  )}
                </div>
                <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '.5rem' }}>
                  {((form.imagesText||'').split(/\n|,/).map(s=>s.trim()).filter(Boolean)).map((url, i) => (
                    <div key={url+i} style={{ position:'relative', background:'#f5f5f5', border:'1px solid #E0E0E0', borderRadius: '.5rem', display:'grid', placeItems:'center', padding: '.25rem', minHeight: 120 }}>
                      <img src={url} alt={`img-${i+1}`} style={{ width: '100%', height: 120, objectFit: 'contain' }} onError={()=>setExtraImgErrors(prev=>({ ...prev, [url]: true }))} />
                      {extraImgErrors[url] && (
                        <span style={{ position:'absolute', bottom: 6, left: 6, background:'#e53935', color:'#fff', padding:'2px 6px', borderRadius:4, fontSize:11 }}>URL inválida</span>
                      )}
                      <button
                        type="button"
                        onClick={()=>removeExtraUrl(url)}
                        aria-label={`Eliminar ${url}`}
                        title="Eliminar"
                        style={{
                          position:'absolute', top: 4, right: 4,
                          background:'#000', color:'#fff',
                          border:'1px solid #000', borderRadius:8,
                          padding: '2px 8px', fontWeight:700, cursor:'pointer',
                          transition: 'background .15s ease, color .15s ease, border-color .15s ease'
                        }}
                        onMouseOver={e=>{ e.currentTarget.style.background = '#FFD700'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#FFD700'; }}
                        onMouseOut={e=>{ e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {!(form.imagesText||'').trim() && <small className="checkout-subtext">Sin imágenes adicionales</small>}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select value={form.categoryId} onChange={e=>setForm({...form, categoryId: e.target.value})}>
                  <option value="">Seleccione categoría</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {errors.categoryId && <small style={{color:'#d32f2f'}}>{errors.categoryId}</small>}
              </div>
              <div className="form-group">
                <label>Nueva categoría</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap: '.5rem' }}>
                  <input placeholder="Nombre de categoría" value={newCategory} onChange={e=>setNewCategory(e.target.value)} />
                  <button type="button" className="btn-primary" onClick={addCategory}>Agregar</button>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button disabled={saving} type="submit" className="btn-primary">
                {saving ? 'Guardando...' : (selected ? 'Guardar cambios' : 'Crear')}
              </button>
              <button type="button" className="btn-ghost" onClick={goList}>Cancelar</button>
              <button type="button" className="btn-ghost" onClick={resetForm}>Limpiar</button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
