import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import DashboardPage from '../dashboard/DashboardPage'
import ProductsPage from '../products/ProductsPage'
import SalesPage from '../sales/SalesPage'
import AlertsPage from '../alerts/AlertsPage'
import { useApp } from '../../context/AppContext'

const PAGES = {
  dashboard: DashboardPage,
  products:  ProductsPage,
  sales:     SalesPage,
  alerts:    AlertsPage,
}

export default function Layout() {
  const { currentPage } = useApp()
  const Page = PAGES[currentPage] ?? DashboardPage

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Page />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
