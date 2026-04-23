import { Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const TITLES = {
  dashboard: 'Dashboard',
  products:  'Productos',
  sales:     'Ventas',
  alerts:    'Alertas de Stock',
}

export default function Header() {
  const { currentPage, lowStockProducts, setCurrentPage, session, isAdmin } = useApp()

  const meta     = session?.user?.user_metadata ?? {}
  const userName = meta.full_name || session?.user?.email || 'Usuario'
  const userRole = isAdmin ? 'Administrador' : (meta.role ? meta.role.charAt(0).toUpperCase() + meta.role.slice(1) : 'Usuario')
  const initial  = userName.charAt(0).toUpperCase()

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header className="bg-white border-b border-muted/15 px-6 py-4 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-brand">{TITLES[currentPage] ?? 'Dashboard'}</h1>
        <p className="text-muted text-xs capitalize mt-0.5">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentPage('alerts')}
          className="relative p-2.5 rounded-xl hover:bg-surface transition-colors"
          title="Alertas de stock"
        >
          <Bell className="w-5 h-5 text-muted" />
          {lowStockProducts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        <div className="flex items-center gap-2.5 bg-surface rounded-xl px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-brand font-bold text-sm">{initial}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-brand font-semibold text-sm leading-none">{userName}</p>
            <p className="text-muted text-xs mt-0.5">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
