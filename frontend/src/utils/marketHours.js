// Market trading-hours helpers for gating BUY/SELL buttons in the UI.
//
// Mirrors backend/utils/marketHours.js. The backend enforces this rule
// authoritatively on /api/trade/open; this client copy only drives instant
// button state so users see disabled buttons without a round-trip.
//
// Rule: the market is closed on Saturdays and Sundays for most instruments.
// Instruments that trade 24/7 (crypto, plus any explicitly configured symbols)
// stay open on weekends.

// Extra symbols that remain open on weekends (crypto is detected via category).
const WEEKEND_OPEN_SYMBOLS = new Set([])

// Does this instrument trade on weekends (24/7)?
export function isWeekendOpenInstrument(instrument) {
  if (!instrument) return false
  // Prefer the backend-provided flag when present.
  if (typeof instrument.weekendOpen === 'boolean') return instrument.weekendOpen
  const cat = String(instrument.category || instrument.segment || '').toLowerCase()
  if (cat === 'crypto') return true
  const sym = String(instrument.symbol || '').toUpperCase()
  return WEEKEND_OPEN_SYMBOLS.has(sym)
}

// Saturday or Sunday (UTC, matching the backend default boundary).
export function isWeekendNow(now = new Date()) {
  const day = now.getUTCDay() // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6
}

// Can the given instrument be traded right now?
export function isMarketOpenForInstrument(instrument, now = new Date()) {
  if (isWeekendOpenInstrument(instrument)) return true
  return !isWeekendNow(now)
}
