import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../../context/AppContext'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-brand text-white rounded-xl px-3.5 py-2.5 text-sm shadow-lg">
      <p className="font-semibold mb-0.5">{label}</p>
      <p className="text-primary font-bold">${payload[0].value.toLocaleString('es-AR')}</p>
    </div>
  )
}

export default function SalesChart() {
  const { sales } = useApp()

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayStr = d.toDateString()
    const total = sales
      .filter(s => new Date(s.date).toDateString() === dayStr)
      .reduce((sum, s) => sum + s.total, 0)
    return { day: DAY_NAMES[d.getDay()], ventas: total }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white rounded-2xl p-5 shadow-card border border-muted/10 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-brand">Ventas — Últimos 7 días</h3>
        <span className="text-xs text-muted bg-surface px-2.5 py-1 rounded-full">
          Total: ${chartData.reduce((s, d) => s + d.ventas, 0).toLocaleString('es-AR')}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={chartData} barSize={28} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#837870" strokeOpacity={0.12} vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#837870', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#837870', fontSize: 11 }} tickFormatter={v => `$${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3eae8', radius: 6 }} />
          <Bar dataKey="ventas" fill="#e9d234" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
