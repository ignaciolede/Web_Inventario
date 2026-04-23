import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AuthCard from './AuthCard'

const inputCls = 'w-full px-4 py-3 rounded-xl border border-muted/25 bg-surface text-brand placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all text-sm'

export default function LoginPage() {
  const { login, setAuthPage } = useApp()
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe,   setRememberMe]   = useState(true)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await login(email, password, rememberMe)
    if (error) {
      setError(
        error.includes('Invalid login')  ? 'Email o contraseña incorrectos.' :
        error.includes('Email not conf') ? 'Debés confirmar tu email antes de ingresar.' :
        error
      )
      setLoading(false)
    }
  }

  return (
    <AuthCard subtitle="Iniciá sesión para continuar">
      <form onSubmit={handleSubmit} className="space-y-5">
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
            autoFocus
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-brand uppercase tracking-wide">Contraseña</label>
            <button
              type="button"
              onClick={() => setAuthPage('forgot')}
              className="text-xs text-muted hover:text-primary transition-colors font-medium"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputCls} pr-12`}
              required
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

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'border-muted/40 group-hover:border-muted'}`}>
              {rememberMe && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#221407" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </div>
          <span className="text-sm text-muted group-hover:text-brand transition-colors">Mantener sesión iniciada</span>
        </label>

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
            : <><LogIn className="w-4 h-4" />Iniciar Sesión</>
          }
        </button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-muted mt-6">
        ¿No tenés cuenta?{' '}
        <button
          onClick={() => setAuthPage('register')}
          className="font-bold text-brand hover:text-primary transition-colors"
        >
          Crear cuenta
        </button>
      </p>
    </AuthCard>
  )
}
