import { DollarSign, TrendingUp, Package, AlertTriangle, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import StatsCard from './StatsCard'
import SalesChart from './SalesChart'
import { SkeletonCard, SkeletonChart } from '../ui/Skeleton'

export default function DashboardPage() {
  const { products, sales, lowStockProducts, loadingProducts, loadingSales } = useApp()

  const inventoryValue   = products.reduce((s, p) => s + p.cost * p.stock, 0)
  const estimatedProfit  = products.reduce((s, p) => s + (p.salePrice - p.cost) * p.stock, 0)

  const stats = [
    {
      title: 'Valor del Inventario',
      value: `$${inventoryValue.toLocaleString('es-AR')}`,
      icon: DollarSign,
      colorBg: 'bg-blue-50',
      colorIcon: 'text-blue-500',
      change: 'Costo total en stock',
      positive: true,
    },
    {
      title: 'Ganancia Estimada',
      value: `$${estimatedProfit.toLocaleString('es-AR')}`,
      icon: TrendingUp,
      colorBg: 'bg-emerald-50',
      colorIcon: 'text-emerald-500',
      change: 'Si se vende todo el stock',
      positive: true,
    },
    {
      title: 'Total Productos',
      value: products.length,
      icon: Package,
      colorBg: 'bg-primary/15',
      colorIcon: 'text-yellow-600',
      change: `${products.filter(p => p.stock > 0).length} con stock disponible`,
      positive: true,
    },
    {
      title: 'Stock Crítico',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      colorBg: lowStockProducts.length > 0 ? 'bg-red-50' : 'bg-emerald-50',
      colorIcon: lowStockProducts.length > 0 ? 'text-red-500' : 'text-emerald-500',
      change: lowStockProducts.length > 0 ? 'Productos requieren reposición' : 'Todo en orden',
      positive: lowStockProducts.length === 0,
    },
  ]

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loadingProducts
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s, i) => <StatsCard key={s.title} {...s} delay={i * 0.08} />)
        }
      </div>

      {/* Chart + recent sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {loadingSales ? <SkeletonChart /> : <SalesChart />}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-muted/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <ShoppingCart className="w-4 h-4 text-muted" />
            <h3 className="font-bold text-brand">Ventas Recientes</h3>
          </div>

          {loadingSales ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2.5 border-b border-muted/10 last:border-0">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 animate-pulse rounded bg-muted/15" />
                    <div className="h-3 w-20 animate-pulse rounded bg-muted/10" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted/15" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 6).map(sale => (
                <div key={sale.id} className="flex items-center justify-between py-2.5 border-b border-muted/10 last:border-0">
                  <div>
                    <p className="text-brand text-sm font-medium">
                      {sale.items.length} producto{sale.items.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-muted text-xs mt-0.5">
                      {new Date(sale.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="font-bold text-brand text-sm">${sale.total.toLocaleString('es-AR')}</span>
                </div>
              ))}
              {sales.length === 0 && (
                <p className="text-muted text-sm text-center py-8">Sin ventas registradas</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
