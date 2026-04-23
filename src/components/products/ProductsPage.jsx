import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, AlertTriangle, Filter, Tag } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ProductModal from './ProductModal'
import CategoryModal from './CategoryModal'
import { SkeletonRow } from '../ui/Skeleton'

function marginOf(p) {
  if (!p.salePrice) return 0
  return (((p.salePrice - p.cost) / p.salePrice) * 100).toFixed(1)
}

function MarginBadge({ value }) {
  const v = Number(value)
  const cls = v >= 30 ? 'text-emerald-600 bg-emerald-50' : v >= 15 ? 'text-yellow-700 bg-yellow-50' : 'text-red-500 bg-red-50'
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${cls}`}>{value}%</span>
}

export default function ProductsPage() {
  const { products, deleteProduct, loadingProducts, isAdmin, categories } = useApp()
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('Todos')
  const [modalOpen, setModalOpen]   = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const allCategories = ['Todos', ...categories.map(c => c.nombre)]

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'Todos' || p.category === category
    return matchSearch && matchCat
  })

  const handleEdit   = (p) => { setEditProduct(p); setModalOpen(true) }
  const handleAdd    = ()  => { setEditProduct(null); setModalOpen(true) }
  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) await deleteProduct(id)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2.5 flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-muted/20 bg-white text-brand text-sm placeholder:text-muted/60 focus:outline-none focus:border-primary w-full sm:w-60"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-muted/20 rounded-xl px-3 py-2.5">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-transparent text-brand text-sm focus:outline-none"
            >
              {allCategories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setCatModalOpen(true)}
              className="flex items-center gap-2 border border-muted/20 hover:bg-surface text-muted hover:text-brand font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
            >
              <Tag className="w-4 h-4" />
              Categorías
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-primary hover:bg-primary-light text-brand font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Agregar Producto
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-muted/10 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-muted/10 bg-surface/60">
                <th className="text-left px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Producto</th>
                <th className="text-left px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Categoría</th>
                <th className="text-right px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Costo</th>
                <th className="text-right px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Precio Venta</th>
                <th className="text-center px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Margen</th>
                {isAdmin && <th className="text-center px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loadingProducts
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={isAdmin ? 7 : 6} />)
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6} className="text-center py-14 text-muted text-sm">
                        {products.length === 0 ? 'Sin productos.' : 'No se encontraron productos.'}
                      </td>
                    </tr>
                  )
                  : filtered.map((p, i) => {
                    const isLow = p.stock <= p.minStock
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.035 }}
                        className={`border-b border-muted/6 last:border-0 hover:bg-surface/50 transition-colors ${isLow ? 'bg-red-50/40' : ''}`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            {isLow && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" title="Stock bajo" />}
                            <span className="font-semibold text-brand text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="bg-surface text-muted text-xs px-2.5 py-1 rounded-full font-medium border border-muted/15">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`font-bold text-sm ${isLow ? 'text-red-500' : 'text-brand'}`}>{p.stock}</span>
                          {isLow && <span className="text-red-400 text-xs ml-1.5">/ mín.{p.minStock}</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right text-muted text-sm">${p.cost.toLocaleString('es-AR')}</td>
                        <td className="px-5 py-3.5 text-right text-brand text-sm font-semibold">${p.salePrice.toLocaleString('es-AR')}</td>
                        <td className="px-5 py-3.5 text-center"><MarginBadge value={marginOf(p)} /></td>
                        {isAdmin && (
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted hover:text-brand transition-colors" title="Editar">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors" title="Eliminar">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
        {!loadingProducts && (
          <div className="px-5 py-3 border-t border-muted/10 text-muted text-xs bg-surface/30">
            {filtered.length} de {products.length} productos
            {products.filter(p => p.stock <= p.minStock).length > 0 && (
              <span className="ml-3 text-red-500 font-semibold">
                · {products.filter(p => p.stock <= p.minStock).length} con stock bajo
              </span>
            )}
          </div>
        )}
      </div>

      <ProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} product={editProduct} />
      <CategoryModal isOpen={catModalOpen} onClose={() => setCatModalOpen(false)} />
    </div>
  )
}
