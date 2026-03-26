// API Configuration - Use environment variable for production
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const API_BASE_URL = String(rawBase).replace(/\/$/, '')
export const API_URL = `${API_BASE_URL}/api`

/**
 * Public site origin for shareable links (e.g. sub-admin login).
 * Set VITE_SITE_ORIGIN=https://bluecrestafx.com in production .env before build.
 * If unset, uses the current browser origin (fine for local dev).
 */
export function getSiteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_ORIGIN
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).trim().replace(/\/$/, '')
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

/**
 * KYC and uploads may be stored as data URLs (base64), absolute http(s) URLs, or paths like /uploads/kyc/file.jpg
 */
export function resolveMediaSrc(value) {
  if (value == null || value === '') return ''
  const s = String(value).trim()
  if (
    s.startsWith('data:') ||
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('blob:')
  ) {
    return s
  }
  const path = s.startsWith('/') ? s : `/${s}`
  return `${API_BASE_URL}${path}`
}
