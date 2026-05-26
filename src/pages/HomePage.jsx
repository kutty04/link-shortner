import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ShortenForm from '../components/ShortenForm'
import { Zap, BarChart2, Shield, QrCode, Globe, Timer, Sun, Moon, Sparkles, Cpu, Palette } from 'lucide-react'

const FEATURES = [
  { icon: Zap, label: 'Instant Shortening', desc: 'Shorten any URL in under a second', emoji: '⚡' },
  { icon: BarChart2, label: 'Click Analytics', desc: 'Track devices, browsers, referrers', emoji: '📊' },
  { icon: Shield, label: 'Password Protection', desc: 'Secure links behind a password', emoji: '🔒' },
  { icon: QrCode, label: 'QR Code Export', desc: 'Generate QR codes for every link', emoji: '🔲' },
  { icon: Globe, label: 'UTM Builder', desc: 'Build campaign URLs with UTM params', emoji: '🌐' },
  { icon: Timer, label: 'Link Expiry', desc: 'Auto-expire links after a set time', emoji: '⏱️' },
]

const THEMES = {
  dark: {
    name: 'Dark',
    icon: '🌙',
    vars: {
      '--bg': '#0a0a0f',
      '--bg2': '#13131a',
      '--bg3': '#1c1c28',
      '--border': 'rgba(255,255,255,0.08)',
      '--text': '#f0f0ff',
      '--muted': '#888aaa',
      '--accent': '#6c63ff',
      '--accent2': '#ff6584',
      '--accent3': '#00d4aa',
      '--card-bg': 'rgba(255,255,255,0.04)',
      '--card-hover': 'rgba(108,99,255,0.12)',
      '--badge-bg': 'rgba(108,99,255,0.15)',
      '--badge-border': 'rgba(108,99,255,0.4)',
      '--badge-text': '#9d96ff',
      '--glow': 'rgba(108,99,255,0.2)',
      '--input-bg': 'rgba(255,255,255,0.06)',
      '--shadow': '0 8px 32px rgba(0,0,0,0.4)',
    }
  },
  light: {
    name: 'Light',
    icon: '☀️',
    vars: {
      '--bg': '#f5f5ff',
      '--bg2': '#ffffff',
      '--bg3': '#eeeeff',
      '--border': 'rgba(0,0,0,0.1)',
      '--text': '#1a1a2e',
      '--muted': '#6b6b8a',
      '--accent': '#5b52ef',
      '--accent2': '#ff4d72',
      '--accent3': '#00b894',
      '--card-bg': 'rgba(255,255,255,0.9)',
      '--card-hover': 'rgba(91,82,239,0.08)',
      '--badge-bg': 'rgba(91,82,239,0.1)',
      '--badge-border': 'rgba(91,82,239,0.25)',
      '--badge-text': '#5b52ef',
      '--glow': 'rgba(91,82,239,0.12)',
      '--input-bg': 'rgba(0,0,0,0.04)',
      '--shadow': '0 8px 32px rgba(91,82,239,0.12)',
    }
  },
  coquette: {
    name: 'Coquette',
    icon: '🎀',
    vars: {
      '--bg': '#fff0f5',
      '--bg2': '#fff5f8',
      '--bg3': '#ffe0eb',
      '--border': 'rgba(255,100,150,0.15)',
      '--text': '#4a1528',
      '--muted': '#b06080',
      '--accent': '#e8607a',
      '--accent2': '#c2185b',
      '--accent3': '#f48fb1',
      '--card-bg': 'rgba(255,255,255,0.85)',
      '--card-hover': 'rgba(232,96,122,0.08)',
      '--badge-bg': 'rgba(232,96,122,0.12)',
      '--badge-border': 'rgba(232,96,122,0.3)',
      '--badge-text': '#c2185b',
      '--glow': 'rgba(232,96,122,0.15)',
      '--input-bg': 'rgba(255,182,193,0.2)',
      '--shadow': '0 8px 32px rgba(232,96,122,0.15)',
    }
  },
  techno: {
    name: 'Techno',
    icon: '🤖',
    vars: {
      '--bg': '#000a06',
      '--bg2': '#001a0f',
      '--bg3': '#002a18',
      '--border': 'rgba(0,255,128,0.12)',
      '--text': '#e0ffe8',
      '--muted': '#4daa70',
      '--accent': '#00ff80',
      '--accent2': '#00ccff',
      '--accent3': '#ff3399',
      '--card-bg': 'rgba(0,255,128,0.04)',
      '--card-hover': 'rgba(0,255,128,0.1)',
      '--badge-bg': 'rgba(0,255,128,0.1)',
      '--badge-border': 'rgba(0,255,128,0.35)',
      '--badge-text': '#00ff80',
      '--glow': 'rgba(0,255,128,0.15)',
      '--input-bg': 'rgba(0,255,128,0.06)',
      '--shadow': '0 8px 32px rgba(0,255,128,0.1)',
    }
  }
}

