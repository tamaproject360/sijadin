import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Lenis from 'lenis'

// Layout
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'
import DraftEditor from './pages/DraftEditor'
import VersionHistory from './pages/VersionHistory'
import ExportPage from './pages/ExportPage'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      duration: 1.2,
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="reports/:id/draft" element={<DraftEditor />} />
          <Route path="reports/:id/versions" element={<VersionHistory />} />
          <Route path="reports/:id/export" element={<ExportPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
