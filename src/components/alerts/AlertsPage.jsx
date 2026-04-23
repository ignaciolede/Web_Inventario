import { motion } from 'framer-motion'
import { AlertTriangle, Package, CheckCircle, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AlertsPage() {
  const { lowStockProducts, products, setCurrentPage } = useApp()
  const okProducts = products.filter(p => p.stock > p.minStock)

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-card">
          <div className="flex items-center gap-2.5 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">Stock Crítico</span>
          </div>
          <p className="text-3xl font-bold text-red-500">{lowStockProducts.length}</p>
          <p className="text-muted text-xs mt-0.5">productos requieren atención</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-card">
          <div className="flex items-center gap-2.5 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">Stock OK</span>
          </div>
          <p className="text-3xl font-bold text-emerald-500">{okProducts.length}</p>
          <p className="text-muted text-xs mt-0.5">productos con stock suficiente</p>
        </div>
      </div>

      {/* Alert list */}
      {lowStockProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-14 text-center border border-muted/10 shadow-card"
        >
          <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
          <h3 className="font-bold text-brand text-lg">Todo en orden</h3>
          <p className="text-muted text-sm mt-1.5">Ningún producto está por debajo del stock mínimo</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide px-1">
            Productos con stock bajo o agotado
          </p>
          {lowStockProducts.map((p, i) => {
            const pct = p.minStock > 0 ? Math.round((p.stock / p.minStock) * 100) : 0
            const barColor = p.stock === 0 ? 'bg-red-500' : pct < 50 ? 'bg-orange-400' : 'bg-yellow-400'

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-5 border border-red-200 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-brand truncate">{p.name}</p>
                      <p className="text-muted text-xs mt-0.5">{p.category}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-2xl font-bold ${p.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                      {p.stock}
                    </p>
                    <p className="text-muted text-xs">/ mín. {p.minStock}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted mb-1.5">
                    <span>Nivel de stock</span>
                    <span className="font-semibold">{pct}% del mínimo</span>
                  </div>
                  <div className="h-1.5 bg-muted/15 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ delay: i * 0.07 + 0.2, duration: 0.5 }}
                      className={`h-full rounded-full ${barColor}`}
                    />
                  </div>
                </div>

                {p.stock === 0 && (
                  <p className="mt-3 text-xs font-semibold text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Producto agotado
                  </p>
                )}
              </motion.div>
            )
          })}

          <button
            onClick={() => setCurrentPage('products')}
            className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-primary transition-colors mt-2"
          >
            Ir a Productos para actualizar stock
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
