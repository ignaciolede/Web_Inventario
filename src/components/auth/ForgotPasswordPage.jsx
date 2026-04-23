import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, ArrowLeft, MailCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AuthCard from './AuthCard'

const inputCls = 'w-full px-4 py-3 rounded-xl border border-muted/25 bg-surface text-brand placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all text-sm'

export default function ForgotPasswordPage() {
  const { sendPasswordReset, setAuthPage } = useApp()
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await sendPasswordReset(email)
    setLoading(false)
    if (error) setError(error)
    else setSuccess(true)
  }

  if (success) {
    return (
      <AuthCard subtitle="Recuperar contraseña">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <MailCheck className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-brand font-bold text-xl mb-2">Email enviado</h2>
          <p className="text-muted text-sm leading-relaxed">
            Si existe una cuenta con <span className="font-semibold text-brand">{email}</span>,
            recibirás un enlace para restablecer tu contraseña.
          </p>
          <div className="mt-5 p-4 bg-surface rounded-xl text-xs text-muted text-left space-y-1">
            <p className="font-semibold text-brand">Próximos pasos</p>
            <p>1. Revisá tu bandeja de entrada (y spam).</p>
            <p>2. Hacé clic en el enlace del email.</p>
            <p>3. Ingresá tu nueva contraseña.</p>
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
    <AuthCard subtitle="Recuperar contraseña">
      <p className="text-muted text-sm mb-6">
        Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand mb-1.5 uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputCls}
            required
            autoFocus
          />
        </div>

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
            : <><Send className="w-4 h-4" />Enviar enlace</>
          }
        </button>
      </form>

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
