import { resolveTradeSegment } from './tradeSegment.js'

/**
 * Market trading-hours rules.
 *
 * The market is closed on Saturdays and Sundays for most instruments, so new
 * BUY/SELL (market) orders must be blocked on those days. Some instruments
 * trade 24/7 (e.g. crypto) and stay open over the weekend.
 *
 * Configuration (optional env overrides):
 *   WEEKEND_OPEN_SYMBOLS   - comma list of extra symbols that trade on weekends
 *                            e.g. "BTCUSD,ETHUSD" (crypto is already covered)
 *   MARKET_TZ_OFFSET_HOURS - hours offset from UTC used to decide the weekend
 *                            day boundary (default 0 = UTC)
 */

// Segments that trade 24/7, including weekends.
const WEEKEND_OPEN_SEGMENTS = new Set(['Crypto'])

// Specific symbols (any segment) that remain open on weekends. Extend via env
// to keep individual instruments tradeable on Sat/Sun without code changes.
const WEEKEND_OPEN_SYMBOLS = new Set(
  (process.env.WEEKEND_OPEN_SYMBOLS || '')
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(Boolean)
)

const TZ_OFFSET_HOURS = parseFloat(process.env.MARKET_TZ_OFFSET_HOURS || '0') || 0

// True when the instrument is allowed to trade on weekends (24/7 instrument).
export function isWeekendOpenInstrument(symbol, segment = null) {
  const seg = segment || resolveTradeSegment(symbol, segment)
  if (WEEKEND_OPEN_SEGMENTS.has(seg)) return true
  if (symbol && WEEKEND_OPEN_SYMBOLS.has(String(symbol).toUpperCase())) return true
  return false
}

// True when "now" falls on Saturday or Sunday in the configured timezone.
export function isWeekendNow(now = new Date()) {
  const shifted = new Date(now.getTime() + TZ_OFFSET_HOURS * 3600000)
  const day = shifted.getUTCDay() // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6
}

// Authoritative check: can this instrument be traded right now?
// Weekend-open instruments (crypto, configured symbols) are always tradeable;
// everything else is closed on Saturday and Sunday.
export function isMarketOpen(symbol, segment = null, now = new Date()) {
  if (isWeekendOpenInstrument(symbol, segment)) return true
  return !isWeekendNow(now)
}

export { WEEKEND_OPEN_SEGMENTS, WEEKEND_OPEN_SYMBOLS }
