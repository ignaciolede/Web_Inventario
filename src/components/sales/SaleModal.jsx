import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingCart, CheckCircle, Edit3, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function SaleModal({ isOpen, onClose, sale = null }) {
  const { products, addSale, updateSale } = useApp()
  const isEditing = !!sale

  const [items, setItems]         = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [qty, setQty]             = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (isOpen) {
      setItems(sale ? sale.items.map(i => ({ ...i })) : [])
      setSelectedId('')
      setQty(1)
      setError('')
    }
  }, [isOpen, sale])

  // When editing, the sale has already deducted stock.
  // We add back the original quantities so the user can freely adjust.
  const effectiveStock = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return 0
    const originalQty = sale?.items.find(i => i.productId === productId)?.quantity ?? 0
    return product.stock + originalQty
  }

  const available = products.filter(p => effectiveStock(p.id) > 0)

  const handleAdd = () => {
    if (!selectedId) return
    const product = products.find(p => p.id === selectedId)
    if (!product) return
    const existing  = items.find(i => i.productId === selectedId)
    const usedQty   = existing ? existing.quantity : 0
    const avail     = effectiveStock(selectedId)
    if (usedQty + qty > avail) { alert(`Stock insuficiente. Disponible: ${avail - usedQty}`); return }
    setItems(prev =>
      existing
        ? prev.map(i => i.productId === selectedId ? { ...i, quantity: i.quantity + qty, subtotal: (i.quantity + qty) * i.unitPrice } : i)
        : [...prev, { productId: product.id, productName: product.name, quantity: qty, unitPrice: product.salePrice, subtotal: product.salePrice * qty }],
    )
    setSelectedId('')
    setQty(1)
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.productId !== id))
  const total = items.reduce((s, i) => s + i.subtotal, 0)

  const handleSubmit = async () => {
    if (!items.length) return
    setSubmitting(true)
    setError('')
    const ok = isEditing ? await updateSale(sale.id, items) : await addSale(items)
    setSubmitting(false)
    if (ok) {
      handleClose()
    } else {
      setError('Error al registrar la venta. Verificá el stock disponible.')
    }
  }

  const handleClose = () => {
    if (submitting) return
    setItems([])
    setSelectedId('')
    setQty(1)
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative bg-white rounded-2xl w-full max-w-lg shadow-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted/10">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isEditing ? 'bg-blue-50' : 'bg-primary/15'}`}>
                  {isEditing
                    ? <Edit3 className="w-4 h-4 text-blue-600" />
                    : <ShoppingCart className="w-4 h-4 text-brand" />}
                </div>
                <div>
                  <h2 className="text-brand font-bold text-lg leading-none">
                    {isEditing ? 'Editar Venta' : 'Nueva Venta'}
                  </h2>
                  {isEditing && (
                    <p className="text-muted text-xs mt-0.5">
                      {new Date(sale.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-brand transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Product picker */}
              <div className="bg-surface rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-brand uppercase tracking-wide">Agregar producto</p>
                <div className="flex gap-2">
                  <select
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-muted/20 bg-white text-brand text-sm focus:outline-none focus:border-primary min-w-0"
                  >
                    <option value="">Seleccionar producto...</option>
                    {available.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {effectiveStock(p.id)}) — ${p.salePrice.toLocaleString('es-AR')}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center bg-white border border-muted/20 rounded-xl overflow-hidden shrink-0">
                    <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2.5 py-2.5 hover:bg-surface text-muted hover:text-brand transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-brand font-bold text-sm min-w-[2rem] text-center">{qty}</span>
                    <button type="button" onClick={() => setQty(q => q + 1)} className="px-2.5 py-2.5 hover:bg-surface text-muted hover:text-brand transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!selectedId}
                    className="px-3.5 py-2.5 bg-primary hover:bg-primary-light disabled:opacity-40 text-brand font-bold rounded-xl text-sm transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items list */}
              <div className="min-h-[80px] max-h-52 overflow-y-auto space-y-2">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-20 text-muted text-sm">
                    <ShoppingCart className="w-6 h-6 mb-1.5 opacity-40" />
                    No hay productos en esta venta
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map(item => (
                      <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between bg-surface rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="text-brand text-sm font-semibold">{item.productName}</p>
                          <p className="text-muted text-xs mt-0.5">{item.quantity} u. × ${item.unitPrice.toLocaleString('es-AR')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-brand font-bold text-sm">${item.subtotal.toLocaleString('es-AR')}</span>
                          <button onClick={() => removeItem(item.productId)} className="p-1 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-muted/10 pt-4 flex items-center justify-between">
                <span className="text-brand font-semibold">Total de la venta</span>
                <span className="text-brand text-2xl font-bold">${total.toLocaleString('es-AR')}</span>
              </div>

              {error && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-muted/20 text-muted hover:text-brand hover:bg-surface text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={items.length === 0 || submitting}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40
                    ${isEditing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-primary hover:bg-primary-light text-brand'}`}
                >
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                    : isEditing
                      ? <><Edit3 className="w-4 h-4" /> Guardar Cambios</>
                      : <><CheckCircle className="w-4 h-4" /> Registrar Venta</>}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
