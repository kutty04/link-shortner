import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import RedirectPage from './pages/RedirectPage'
import AuthPage from './pages/AuthPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics/:id" element={<AnalyticsPage />} />
          <Route path="/:code" element={<RedirectPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
