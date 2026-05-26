import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Scissors, LayoutDashboard, LogOut, LogIn, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef(null)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        // Also make sure we're not clicking the hamburger button itself
        if (!e.target.closest('[data-hamburger]')) {
          setMenuOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [menuOpen])

  return (
    <>
      <nav className="glass sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-white font-bold text-lg"
          style={{ fontFamily: 'Syne' }}
        >
          <Scissors size={20} className="text-[#6c63ff]" />
          <span>link<span className="text-[#6c63ff]">snip</span></span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-3">
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

        {/* Mobile hamburger button */}
        <button
          data-hamburger
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{ background: menuOpen ? 'var(--surface2)' : 'transparent', border: '1px solid var(--border)' }}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        className="sm:hidden fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] flex flex-col"
        style={{
          background: 'var(--surface, #13131a)',
          borderLeft: '1px solid var(--border)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: menuOpen ? '-8px 0 32px rgba(0,0,0,0.4)' : 'none',
        }}
        aria-hidden={!menuOpen}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-white font-bold text-lg"
            style={{ fontFamily: 'Syne' }}
          >
            <Scissors size={18} className="text-[#6c63ff]" />
            <span>link<span className="text-[#6c63ff]">snip</span></span>
          </Link>
          <button
            onClick={closeMenu}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="flex flex-col gap-2 px-4 py-6 flex-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ background: 'var(--card-bg, rgba(255,255,255,0.04))', border: '1px solid var(--border)' }}
              >
                <LayoutDashboard size={16} className="text-[#6c63ff]" />
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left w-full"
                style={{ background: 'var(--card-bg, rgba(255,255,255,0.04))', border: '1px solid var(--border)' }}
              >
                <LogOut size={16} className="text-red-400" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-center justify-center btn-primary"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}
        </nav>

        {/* Drawer footer */}
        {user && (
          <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
          </div>
        )}
      </div>
    </>
  )
}
