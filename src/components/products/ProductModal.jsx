import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const EMPTY = { name: '', category: '', stock: '', cost: '', salePrice: '', minStock: '' }

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-muted/20 bg-surface text-brand text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

export default function ProductModal({ isOpen, onClose, product }) {
  const { addProduct, updateProduct, categories } = useApp()
  const [form, setForm]           = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    setError('')
    const defaultCategory = categories[0]?.nombre ?? ''
    setForm(
      product
        ? { name: product.name, category: product.category, stock: String(product.stock), cost: String(product.cost), salePrice: String(product.salePrice), minStock: String(product.minStock) }
        : { ...EMPTY, category: defaultCategory },
    )
  }, [product, isOpen, categories])

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const margin =
    form.cost && form.salePrice && Number(form.salePrice) > 0
      ? (((Number(form.salePrice) - Number(form.cost)) / Number(form.salePrice)) * 100).toFixed(1)
      : null

  const marginColor =
    margin === null          ? '' :
    Number(margin) >= 30     ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    Number(margin) >= 15     ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                               'bg-red-50 text-red-600 border-red-200'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const data = {
      name: form.name.trim(),
      category: form.category,
      stock: Number(form.stock),
      cost: Number(form.cost),
      salePrice: Number(form.salePrice),
      minStock: Number(form.minStock),
    }
    const ok = product ? await updateProduct(product.id, data) : await addProduct(data)
    setSubmitting(false)
    if (ok) {
      onClose()
    } else {
      setError('Error al guardar. Verificá los datos e intentá de nuevo.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && onClose()}
            className="absolute inset-0 bg-brand/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative bg-white rounded-2xl w-full max-w-md shadow-modal"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted/10">
              <h2 className="text-brand font-bold text-lg">
                {product ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <button
                onClick={() => !submitting && onClose()}
                className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-brand transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <Field label="Nombre del Producto">
                <input type="text" value={form.name} onChange={set('name')} placeholder="Ej: Laptop Dell XPS" className={inputCls} required />
              </Field>

              <Field label="Categoría">
                <select value={form.category} onChange={set('category')} className={inputCls} required>
                  {form.category === '' && <option value="">Seleccionar...</option>}
                  {categories.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Actual">
                  <input type="number" min="0" value={form.stock} onChange={set('stock')} placeholder="0" className={inputCls} required />
                </Field>
                <Field label="Stock Mínimo">
                  <input type="number" min="0" value={form.minStock} onChange={set('minStock')} placeholder="5" className={inputCls} required />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Costo ($)">
                  <input type="number" min="0" step="0.01" value={form.cost} onChange={set('cost')} placeholder="0.00" className={inputCls} required />
                </Field>
                <Field label="Precio Venta ($)">
                  <input type="number" min="0" step="0.01" value={form.salePrice} onChange={set('salePrice')} placeholder="0.00" className={inputCls} required />
                </Field>
              </div>

              {margin !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 border text-sm font-medium ${marginColor}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Margen de ganancia: <span className="font-bold">{margin}%</span>
                </motion.div>
              )}

              {error && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !submitting && onClose()}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-muted/20 text-muted hover:text-brand hover:bg-surface text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-brand font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                    : product ? 'Guardar Cambios' : 'Agregar Producto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
