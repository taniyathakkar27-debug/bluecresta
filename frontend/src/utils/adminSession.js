import { API_URL } from '../config/api'

const TOKEN_KEY = 'adminToken'
const USER_KEY = 'adminUser'
const BROADCAST_CHANNEL = 'bcfx-admin-profile-v1'

/**
 * Admin (super + sub) session is stored in sessionStorage so each browser tab
 * keeps its own login. localStorage was shared across tabs and last login overwrote the other.
 */
export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function getAdminUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    if (raw == null || raw === '') return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setAdminSession(token, adminUser) {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(adminUser))
}

export function clearAdminSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/** Call after super admin saves sub-admin permissions so other tabs refresh immediately. */
export function notifyAdminProfileUpdated() {
  try {
    const ch = new BroadcastChannel(BROADCAST_CHANNEL)
    ch.postMessage({ type: 'refresh' })
    queueMicrotask(() => ch.close())
  } catch {
    /* unsupported */
  }
}

export function subscribeAdminProfileBroadcast(onRefresh) {
  try {
    const ch = new BroadcastChannel(BROADCAST_CHANNEL)
    ch.onmessage = () => onRefresh()
    return () => ch.close()
  } catch {
    return () => {}
  }
}

/**
 * Fetches latest admin (permissions, wallet, status) and merges into session.
 * @returns {'ok'|'unauthorized'|'error'}
 */
export async function refreshAdminProfileFromApi() {
  const token = getAdminToken()
  if (!token) return 'error'
  try {
    const res = await fetch(`${API_URL}/admin-mgmt/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.status === 401 || res.status === 403) return 'unauthorized'
    const data = await res.json()
    if (!data.success || !data.admin) return 'error'
    const prev = getAdminUser() || {}
    const merged = {
      ...prev,
      ...data.admin,
      permissions: data.admin.permissions ?? prev.permissions
    }
    sessionStorage.setItem(USER_KEY, JSON.stringify(merged))
    return 'ok'
  } catch {
    return 'error'
  }
}
