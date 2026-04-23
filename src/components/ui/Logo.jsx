import { motion } from 'framer-motion'

/**
 * Isotipo: 3 rectángulos apilados en pirámide invertida (abstracción de cajas/inventario).
 * El trazo se dibuja secuencialmente al montar cuando animated=true.
 */
function Isotipo({ size = 40, animated = true }) {
  const stroke = '#e9d234'
  const sw     = 2.4

  const rects = [
    { x: 12, y: 2,  width: 16, height: 10, rx: 2 }, // top (más angosto)
    { x: 7,  y: 15, width: 26, height: 10, rx: 2 }, // medio
    { x: 2,  y: 28, width: 36, height: 10, rx: 2 }, // base (más ancho)
  ]

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
    >
      {rects.map((r, i) => (
        <motion.rect
          key={i}
          x={r.x} y={r.y}
          width={r.width} height={r.height}
          rx={r.rx}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            animated
              ? {
                  pathLength: { duration: 0.55, delay: i * 0.18, ease: [0.4, 0, 0.2, 1] },
                  opacity:    { duration: 0.15, delay: i * 0.18 },
                }
              : { duration: 0 }
          }
        />
      ))}
    </motion.svg>
  )
}

/**
 * Logo completo: isotipo + wordmark "STOCK-AR"
 *
 * Props:
 *   variant  — 'full' | 'icon'
 *   size     — 'sm' | 'md' | 'lg'
 *   onDark   — true = texto blanco (sidebar/login oscuro), false = texto #221407
 *   animated — true = paths se dibujan al montar
 */
export default function Logo({
  variant  = 'full',
  size     = 'md',
  onDark   = true,
  animated = true,
}) {
  const iconPx   = { sm: 28, md: 36, lg: 54 }[size] ?? 36
  const textPx   = { sm: 13, md: 16, lg: 24 }[size] ?? 16
  const stockClr = onDark ? '#ffffff' : '#221407'

  if (variant === 'icon') {
    return <Isotipo size={iconPx} animated={animated} />
  }

  return (
    <div className="flex items-center gap-2.5 select-none">
      <Isotipo size={iconPx} animated={animated} />
      <div style={{ lineHeight: 1 }}>
        <span style={{ color: stockClr, fontWeight: 400,   fontSize: textPx, letterSpacing: '0.18em' }}>
          STOCK
        </span>
        <span style={{ color: '#e9d234', fontWeight: 900, fontSize: textPx, letterSpacing: '0.06em' }}>
          -AR
        </span>
      </div>
    </div>
  )
}
