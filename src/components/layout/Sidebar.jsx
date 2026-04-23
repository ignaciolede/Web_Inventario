import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingCart, Bell, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Logo from '../ui/Logo'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products',  label: 'Productos',  icon: Package },
  { id: 'sales',     label: 'Ventas',     icon: ShoppingCart },
  { id: 'alerts',    label: 'Alertas',    icon: Bell },
]

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed, logout, lowStockProducts } = useApp()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      className="bg-brand h-screen flex flex-col overflow-hidden shrink-0 relative z-10"
    >
      {/* Logo row */}
      <div className="flex items-center px-4 py-5 border-b border-white/10 min-h-[72px]">
        {/* Always show the isotipo; fade text in/out with collapse */}
        <Logo variant="icon" size="sm" animated={false} />

        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-2.5 leading-none select-none whitespace-nowrap"
            >
              <span style={{ color: '#ffffff', fontWeight: 400, fontSize: 14, letterSpacing: '0.18em' }}>STOCK</span>
              <span style={{ color: '#e9d234', fontWeight: 900, fontSize: 14, letterSpacing: '0.06em' }}>-AR</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setSidebarCollapsed(v => !v)}
          className="ml-auto p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id
          const isAlerts = id === 'alerts'
          const badge = isAlerts ? lowStockProducts.length : 0

          return (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              title={sidebarCollapsed ? label : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${active ? 'bg-primary text-brand' : 'text-muted hover:text-white hover:bg-white/10'}
              `}
            >
              <div className="relative shrink-0">
                <Icon className="w-5 h-5" />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>

              <AnimatePresence initial={false}>
                {!sidebarCollapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap flex-1 text-left"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              {!sidebarCollapsed && badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0"
                >
                  {badge}
                </motion.span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          title={sidebarCollapsed ? 'Cerrar Sesión' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.span
                key="logout-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
