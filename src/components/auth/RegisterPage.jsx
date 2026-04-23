import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, ArrowLeft, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AuthCard from './AuthCard'

const inputCls = 'w-full px-4 py-3 rounded-xl border border-muted/25 bg-surface text-brand placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all text-sm'

export default function RegisterPage() {
  const { register, setAuthPage } = useApp()
  const [fullName,   setFullName]   = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    const { error } = await register(email, password, fullName)
    setLoading(false)

    if (error) {
      setError(
        error.includes('already registered') ? 'Este email ya está registrado.' : error
      )
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <AuthCard subtitle="Verificación de cuenta">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-brand font-bold text-xl mb-2">¡Revisá tu email!</h2>
          <p className="text-muted text-sm leading-relaxed">
            Enviamos un enlace de confirmación a <span className="font-semibold text-brand">{email}</span>.
            <br />Hacé clic en el enlace para activar tu cuenta.
          </p>
          <div className="mt-6 p-4 bg-surface rounded-xl text-xs text-muted text-left space-y-1">
            <p className="font-semibold text-brand">¿No llegó el mail?</p>
            <p>Revisá la carpeta de spam o esperá unos minutos.</p>
          </div>
          <button
            onClick={() => setAuthPage('login')}
            className="mt-6 w-full bg-primary hover:bg-primary-light text-brand font-bold py-3 rounded-xl transition-all text-sm"
          >
            Volver al inicio de sesión
          </button>
        </motion.div>
      </AuthCard>
    )
  }

  return (
    <AuthCard subtitle="Creá tu cuenta">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div>
          <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">Nombre completo</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Juan Pérez"
            className={inputCls}
            required
            autoFocus
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputCls}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mín. 6 caracteres"
            className={inputCls}
            required
          />
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">Confirmar contraseña</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repetí la contraseña"
            className={inputCls}
            required
          />
        </div>

        {/* Role notice */}
        <div className="bg-surface rounded-xl px-4 py-3 text-xs text-muted border border-muted/15">
          Las cuentas nuevas tienen acceso de <span className="font-semibold text-brand">solo lectura</span>.
          Un administrador puede otorgar permisos adicionales.
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-light text-brand font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-brand/25 border-t-brand rounded-full animate-spin" />
            : <><UserPlus className="w-4 h-4" />Crear Cuenta</>
          }
        </button>
      </form>

      {/* Back to login */}
      <button
        onClick={() => setAuthPage('login')}
        className="mt-5 flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio de sesión
      </button>
    </AuthCard>
  )
}
