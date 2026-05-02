export function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

export function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function isExpired(expiresAt) {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

export function buildUTMUrl(base, { source, medium, campaign, term, content }) {
  const url = new URL(base)
  if (source) url.searchParams.set('utm_source', source)
  if (medium) url.searchParams.set('utm_medium', medium)
  if (campaign) url.searchParams.set('utm_campaign', campaign)
  if (term) url.searchParams.set('utm_term', term)
  if (content) url.searchParams.set('utm_content', content)
  return url.toString()
}

export function detectDevice(ua = navigator.userAgent) {
  if (/mobile/i.test(ua)) return 'Mobile'
  if (/tablet|ipad/i.test(ua)) return 'Tablet'
  return 'Desktop'
}

export function detectBrowser(ua = navigator.userAgent) {
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) return 'Chrome'
  if (/firefox/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
  if (/edge/i.test(ua)) return 'Edge'
  return 'Other'
}

export function detectOS(ua = navigator.userAgent) {
  if (/windows/i.test(ua)) return 'Windows'
  if (/mac/i.test(ua)) return 'macOS'
  if (/android/i.test(ua)) return 'Android'
  if (/iphone|ipad/i.test(ua)) return 'iOS'
  if (/linux/i.test(ua)) return 'Linux'
  return 'Other'
}
