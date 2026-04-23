import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Tag, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function CategoryModal({ isOpen, onClose }) {
  const { categories, addCategory, deleteCategory, products } = useApp()
  const [input, setInput]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError]       = useState('')

  const usedNames = new Set(products.map(p => p.category))

  const handleAdd = async (e) => {
    e.preventDefault()
    const nombre = input.trim()
    if (!nombre) return
    if (categories.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
      setError('Ya existe esa categoría.')
      return
    }
    setSaving(true)
    setError('')
    const ok = await addCategory(nombre)
    setSaving(false)
    if (ok) setInput('')
    else setError('Error al guardar.')
  }

  const handleDelete = async (cat) => {
    if (usedNames.has(cat.nombre)) {
      setError(`"${cat.nombre}" está en uso por ${products.filter(p => p.category === cat.nombre).length} producto(s).`)
      return
    }
    setDeleting(cat.id)
    setError('')
    await deleteCategory(cat.id)
    setDeleting(null)
  }

  const handleClose = () => { setInput(''); setError(''); onClose() }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative bg-white rounded-2xl w-full max-w-sm shadow-modal"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted/10">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                <h2 className="text-brand font-bold text-lg">Categorías</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-brand transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Add form */}
              <form onSubmit={handleAdd} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => { setInput(e.target.value); setError('') }}
                  placeholder="Nueva categoría..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-muted/20 bg-surface text-brand text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={saving || !input.trim()}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-light text-brand font-bold px-3.5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Agregar
                </button>
              </form>

              {error && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
              )}

              {/* List */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-center text-muted text-sm py-6">Sin categorías.</p>
                ) : (
                  categories.map(cat => {
                    const inUse = usedNames.has(cat.nombre)
                    return (
                      <motion.div
                        key={cat.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface border border-muted/10 group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-brand text-sm font-medium">{cat.nombre}</span>
                          {inUse && (
                            <span className="text-xs text-muted bg-muted/10 px-2 py-0.5 rounded-full">
                              {products.filter(p => p.category === cat.nombre).length}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={deleting === cat.id}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-muted hover:text-red-500 transition-all disabled:opacity-50"
                          title={inUse ? 'En uso' : 'Eliminar'}
                        >
                          {deleting === cat.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                          }
                        </button>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
