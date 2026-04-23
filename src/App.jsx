import { AppProvider, useApp } from './context/AppContext'
import LoginPage        from './components/auth/LoginPage'
import RegisterPage     from './components/auth/RegisterPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage  from './components/auth/ResetPasswordPage'
import Layout           from './components/layout/Layout'
import Logo             from './components/ui/Logo'

function Splash() {
  return (
    <div className="min-h-screen bg-brand flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Logo variant="icon" size="lg" animated={true} />
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { isAuthenticated, authLoading, authPage } = useApp()

  if (authLoading) return <Splash />
  if (isAuthenticated) return <Layout />

  switch (authPage) {
    case 'register': return <RegisterPage />
    case 'forgot':   return <ForgotPasswordPage />
    case 'reset':    return <ResetPasswordPage />
    default:         return <LoginPage />
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
