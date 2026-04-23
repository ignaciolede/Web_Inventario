import { motion } from 'framer-motion'
import Logo from '../ui/Logo'

export default function AuthCard({ subtitle, children, maxWidth = 'max-w-md' }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-primary/8  blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative w-full ${maxWidth}`}
      >
        <div className="bg-white rounded-3xl shadow-modal overflow-hidden">
          {/* Brand header */}
          <div className="bg-brand px-8 py-7 flex items-center gap-4">
            <Logo variant="icon" size="sm" animated={false} />
            <div>
              <div style={{ lineHeight: 1 }}>
                <span style={{ color: '#ffffff', fontWeight: 400, fontSize: 20, letterSpacing: '0.18em' }}>STOCK</span>
                <span style={{ color: '#e9d234', fontWeight: 900, fontSize: 20, letterSpacing: '0.06em' }}>-AR</span>
              </div>
              {subtitle && <p className="text-muted text-xs mt-1.5">{subtitle}</p>}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-7">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}
