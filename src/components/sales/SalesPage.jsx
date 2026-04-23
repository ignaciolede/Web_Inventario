import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ShoppingCart, Calendar, Package, DollarSign, Edit2, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import SaleModal from './SaleModal'
import { SkeletonRow } from '../ui/Skeleton'

export default function SalesPage() {
  const { sales, deleteSale, loadingSales, isAdmin } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editSale, setEditSale]   = useState(null)

  const totalRevenue = sales.reduce((s, v) => s + v.total, 0)

  const handleNew    = ()     => { setEditSale(null); setModalOpen(true) }
  const handleEdit   = (sale) => { setEditSale(sale); setModalOpen(true) }
  const handleClose  = ()     => { setModalOpen(false); setEditSale(null) }
  const handleDelete = async (sale) => {
    if (window.confirm(`¿Eliminar esta venta de $${sale.total.toLocaleString('es-AR')}?\nEl stock será restaurado automáticamente.`)) {
      await deleteSale(sale.id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl px-4 py-2.5 border border-muted/10 shadow-card text-sm">
            <span className="text-muted">Registradas: </span>
            <span className="font-bold text-brand">{loadingSales ? '…' : sales.length}</span>
          </div>
          <div className="bg-white rounded-xl px-4 py-2.5 border border-muted/10 shadow-card text-sm flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-muted" />
            <span className="text-muted">Ingresos totales: </span>
            <span className="font-bold text-brand">
              {loadingSales ? '…' : `$${totalRevenue.toLocaleString('es-AR')}`}
            </span>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-primary hover:bg-primary-light text-brand font-bold px-4 py-2.5 rounded-xl transition-colors text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva Venta
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-muted/10 shadow-card overflow-hidden">
        {!loadingSales && sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <ShoppingCart className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-semibold text-brand">Sin ventas registradas</p>
            <p className="text-sm mt-1">Registra tu primera venta</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted/10 bg-surface/60">
                  <th className="text-left px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Productos</th>
                  <th className="text-right px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Unidades</th>
                  <th className="text-right px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Total</th>
                  {isAdmin && <th className="text-center px-5 py-3.5 text-muted text-xs font-semibold uppercase tracking-wider">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {loadingSales
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={isAdmin ? 5 : 4} />)
                  : (
                    <AnimatePresence initial={false}>
                      {sales.map((sale, i) => (
                        <motion.tr
                          key={sale.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-muted/6 last:border-0 hover:bg-surface/40 transition-colors"
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-brand text-sm">
                              <Calendar className="w-3.5 h-3.5 text-muted shrink-0" />
                              {new Date(sale.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                              <span className="text-muted text-xs">
                                {new Date(sale.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {sale.items.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-surface text-brand text-xs px-2.5 py-1 rounded-full border border-muted/15 font-medium">
                                  <Package className="w-3 h-3 text-muted" />
                                  {item.productName} ×{item.quantity}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right text-muted text-sm whitespace-nowrap">
                            {sale.items.reduce((s, i) => s + i.quantity, 0)} u.
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <span className="font-bold text-brand">${sale.total.toLocaleString('es-AR')}</span>
                          </td>
                          {isAdmin && (
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => handleEdit(sale)} title="Editar" className="p-1.5 rounded-lg hover:bg-blue-50 text-muted hover:text-blue-500 transition-colors">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(sale)} title="Eliminar" className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SaleModal isOpen={modalOpen} onClose={handleClose} sale={editSale} />
    </div>
  )
}
