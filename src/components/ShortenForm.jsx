import { useState } from 'react'
import { useLinks } from '../hooks/useLinks'
import { buildUTMUrl } from '../lib/utils'
import { Link2, Zap, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react'
import { QRCodeSVG as QRCode } from 'qrcode.react';

const BASE = window.location.origin

export default function ShortenForm() {
  const { createLink } = useLinks()
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [title, setTitle] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [password, setPassword] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showUTM, setShowUTM] = useState(false)
  const [utm, setUtm] = useState({ source: '', medium: '', campaign: '', term: '', content: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const shortUrl = result ? `${BASE}/${result.short_code}` : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let finalUrl = url
      if (showUTM && (utm.source || utm.medium || utm.campaign)) {
        finalUrl = buildUTMUrl(url, utm)
      }
      const data = await createLink({
        originalUrl: finalUrl,
        customAlias: alias || undefined,
        title: title || undefined,
        expiresAt: expiresAt || undefined,
        password: password || undefined,
      })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setResult(null); setUrl(''); setAlias(''); setTitle('')
    setExpiresAt(''); setPassword(''); setUtm({ source: '', medium: '', campaign: '', term: '', content: '' })
  }

  if (result) {
    return (
      <div className="card accent-glow w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-sm font-bold mono">LINK CREATED</span>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <span className="mono text-[#6c63ff] flex-1 truncate text-sm">{shortUrl}</span>
          <button onClick={copy} className="p-1.5 rounded hover:bg-[#6c63ff]/20 transition-colors">
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-[var(--muted)]" />}
          </button>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-[#6c63ff]/20 transition-colors">
            <ExternalLink size={16} className="text-[var(--muted)]" />
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="flex-1">
            <p className="text-xs text-[var(--muted)] mb-1">Original URL</p>
            <p className="text-xs text-[var(--text)] truncate mono">{result.original_url}</p>
          </div>
          <div className="p-2 bg-white rounded-lg flex-shrink-0">
            <QRCode value={shortUrl} size={80} />
          </div>
        </div>

        <button onClick={reset} className="btn-primary w-full mt-4 text-sm">
          Shorten Another Link
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card w-full">
      <div className="flex items-center gap-2 mb-5">
        <Link2 size={18} className="text-[#6c63ff]" />
        <span className="font-bold text-sm">Shorten a URL</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          className="input-field flex-1 min-w-0"
          placeholder="https://your-long-url.com/goes-here"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
          type="url"
        />
        <button type="submit" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto" disabled={loading}>
          <Zap size={15} />
          {loading ? '...' : 'Snip'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {/* Advanced options */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-2"
      >
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Advanced options
      </button>

      {showAdvanced && (
        <div className="space-y-3 p-3 rounded-lg mb-3" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Custom alias</label>
              <input className="input-field text-sm py-1.5" placeholder="my-link" value={alias} onChange={e => setAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))} />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Link title</label>
              <input className="input-field text-sm py-1.5" placeholder="Campaign name" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Expires at</label>
              <input className="input-field text-sm py-1.5" type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Password protect</label>
              <input className="input-field text-sm py-1.5" type="password" placeholder="Optional" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          {/* UTM Builder */}
          <button
            type="button"
            onClick={() => setShowUTM(!showUTM)}
            className="flex items-center gap-1 text-xs text-[#6c63ff] hover:text-[#7c74ff] transition-colors"
          >
            {showUTM ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            UTM Campaign Builder
          </button>

          {showUTM && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['source', 'medium', 'campaign', 'term', 'content'].map(k => (
                <div key={k}>
                  <label className="text-xs text-[var(--muted)] mb-1 block capitalize">utm_{k}</label>
                  <input
                    className="input-field text-sm py-1.5"
                    placeholder={k === 'source' ? 'google' : k === 'medium' ? 'cpc' : ''}
                    value={utm[k]}
                    onChange={e => setUtm(p => ({ ...p, [k]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  )
}
