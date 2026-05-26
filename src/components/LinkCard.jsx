import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check, Trash2, BarChart2, Power, ExternalLink, Lock, Clock } from 'lucide-react'
import { timeAgo, isExpired } from '../lib/utils'
import QRCode from 'qrcode.react'

const BASE = window.location.origin

export default function LinkCard({ link, onDelete, onToggle }) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const navigate = useNavigate()

  const shortUrl = `${BASE}/${link.short_code}`
  const expired = isExpired(link.expires_at)
  const clickCount = link.clicks?.[0]?.count ?? 0

  const copy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`card transition-all duration-200 hover:border-[var(--accent)] ${!link.is_active || expired ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {link.title && (
            <p className="font-bold text-sm mb-1 truncate">{link.title}</p>
          )}
          <div className="flex items-center gap-2 mb-1">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="mono text-[#6c63ff] text-sm hover:underline truncate">
              {shortUrl.replace('https://', '')}
            </a>
            <button onClick={copy} className="p-1 rounded hover:bg-[#6c63ff]/20 transition-colors flex-shrink-0">
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-[var(--muted)]" />}
            </button>
            <a href={shortUrl} target="_blank" rel="noreferrer" className="flex-shrink-0">
              <ExternalLink size={13} className="text-[var(--muted)]" />
            </a>
          </div>
          <p className="text-xs text-[var(--muted)] truncate mono">{link.original_url}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
        {/* Stats */}
        <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
          <BarChart2 size={12} />
          <span className="font-bold text-[var(--text)] mono">{clickCount}</span> clicks
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
          <Clock size={12} />
          {timeAgo(link.created_at)}
        </div>
        {link.password_hash && (
          <span className="tag" style={{ background: 'rgba(255, 101, 132, 0.15)', color: '#ff6584' }}>
            <Lock size={9} /> locked
          </span>
        )}
        {expired && (
          <span className="tag" style={{ background: 'rgba(255, 160, 0, 0.15)', color: '#ffa000' }}>
            expired
          </span>
        )}
        {!link.is_active && (
          <span className="tag" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--muted)' }}>
            off
          </span>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-1.5 rounded hover:bg-[var(--surface2)] transition-colors text-xs text-[var(--muted)]"
            title="QR Code"
          >
            QR
          </button>
          <button
            onClick={() => navigate(`/analytics/${link.id}`)}
            className="p-1.5 rounded hover:bg-[var(--surface2)] transition-colors"
            title="Analytics"
          >
            <BarChart2 size={14} className="text-[#6c63ff]" />
          </button>
          <button
            onClick={() => onToggle(link.id, link.is_active)}
            className="p-1.5 rounded hover:bg-[var(--surface2)] transition-colors"
            title={link.is_active ? 'Disable' : 'Enable'}
          >
            <Power size={14} className={link.is_active ? 'text-green-400' : 'text-[var(--muted)]'} />
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="p-1.5 rounded hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>

      {showQR && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-center">
          <div className="p-3 bg-white rounded-lg">
            <QRCode value={shortUrl} size={120} />
          </div>
        </div>
      )}
    </div>
  )
}
