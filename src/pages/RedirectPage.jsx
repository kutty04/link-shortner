import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isExpired, detectDevice, detectBrowser, detectOS } from '../lib/utils'

export default function RedirectPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [needPassword, setNeedPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [link, setLink] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('short_code', code)
        .eq('is_active', true)
        .maybeSingle()

      if (!data) { navigate('/'); return }
      if (isExpired(data.expires_at)) { navigate('/'); return }

      if (data.password_hash) {
        setLink(data)
        setNeedPassword(true)
      } else {
        await logClick(data.id)
        window.location.href = data.original_url
      }
    })()
  }, [code])

  const logClick = async (linkId) => {
    await supabase.from('clicks').insert({
      link_id: linkId,
      device_type: detectDevice(),
      browser: detectBrowser(),
      os: detectOS(),
      referrer: document.referrer || null,
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (btoa(password) === link.password_hash) {
      await logClick(link.id)
      window.location.href = link.original_url
    } else {
      setError('Incorrect password')
    }
  }

  if (needPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card w-full max-w-sm text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h2 className="font-bold text-lg mb-1">Protected Link</h2>
          <p className="text-sm text-[var(--muted)] mb-4">Enter the password to continue</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full">Continue →</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6c63ff] border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-[var(--muted)]">Redirecting...</p>
      </div>
    </div>
  )
}
