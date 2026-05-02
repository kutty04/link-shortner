import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowLeft, BarChart2, Copy, Check, ExternalLink } from 'lucide-react'
import { formatNumber, timeAgo } from '../lib/utils'

const BASE = window.location.origin
const COLORS = ['#6c63ff', '#ff6584', '#43e97b', '#f7971e', '#4facfe', '#fa709a']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card text-xs py-2 px-3 shadow-xl">
      <p className="font-bold">{label}</p>
      <p className="text-[#6c63ff]">{payload[0].value} clicks</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [link, setLink] = useState(null)
  const [clicks, setClicks] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: l } = await supabase.from('links').select('*').eq('id', id).single()
      if (!l || l.user_id !== user.id) { navigate('/dashboard'); return }
      setLink(l)

      const { data: c } = await supabase
        .from('clicks')
        .select('*')
        .eq('link_id', id)
        .order('clicked_at', { ascending: false })
      setClicks(c || [])
      setLoading(false)
    })()
  }, [id, user])

  const shortUrl = link ? `${BASE}/${link.short_code}` : ''

  const copy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Group by date
  const byDate = clicks.reduce((acc, c) => {
    const d = new Date(c.clicked_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    acc[d] = (acc[d] || 0) + 1
    return acc
  }, {})
  const dateData = Object.entries(byDate).slice(-14).map(([date, count]) => ({ date, count }))

  const pieGroup = (field) => {
    const acc = clicks.reduce((a, c) => {
      const k = c[field] || 'Unknown'
      a[k] = (a[k] || 0) + 1
      return a
    }, {})
    return Object.entries(acc).map(([name, value]) => ({ name, value }))
  }

  const deviceData = pieGroup('device_type')
  const browserData = pieGroup('browser')
  const osData = pieGroup('os')
  const countryData = pieGroup('country')

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-[#6c63ff] border-t-transparent animate-spin" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to dashboard
        </button>

        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {link.title && <p className="font-bold mb-1">{link.title}</p>}
              <div className="flex items-center gap-2">
                <a href={shortUrl} target="_blank" rel="noreferrer" className="mono text-[#6c63ff] text-sm hover:underline">
                  {shortUrl.replace('https://', '')}
                </a>
                <button onClick={copy}>{copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-[var(--muted)]" />}</button>
                <a href={shortUrl} target="_blank" rel="noreferrer"><ExternalLink size={13} className="text-[var(--muted)]" /></a>
              </div>
              <p className="text-xs text-[var(--muted)] truncate mono mt-1">{link.original_url}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-extrabold mono text-[#6c63ff]">{formatNumber(clicks.length)}</p>
              <p className="text-xs text-[var(--muted)]">total clicks</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Today', val: clicks.filter(c => new Date(c.clicked_at).toDateString() === new Date().toDateString()).length },
            { label: 'This Week', val: clicks.filter(c => Date.now() - new Date(c.clicked_at) < 7*86400000).length },
            { label: 'Created', val: timeAgo(link.created_at) },
          ].map(({ label, val }) => (
            <div key={label} className="card text-center">
              <p className="text-xl font-extrabold mono text-[var(--text)]">{val}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {clicks.length === 0 ? (
          <div className="card text-center py-12">
            <BarChart2 size={32} className="text-[var(--muted)] mx-auto mb-3" />
            <p className="text-[var(--muted)] text-sm">No clicks yet — share your link to start tracking!</p>
          </div>
        ) : (
          <>
            {/* Timeline chart */}
            <div className="card mb-6">
              <p className="font-bold text-sm mb-4">Clicks over time</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dateData}>
                  <XAxis dataKey="date" tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.08)' }} />
                  <Bar dataKey="count" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie charts */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Devices', data: deviceData },
                { title: 'Browsers', data: browserData },
                { title: 'OS', data: osData },
                { title: 'Countries', data: countryData },
              ].map(({ title, data }) => (
                <div key={title} className="card">
                  <p className="font-bold text-sm mb-3">{title}</p>
                  {data.length === 0 ? (
                    <p className="text-xs text-[var(--muted)]">No data</p>
                  ) : (
                    <>
                      <PieChart width={150} height={100}>
                        <Pie data={data} cx={70} cy={50} outerRadius={40} dataKey="value">
                          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                      </PieChart>
                      <div className="space-y-1 mt-2">
                        {data.slice(0, 4).map(({ name, value }, i) => (
                          <div key={name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                              <span className="text-[var(--muted)]">{name}</span>
                            </div>
                            <span className="mono font-bold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Recent clicks */}
            <div className="card">
              <p className="font-bold text-sm mb-4">Recent Clicks</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clicks.slice(0, 20).map(c => (
                  <div key={c.id} className="flex items-center justify-between text-xs py-2 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--muted)]">{timeAgo(c.clicked_at)}</span>
                      <span className="tag" style={{ background: 'rgba(108,99,255,0.1)', color: '#6c63ff' }}>{c.device_type || '?'}</span>
                      {c.country && <span className="text-[var(--muted)]">{c.country}</span>}
                    </div>
                    <span className="text-[var(--muted)] truncate max-w-24">{c.referrer || 'Direct'}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
