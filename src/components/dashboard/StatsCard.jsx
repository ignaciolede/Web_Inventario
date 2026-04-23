import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, icon: Icon, colorBg, colorIcon, change, positive, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl p-5 shadow-card border border-muted/10 hover:shadow-md transition-shadow"
    >
      <div className={`inline-flex p-2.5 rounded-xl ${colorBg} mb-4`}>
        <Icon className={`w-5 h-5 ${colorIcon}`} />
      </div>
      <p className="text-muted text-sm mb-1">{title}</p>
      <p className="text-brand text-2xl font-bold tracking-tight">{value}</p>
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{change}</span>
      </div>
    </motion.div>
  )
}
