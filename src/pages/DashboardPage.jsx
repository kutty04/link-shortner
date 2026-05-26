import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLinks } from '../hooks/useLinks'
import Navbar from '../components/Navbar'
import ShortenForm from '../components/ShortenForm'
import LinkCard from '../components/LinkCard'
import { Search, Link2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { links, loading, deleteLink, toggleLink } = useLinks()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  if (!authLoading && !user) {
    navigate('/auth')
    return null
  }

  const filtered = links.filter(l =>
    !search ||
    l.short_code.includes(search) ||
    l.original_url.toLowerCase().includes(search.toLowerCase()) ||
    l.title?.toLowerCase().includes(search.toLowerCase())
  )

  const totalClicks = links.reduce((acc, l) => acc + (l.clicks?.[0]?.count ?? 0), 0)

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold mb-1" style={{ fontFamily: 'Syne' }}>Dashboard</h1>
          <p className="text-sm text-[var(--muted)]">{user?.email}</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:mb-8">
          <div className="card text-center">
            <p className="text-2xl sm:text-3xl font-extrabold mono text-[#6c63ff]">{links.length}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Total Links</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl sm:text-3xl font-extrabold mono text-[#ff6584]">{totalClicks}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Total Clicks</p>
          </div>
        </div>

        {/* Create new */}
        <ShortenForm />

        {/* Link list */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                className="input-field pl-9 text-sm"
                placeholder="Search links..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse h-24 opacity-40" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card text-center py-12">
              <Link2 size={32} className="text-[var(--muted)] mx-auto mb-3" />
              <p className="text-[var(--muted)] text-sm">
                {search ? 'No links match your search' : 'No links yet — shorten one above!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(link => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={deleteLink}
                  onToggle={toggleLink}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
