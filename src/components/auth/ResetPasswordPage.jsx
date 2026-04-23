import { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AuthCard from './AuthCard'

const inputCls = 'w-full px-4 py-3 rounded-xl border border-muted/25 bg-surface text-brand placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all text-sm'

export default function ResetPasswordPage() {
  const { updatePassword, setAuthPage } = useApp()
  const [password,     setPassword]     = useState('')
  const [confirm,      setConfirm]      = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (password !== confirm)  { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) setError(error)
    else setSuccess(true)
  }

  if (success) {
    return (
      <AuthCard subtitle="Contraseña actualizada">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-brand font-bold text-xl mb-2">¡Contraseña actualizada!</h2>
          <p className="text-muted text-sm">Tu contraseña fue cambiada exitosamente.</p>
          <button
            onClick={() => setAuthPage('login')}
            className="mt-6 w-full bg-primary hover:bg-primary-light text-brand font-bold py-3 rounded-xl transition-all text-sm"
          >
            Iniciar sesión
          </button>
        </motion.div>
      </AuthCard>
    )
  }

  return (
    <AuthCard subtitle="Crear nueva contraseña">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mín. 6 caracteres"
              className={`${inputCls} pr-12`}
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-brand transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">Confirmar contraseña</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repetí la contraseña"
            className={inputCls}
            required
          />
        </div>

        {/* Strength indicator */}
        {password && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    password.length >= i * 3
                      ? password.length >= 10 ? 'bg-emerald-400' : 'bg-primary'
                      : 'bg-muted/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted">
              {password.length < 6  ? 'Muy corta' :
               password.length < 8  ? 'Débil' :
               password.length < 10 ? 'Media' : 'Fuerte'}
            </p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-light text-brand font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-brand/25 border-t-brand rounded-full animate-spin" />
            : <><KeyRound className="w-4 h-4" />Guardar contraseña</>
          }
        </button>
      </form>
    </AuthCard>
  )
}
