import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Scissors, LayoutDashboard, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg" style={{ fontFamily: 'Syne' }}>
        <Scissors size={20} className="text-[#6c63ff]" />
        <span>link<span className="text-[#6c63ff]">snip</span></span>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/dashboard">
              <button className="btn-ghost flex items-center gap-2 text-sm py-1.5 px-3">
                <LayoutDashboard size={15} /> Dashboard
              </button>
            </Link>
            <button onClick={handleSignOut} className="btn-ghost flex items-center gap-2 text-sm py-1.5 px-3">
              <LogOut size={15} /> Sign Out
            </button>
          </>
        ) : (
          <Link to="/auth">
            <button className="btn-primary flex items-center gap-2 text-sm py-1.5 px-4">
              <LogIn size={15} /> Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}
