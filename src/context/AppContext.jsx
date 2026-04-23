import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AppContext = createContext(null)

// ── Mappers ───────────────────────────────────────────────────────────────────

const toProduct = (r) => ({
  id: r.id, name: r.nombre, category: r.categoria, stock: r.stock,
  cost: Number(r.costo), salePrice: Number(r.precio), minStock: r.stock_minimo,
})
const toDbProduct = (p) => ({
  nombre: p.name, categoria: p.category, stock: Number(p.stock),
  costo: Number(p.cost), precio: Number(p.salePrice), stock_minimo: Number(p.minStock),
})
const toSale = (r) => ({
  id: r.id, date: r.fecha, total: Number(r.total),
  items: (r.venta_items || []).map(i => ({
    productId: i.producto_id, productName: i.nombre_producto,
    quantity: i.cantidad, unitPrice: Number(i.precio_unitario), subtotal: Number(i.subtotal),
  })),
})

// ─────────────────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [session,     setSession]     = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authPage,    setAuthPage]    = useState('login') // 'login'|'register'|'forgot'|'reset'

  // ── Data ──────────────────────────────────────────────────────────────────
  const [products,        setProducts]        = useState([])
  const [sales,           setSales]           = useState([])
  const [categories,      setCategories]      = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingSales,    setLoadingSales]     = useState(false)

  // ── UI ────────────────────────────────────────────────────────────────────
  const [currentPage,       setCurrentPage]       = useState('dashboard')
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false)

  // ── Computed ──────────────────────────────────────────────────────────────
  const isAuthenticated = !!session
  const isAdmin         = session?.user?.user_metadata?.role === 'admin'

  // ── Auth init + listener ──────────────────────────────────────────────────
  useEffect(() => {
    const fallback = setTimeout(() => setAuthLoading(false), 8000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'INITIAL_SESSION') {
        clearTimeout(fallback)
        const rememberMe    = localStorage.getItem('stockar_remember_me')
        const activeSession = sessionStorage.getItem('stockar_active_session')
        if (newSession && rememberMe === 'false' && !activeSession) {
          supabase.auth.signOut()
          setAuthLoading(false)
          return
        }
        setSession(newSession)
        setAuthLoading(false)
        return
      }
      if (event === 'PASSWORD_RECOVERY') setAuthPage('reset')
      setSession(newSession)
    })

    return () => {
      clearTimeout(fallback)
      subscription.unsubscribe()
    }
  }, [])

  // ── Fetch data when authenticated ─────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchSales()
      fetchCategories()
    } else {
      setProducts([])
      setSales([])
      setCategories([])
    }
  }, [isAuthenticated]) // eslint-disable-line

  // ── Auth methods ──────────────────────────────────────────────────────────
  const login = useCallback(async (email, password, rememberMe = true) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    localStorage.setItem('stockar_remember_me', String(rememberMe))
    if (!rememberMe) sessionStorage.setItem('stockar_active_session', '1')
    return { error: null }
  }, [])

  const register = useCallback(async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('stockar_remember_me')
    sessionStorage.removeItem('stockar_active_session')
    setCurrentPage('dashboard')
    setProducts([])
    setSales([])
  }, [])

  const sendPasswordReset = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    setAuthPage('login')
    return { error: null }
  }, [])

  // ── Data fetchers ─────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categorias').select('*').order('nombre')
    if (!error) setCategories(data ?? [])
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    const { data, error } = await supabase.from('productos').select('*').order('created_at')
    if (!error) setProducts((data ?? []).map(toProduct))
    setLoadingProducts(false)
  }, [])

  const fetchSales = useCallback(async () => {
    setLoadingSales(true)
    const { data, error } = await supabase
      .from('ventas').select('*, venta_items(*)').order('fecha', { ascending: false })
    if (!error) setSales((data ?? []).map(toSale))
    setLoadingSales(false)
  }, [])

  // ── Categories CRUD ───────────────────────────────────────────────────────
  const addCategory = useCallback(async (nombre) => {
    const { data, error } = await supabase.from('categorias').insert([{ nombre }]).select().single()
    if (error) return false
    setCategories(prev => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    return true
  }, [])

  const deleteCategory = useCallback(async (id) => {
    const { error } = await supabase.from('categorias').delete().eq('id', id)
    if (error) return false
    setCategories(prev => prev.filter(c => c.id !== id))
    return true
  }, [])

  // ── Products CRUD ─────────────────────────────────────────────────────────
  const addProduct = useCallback(async (product) => {
    const { data, error } = await supabase.from('productos').insert([toDbProduct(product)]).select().single()
    if (error) { console.error('addProduct error:', error); return false }
    setProducts(prev => [...prev, toProduct(data)])
    return true
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('productos').update(toDbProduct(updates)).eq('id', id).select().single()
    if (error) return false
    setProducts(prev => prev.map(p => p.id === id ? toProduct(data) : p))
    return true
  }, [])

  const deleteProduct = useCallback(async (id) => {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) return false
    setProducts(prev => prev.filter(p => p.id !== id))
    return true
  }, [])

  // ── Sales CRUD (stock managed by DB triggers) ─────────────────────────────
  const addSale = useCallback(async (items) => {
    const total = items.reduce((s, i) => s + i.subtotal, 0)
    const { data: venta, error: e1 } = await supabase
      .from('ventas').insert({ total, fecha: new Date().toISOString() }).select().single()
    if (e1 || !venta) return false
    const { error: e2 } = await supabase.from('venta_items').insert(
      items.map(i => ({ venta_id: venta.id, producto_id: i.productId, nombre_producto: i.productName, cantidad: i.quantity, precio_unitario: i.unitPrice, subtotal: i.subtotal }))
    )
    if (e2) { await supabase.from('ventas').delete().eq('id', venta.id); return false }
    await Promise.all([fetchProducts(), fetchSales()])
    return true
  }, [fetchProducts, fetchSales])

  const updateSale = useCallback(async (id, newItems) => {
    const { error: e1 } = await supabase.from('venta_items').delete().eq('venta_id', id)
    if (e1) return false
    const { error: e2 } = await supabase.from('venta_items').insert(
      newItems.map(i => ({ venta_id: id, producto_id: i.productId, nombre_producto: i.productName, cantidad: i.quantity, precio_unitario: i.unitPrice, subtotal: i.subtotal }))
    )
    if (e2) return false
    const total = newItems.reduce((s, i) => s + i.subtotal, 0)
    await supabase.from('ventas').update({ total }).eq('id', id)
    await Promise.all([fetchProducts(), fetchSales()])
    return true
  }, [fetchProducts, fetchSales])

  const deleteSale = useCallback(async (id) => {
    const { error } = await supabase.from('ventas').delete().eq('id', id)
    if (error) return false
    await Promise.all([fetchProducts(), fetchSales()])
    return true
  }, [fetchProducts, fetchSales])

  const lowStockProducts = useMemo(() => products.filter(p => p.stock <= p.minStock), [products])

  const value = {
    // auth
    session, authLoading, authPage, setAuthPage,
    isAuthenticated, isAdmin,
    login, register, logout, sendPasswordReset, updatePassword,
    // data
    products, addProduct, updateProduct, deleteProduct, loadingProducts,
    sales, addSale, updateSale, deleteSale, loadingSales,
    categories, addCategory, deleteCategory,
    // ui
    currentPage, setCurrentPage,
    sidebarCollapsed, setSidebarCollapsed,
    lowStockProducts,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