export default function HomePage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ls-theme') || 'dark')
  const [showThemePicker, setShowThemePicker] = useState(false)

  const t = THEMES[theme]

  useEffect(() => {
    localStorage.setItem('ls-theme', theme)
    const root = document.documentElement
    Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v))
    root.style.setProperty('background', t.vars['--bg'])
    document.body.style.background = t.vars['--bg']
  }, [theme])

  const isCoquette = theme === 'coquette'
  const isTechno = theme === 'techno'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: isCoquette
        ? "'Georgia', 'Times New Roman', serif"
        : isTechno
        ? "'Courier New', 'Lucida Console', monospace"
        : "'Syne', 'Space Mono', sans-serif",
      transition: 'background 0.4s ease, color 0.4s ease',
      overflowX: 'hidden',
      width: '100%',
      maxWidth: '100vw',
    }}>

      {/* Theme Switcher Bar */}
      <div style={{
        position: 'fixed',
        bottom: '16px',
        right: '12px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        maxWidth: 'calc(100vw - 24px)',
      }}>
        {showThemePicker && (
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            boxShadow: 'var(--shadow)',
            animation: 'slideUp 0.2s ease',
          }}>
            {Object.entries(THEMES).map(([key, th]) => (
              <button
                key={key}
                onClick={() => { setTheme(key); setShowThemePicker(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: theme === key ? '1px solid var(--accent)' : '1px solid transparent',
                  background: theme === key ? 'var(--card-hover)' : 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: theme === key ? '700' : '400',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '18px' }}>{th.icon}</span>
                {th.name}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowThemePicker(p => !p)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 20px var(--glow)`,
            fontSize: '20px',
            transition: 'transform 0.2s',
          }}
          title="Switch theme"
        >
          {t.icon}
        </button>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: 'clamp(60px, 10vw, 100px) 16px clamp(40px, 6vw, 60px)',
        textAlign: 'center',
        overflow: 'hidden',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>

        {/* Background decorations */}
        {isTechno && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(0,255,128,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,128,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />
        )}
        {isCoquette && (
          <>
            <div style={{ position: 'absolute', top: '20px', left: '8%', fontSize: '24px', opacity: 0.3, animation: 'float 4s ease-in-out infinite' }}>🎀</div>
            <div style={{ position: 'absolute', top: '60px', right: '10%', fontSize: '18px', opacity: 0.25, animation: 'float 5s ease-in-out infinite 1s' }}>💕</div>
            <div style={{ position: 'absolute', top: '40px', left: '30%', fontSize: '16px', opacity: 0.2, animation: 'float 6s ease-in-out infinite 0.5s' }}>🌸</div>
          </>
        )}

        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '300px',
          background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
          opacity: 0.08, filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '100px', marginBottom: '24px',
          background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
          color: 'var(--badge-text)', fontSize: '11px', fontWeight: '700',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
          Free · No account needed for basic links
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 8vw, 80px)',
          fontWeight: '900',
          lineHeight: 1.1,
          marginBottom: '16px',
          letterSpacing: isCoquette ? '0.02em' : '-0.02em',
          fontStyle: isCoquette ? 'italic' : 'normal',
        }}>
          {isTechno ? (
            <>
              <span style={{ color: 'var(--accent)', textShadow: '0 0 30px var(--accent)' }}>{'>'} SHORT_LINKS</span>
              <br />
              <span style={{ color: 'var(--accent2)', textShadow: '0 0 30px var(--accent2)', fontSize: '0.7em' }}>BIG_IMPACT.exe</span>
            </>
          ) : isCoquette ? (
            <>
              <span>Short links,</span>
              <br />
              <span style={{
                background: `linear-gradient(135deg, var(--accent), var(--accent2))`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>darling. 🎀</span>
            </>
          ) : (
            <>
              Short links.<br />
              <span style={{
                background: `linear-gradient(135deg, var(--accent), var(--accent2))`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Big impact.</span>
            </>
          )}
        </h1>

        <p style={{
          color: 'var(--muted)', fontSize: 'clamp(14px, 2.5vw, 18px)',
          marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px',
          lineHeight: 1.6,
          fontStyle: isCoquette ? 'italic' : 'normal',
        }}>
          {isTechno
            ? '> Initializing URL compression engine... analytics module loaded.'
            : isCoquette
            ? 'Pretty little links with powerful analytics, QR codes & more ✨'
            : 'Powerful URL shortener with analytics, QR codes, UTM builder, and link expiry.'}
        </p>

        {/* Form container */}
        <div style={{
          maxWidth: '560px', margin: '0 auto',
          background: 'var(--bg2)',
          borderRadius: isCoquette ? '24px' : isTechno ? '4px' : '20px',
          border: `1px solid var(--border)`,
          padding: '24px',
          boxShadow: 'var(--shadow)',
          position: 'relative',
        }}>
          {isTechno && (
            <div style={{ position: 'absolute', top: '8px', left: '16px', display: 'flex', gap: '6px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '11px', fontFamily: 'monospace' }}>linksnip.exe v2.0</span>
            </div>
          )}
          <ShortenForm />
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 4vw, 48px)',
          marginTop: '40px', flexWrap: 'wrap',
        }}>
          {[
            { n: '∞', label: 'Free links' },
            { n: '< 1s', label: 'Shorten time' },
            { n: '6', label: 'Pro features' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '900',
                color: 'var(--accent)',
                fontFamily: isTechno ? 'monospace' : 'inherit',
                textShadow: isTechno ? `0 0 20px var(--accent)` : 'none',
              }}>{n}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: '700',
            color: 'var(--muted)', letterSpacing: isTechno ? '0.15em' : '0.02em',
            textTransform: isTechno ? 'uppercase' : 'none',
          }}>
            {isTechno ? '> MODULES_LOADED' : isCoquette ? '✨ Everything you need, love' : 'Everything you need'}
          </h2>
          <div style={{ width: '40px', height: '2px', background: 'var(--accent)', margin: '12px auto 0', borderRadius: '2px' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '12px',
        }}>
          {FEATURES.map(({ icon: Icon, label, desc, emoji }, i) => (
            <div
              key={label}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: isCoquette ? '20px' : isTechno ? '4px' : '16px',
                padding: '20px',
                transition: 'all 0.25s ease',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(8px)',
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--card-hover)'
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 24px var(--glow)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--card-bg)'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {isTechno && (
                <div style={{
                  position: 'absolute', top: '8px', right: '10px',
                  fontSize: '10px', color: 'var(--muted)', fontFamily: 'monospace',
                }}>0{i + 1}</div>
              )}

              <div style={{
                width: '40px', height: '40px', borderRadius: isCoquette ? '50%' : '10px',
                background: 'var(--badge-bg)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '14px',
                border: '1px solid var(--badge-border)',
              }}>
                {isCoquette
                  ? <span style={{ fontSize: '20px' }}>{emoji}</span>
                  : <Icon size={18} style={{ color: 'var(--accent)' }} />
                }
              </div>

              <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px', color: 'var(--text)' }}>
                {isTechno ? label.toUpperCase().replace(' ', '_') : label}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{
        background: 'var(--bg2)', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)', padding: '60px 16px',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: '700', marginBottom: '40px' }}>
            {isTechno ? '> HOW_IT_WORKS' : isCoquette ? '🌸 So simple, darling' : 'Three steps. Zero friction.'}
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px',
          }}>
            {[
              { step: '01', title: 'Paste URL', desc: 'Drop in any long link' },
              { step: '02', title: 'Snip it', desc: 'Get a clean short link instantly' },
              { step: '03', title: 'Track it', desc: 'Watch analytics roll in' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: isCoquette ? '50%' : '12px',
                  background: 'var(--badge-bg)', border: '1px solid var(--badge-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontSize: '13px', fontWeight: '800', color: 'var(--accent)',
                  fontFamily: isTechno ? 'monospace' : 'inherit',
                  boxShadow: `0 0 16px var(--glow)`,
                }}>
                  {isTechno ? `>${step}` : step}
                </div>
                <p style={{ fontWeight: '700', marginBottom: '4px' }}>{title}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ textAlign: 'center', padding: '60px 16px' }}>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>
          {isTechno ? '> SYSTEM_READY · NO_AUTH_REQUIRED' : isCoquette ? '🎀 Free forever for basic links' : 'Free forever · No credit card · Instant start'}
        </p>
        <p style={{
          fontSize: '11px', color: 'var(--muted)', opacity: 0.5,
          fontFamily: isTechno ? 'monospace' : 'inherit',
        }}>
          {isTechno ? 'built_by: CSE_student · stack: React + Supabase' : 'Built with React + Supabase · by a CSE student 🚀'}
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
      `}</style>
    </div>
  )
}
