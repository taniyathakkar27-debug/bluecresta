import WebSocket from 'ws'
import dotenv from 'dotenv'

dotenv.config()

const INFOWAY_API_KEY = process.env.INFOWAY_API_KEY

// WebSocket URLs
const WS_FOREX_URL = `wss://data.infoway.io/ws?business=common&apikey=${INFOWAY_API_KEY}`
const WS_CRYPTO_URL = `wss://data.infoway.io/ws?business=crypto&apikey=${INFOWAY_API_KEY}`

// Symbol mappings - All supported instruments
const FOREX_SYMBOLS = [
  // Forex Majors
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'NZDUSD', 'USDCAD',
  // Forex Crosses
  'EURGBP', 'EURJPY', 'GBPJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'GBPAUD',
  'GBPCAD', 'AUDCAD', 'AUDJPY', 'CADJPY', 'CHFJPY', 'NZDJPY', 'AUDNZD',
  'CADCHF', 'GBPCHF', 'GBPNZD', 'EURNZD', 'NZDCAD', 'NZDCHF', 'AUDCHF',
  // Forex Exotics
  'USDSGD', 'EURSGD', 'GBPSGD', 'AUDSGD', 'SGDJPY', 'USDHKD',
  'USDZAR', 'EURZAR', 'GBPZAR', 'ZARJPY',
  'USDTRY', 'EURTRY', 'TRYJPY',
  'USDMXN', 'EURMXN', 'MXNJPY',
  'USDPLN', 'EURPLN', 'GBPPLN',
  'USDSEK', 'EURSEK', 'GBPSEK', 'SEKJPY',
  'USDNOK', 'EURNOK', 'GBPNOK', 'NOKJPY',
  'USDDKK', 'EURDKK', 'DKKJPY',
  'USDCNH', 'CNHJPY',
  'USDHUF', 'EURHUF', 'USDCZK', 'EURCZK'
]

// Metals
const METALS_SYMBOLS = [
  'XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD',
  'XAUEUR', 'XAUGBP', 'XAUAUD', 'XAUCHF', 'XAUJPY',
  'XAGEUR', 'XAGGBP', 'XAGAUD', 'XAGCHF', 'XAGJPY',
  'XAUCAD', 'XAUNZD', 'XAGCAD', 'XAGNZD'
]

// Commodities
const COMMODITIES_SYMBOLS = ['USOIL', 'UKOIL', 'NGAS', 'COPPER']

const CRYPTO_SYMBOLS = [
  // Top Cryptos
  'BTCUSD', 'ETHUSD', 'BNBUSD', 'XRPUSD', 'SOLUSD', 'ADAUSD', 'DOGEUSD',
  'DOTUSD', 'MATICUSD', 'LTCUSD', 'LINKUSD', 'AVAXUSD', 'ATOMUSD',
  'BCHUSD', 'XLMUSD', 'UNIUSD', 'TRXUSD', 'ETCUSD', 'XMRUSD', 'EOSUSD',
  // DeFi & Layer 2
  'AAVEUSD', 'MKRUSD', 'COMPUSD', 'SNXUSD', 'YFIUSD', 'SUSHIUSD',
  'NEARUSD', 'FTMUSD', 'SANDUSD', 'MANAUSD', 'AXSUSD', 'GALAUSD',
  'APEUSD', 'GMTUSD', 'OPUSD', 'ARBUSD', 'PEPEUSD', 'SHIBUSD',
  'TONUSD', 'HBARUSD', 'ICPUSD', 'FILUSD', 'VETUSD', 'ALGOUSD',
  // Additional Cryptos
  'XTZUSD', 'THETAUSD', 'ZILUSD', 'ENJUSD', 'BATUSD', 'ZRXUSD',
  'CRVUSD', 'LRCUSD', 'ANKRUSD', 'WAVESUSD', 'ZECUSD', 'DASHUSD',
  'NEOUSD', 'KSMUSD', 'KAVAUSD', 'RUNEUSD', 'FLOWUSD', 'CHZUSD',
  'GRTUSD', 'ROSEUSD', 'MINAUSD', 'CELOUSD', 'ONEUSD', 'HOTUSD',
  'SKLUSD', 'STORJUSD', 'UMAUSD', 'BANDUSD', 'RVNUSD', 'OXTUSD',
  'WOOUSD', 'JASMYUSD', 'MASKUSD', 'DENTUSD', 'COTIUSD', 'IOTXUSD',
  'KLAYUSD', 'OGNUSD', 'RLCUSD', 'AUDIOUSD', 'BONKUSD', 'FLOKIUSD',
  'ORDIUSD', 'STXUSD', 'CFXUSD', 'IMXUSD', 'LDOUSD', 'INJUSD',
  'FETUSD', 'RNDRUSD', 'WLDUSD', 'SEIUSD', 'TIAUSD', 'BLURUSD',
  'SUIUSD', 'APTUSD', 'QNTUSD', 'EGLDUSD', 'DYDXUSD', 'GMXUSD'
]

// Infoway symbol format mapping
const toInfowaySymbol = (symbol) => {
  if (CRYPTO_SYMBOLS.includes(symbol)) {
    return symbol.replace('USD', 'USDT')
  }
  return symbol
}

const fromInfowaySymbol = (infowaySymbol) => {
  if (infowaySymbol.endsWith('USDT')) {
    return infowaySymbol.replace('USDT', 'USD')
  }
  return infowaySymbol
}

const SUPPORTED_SYMBOLS = [...FOREX_SYMBOLS, ...METALS_SYMBOLS, ...COMMODITIES_SYMBOLS, ...CRYPTO_SYMBOLS]

// Fallback prices for all symbols
const FALLBACK_PRICES = {
  // NOTE: Fallback / frozen baseline prices. Updated 2026-06-21 from TradingView
  // (weekend-closed instruments only; crypto trades 24/7 and is left untouched).
  // Cross/derived rates are computed from the fetched USD majors + metals.
  // Forex Majors
  'EURUSD': { bid: 1.14712, ask: 1.14732 },
  'GBPUSD': { bid: 1.32335, ask: 1.32355 },
  'USDJPY': { bid: 161.246, ask: 161.266 },
  'USDCHF': { bid: 0.80703, ask: 0.80723 },
  'AUDUSD': { bid: 0.70138, ask: 0.70158 },
  'NZDUSD': { bid: 0.57385, ask: 0.57405 },
  'USDCAD': { bid: 1.41536, ask: 1.41556 },
  // Forex Crosses
  'EURGBP': { bid: 0.86683, ask: 0.86703 },
  'EURJPY': { bid: 184.968, ask: 184.988 },
  'GBPJPY': { bid: 213.385, ask: 213.405 },
  'EURCHF': { bid: 0.92580, ask: 0.92600 },
  'EURAUD': { bid: 1.63555, ask: 1.63575 },
  'EURCAD': { bid: 1.62359, ask: 1.62379 },
  'GBPAUD': { bid: 1.88682, ask: 1.88702 },
  'GBPCAD': { bid: 1.87302, ask: 1.87322 },
  'AUDCAD': { bid: 0.99271, ask: 0.99291 },
  'AUDJPY': { bid: 113.095, ask: 113.115 },
  'CADJPY': { bid: 113.926, ask: 113.946 },
  'CHFJPY': { bid: 199.802, ask: 199.822 },
  'NZDJPY': { bid: 92.531, ask: 92.551 },
  'AUDNZD': { bid: 1.22223, ask: 1.22243 },
  'CADCHF': { bid: 0.57020, ask: 0.57040 },
  'GBPCHF': { bid: 1.06798, ask: 1.06818 },
  'GBPNZD': { bid: 2.30609, ask: 2.30629 },
  'EURNZD': { bid: 1.99899, ask: 1.99919 },
  'NZDCAD': { bid: 0.81220, ask: 0.81240 },
  'NZDCHF': { bid: 0.46311, ask: 0.46331 },
  'AUDCHF': { bid: 0.56604, ask: 0.56624 },
  // Forex Exotics
  'USDSGD': { bid: 1.29126, ask: 1.29146 },
  'EURSGD': { bid: 1.48123, ask: 1.48143 },
  'GBPSGD': { bid: 1.70879, ask: 1.70899 },
  'AUDSGD': { bid: 0.90566, ask: 0.90586 },
  'SGDJPY': { bid: 124.874, ask: 124.894 },
  'USDHKD': { bid: 7.83593, ask: 7.83693 },
  'USDZAR': { bid: 16.41340, ask: 16.42340 },
  'EURZAR': { bid: 18.82814, ask: 18.83814 },
  'GBPZAR': { bid: 21.72067, ask: 21.73067 },
  'ZARJPY': { bid: 9.8240, ask: 9.8340 },
  'USDTRY': { bid: 46.4162, ask: 46.4362 },
  'EURTRY': { bid: 53.2449, ask: 53.2649 },
  'TRYJPY': { bid: 3.4739, ask: 3.4839 },
  'USDMXN': { bid: 17.2969, ask: 17.3169 },
  'EURMXN': { bid: 19.8416, ask: 19.8616 },
  'MXNJPY': { bid: 9.3223, ask: 9.3323 },
  'USDPLN': { bid: 3.7098, ask: 3.7118 },
  'EURPLN': { bid: 4.25559, ask: 4.25759 },
  'GBPPLN': { bid: 4.90936, ask: 4.91136 },
  'USDSEK': { bid: 9.5840, ask: 9.5860 },
  'EURSEK': { bid: 10.9940, ask: 10.9960 },
  'GBPSEK': { bid: 12.6830, ask: 12.6850 },
  'SEKJPY': { bid: 16.8246, ask: 16.8346 },
  'USDNOK': { bid: 9.7000, ask: 9.7020 },
  'EURNOK': { bid: 11.1271, ask: 11.1291 },
  'GBPNOK': { bid: 12.8365, ask: 12.8385 },
  'NOKJPY': { bid: 16.6233, ask: 16.6333 },
  'USDDKK': { bid: 6.5164, ask: 6.5184 },
  'EURDKK': { bid: 7.4751, ask: 7.4771 },
  'DKKJPY': { bid: 24.7447, ask: 24.7547 },
  'USDCNH': { bid: 6.7788, ask: 6.7808 },
  'CNHJPY': { bid: 23.7868, ask: 23.7968 },
  'USDHUF': { bid: 305.831, ask: 306.031 },
  'EURHUF': { bid: 350.825, ask: 351.025 },
  'USDCZK': { bid: 21.0937, ask: 21.1137 },
  'EURCZK': { bid: 24.1970, ask: 24.2170 },
  // Metals
  'XAUUSD': { bid: 4155.40, ask: 4155.90 },
  'XAGUSD': { bid: 65.56, ask: 65.59 },
  'XPTUSD': { bid: 1679.20, ask: 1680.20 },
  'XPDUSD': { bid: 1263.50, ask: 1264.50 },
  'XAUEUR': { bid: 3622.47, ask: 3622.97 },
  'XAUGBP': { bid: 3140.07, ask: 3140.57 },
  'XAUAUD': { bid: 5924.73, ask: 5925.23 },
  'XAUCHF': { bid: 3353.54, ask: 3354.04 },
  'XAUJPY': { bid: 670042.00, ask: 670092.00 },
  'XAGEUR': { bid: 57.15, ask: 57.18 },
  'XAGGBP': { bid: 49.54, ask: 49.57 },
  'XAGAUD': { bid: 93.47, ask: 93.50 },
  'XAGCHF': { bid: 52.91, ask: 52.94 },
  'XAGJPY': { bid: 10571.50, ask: 10573.50 },
  'XAUCAD': { bid: 5881.39, ask: 5881.89 },
  'XAUNZD': { bid: 7241.30, ask: 7241.80 },
  'XAGCAD': { bid: 92.79, ask: 92.82 },
  'XAGNZD': { bid: 114.25, ask: 114.28 },
  // Commodities
  'USOIL': { bid: 77.33, ask: 77.38 },
  'UKOIL': { bid: 80.00, ask: 80.05 },
  'NGAS': { bid: 3.20, ask: 3.21 },
  'COPPER': { bid: 6.33, ask: 6.34 },
  // Crypto
  'BTCUSD': { bid: 97000.00, ask: 97050.00 },
  'ETHUSD': { bid: 2650.00, ask: 2652.00 },
  'BNBUSD': { bid: 580.00, ask: 580.50 },
  'XRPUSD': { bid: 2.45, ask: 2.46 },
  'SOLUSD': { bid: 195.00, ask: 195.20 },
  'ADAUSD': { bid: 0.95, ask: 0.952 },
  'DOGEUSD': { bid: 0.32, ask: 0.321 },
  'DOTUSD': { bid: 7.50, ask: 7.52 },
  'MATICUSD': { bid: 0.45, ask: 0.452 },
  'LTCUSD': { bid: 105.00, ask: 105.20 },
  'LINKUSD': { bid: 18.50, ask: 18.52 },
  'AVAXUSD': { bid: 38.50, ask: 38.55 },
  'ATOMUSD': { bid: 9.80, ask: 9.82 },
  'BCHUSD': { bid: 420.00, ask: 420.50 },
  'XLMUSD': { bid: 0.42, ask: 0.421 },
  'UNIUSD': { bid: 12.50, ask: 12.52 },
  'TRXUSD': { bid: 0.24, ask: 0.241 },
  'ETCUSD': { bid: 28.50, ask: 28.55 },
  'XMRUSD': { bid: 185.00, ask: 185.50 },
  'EOSUSD': { bid: 0.85, ask: 0.852 },
  'AAVEUSD': { bid: 280.00, ask: 280.50 },
  'MKRUSD': { bid: 1850.00, ask: 1852.00 },
  'COMPUSD': { bid: 85.00, ask: 85.20 },
  'SNXUSD': { bid: 3.20, ask: 3.22 },
  'YFIUSD': { bid: 8500.00, ask: 8510.00 },
  'SUSHIUSD': { bid: 1.45, ask: 1.46 },
  'NEARUSD': { bid: 5.20, ask: 5.22 },
  'FTMUSD': { bid: 0.72, ask: 0.722 },
  'SANDUSD': { bid: 0.58, ask: 0.582 },
  'MANAUSD': { bid: 0.52, ask: 0.522 },
  'AXSUSD': { bid: 8.20, ask: 8.22 },
  'GALAUSD': { bid: 0.042, ask: 0.0422 },
  'APEUSD': { bid: 1.35, ask: 1.36 },
  'GMTUSD': { bid: 0.22, ask: 0.221 },
  'OPUSD': { bid: 2.15, ask: 2.16 },
  'ARBUSD': { bid: 0.85, ask: 0.852 },
  'PEPEUSD': { bid: 0.000018, ask: 0.0000181 },
  'SHIBUSD': { bid: 0.000022, ask: 0.0000221 },
  'TONUSD': { bid: 5.50, ask: 5.52 },
  'HBARUSD': { bid: 0.28, ask: 0.281 },
  'ICPUSD': { bid: 12.80, ask: 12.82 },
  'FILUSD': { bid: 5.80, ask: 5.82 },
  'VETUSD': { bid: 0.045, ask: 0.0451 },
  'ALGOUSD': { bid: 0.38, ask: 0.381 },
  // Additional Cryptos
  'XTZUSD': { bid: 1.05, ask: 1.06 },
  'THETAUSD': { bid: 1.80, ask: 1.82 },
  'ZILUSD': { bid: 0.025, ask: 0.0252 },
  'ENJUSD': { bid: 0.32, ask: 0.322 },
  'BATUSD': { bid: 0.25, ask: 0.252 },
  'ZRXUSD': { bid: 0.45, ask: 0.452 },
  'CRVUSD': { bid: 0.55, ask: 0.552 },
  'LRCUSD': { bid: 0.22, ask: 0.222 },
  'ANKRUSD': { bid: 0.035, ask: 0.0352 },
  'WAVESUSD': { bid: 2.20, ask: 2.22 },
  'ZECUSD': { bid: 35.00, ask: 35.10 },
  'DASHUSD': { bid: 28.00, ask: 28.10 },
  'NEOUSD': { bid: 12.50, ask: 12.52 },
  'KSMUSD': { bid: 28.00, ask: 28.10 },
  'KAVAUSD': { bid: 0.55, ask: 0.552 },
  'RUNEUSD': { bid: 5.20, ask: 5.22 },
  'FLOWUSD': { bid: 0.75, ask: 0.752 },
  'CHZUSD': { bid: 0.08, ask: 0.082 },
  'GRTUSD': { bid: 0.18, ask: 0.182 },
  'ROSEUSD': { bid: 0.10, ask: 0.102 },
  'MINAUSD': { bid: 0.55, ask: 0.552 },
  'CELOUSD': { bid: 0.65, ask: 0.652 },
  'ONEUSD': { bid: 0.018, ask: 0.0182 },
  'HOTUSD': { bid: 0.002, ask: 0.0022 },
  'SKLUSD': { bid: 0.045, ask: 0.0452 },
  'STORJUSD': { bid: 0.55, ask: 0.552 },
  'UMAUSD': { bid: 2.80, ask: 2.82 },
  'BANDUSD': { bid: 1.50, ask: 1.52 },
  'RVNUSD': { bid: 0.025, ask: 0.0252 },
  'OXTUSD': { bid: 0.10, ask: 0.102 },
  'WOOUSD': { bid: 0.25, ask: 0.252 },
  'JASMYUSD': { bid: 0.02, ask: 0.022 },
  'MASKUSD': { bid: 3.20, ask: 3.22 },
  'DENTUSD': { bid: 0.001, ask: 0.0012 },
  'COTIUSD': { bid: 0.10, ask: 0.102 },
  'IOTXUSD': { bid: 0.045, ask: 0.0452 },
  'KLAYUSD': { bid: 0.18, ask: 0.182 },
  'OGNUSD': { bid: 0.12, ask: 0.122 },
  'RLCUSD': { bid: 2.50, ask: 2.52 },
  'AUDIOUSD': { bid: 0.18, ask: 0.182 },
  'BONKUSD': { bid: 0.000025, ask: 0.0000252 },
  'FLOKIUSD': { bid: 0.00018, ask: 0.000182 },
  'ORDIUSD': { bid: 35.00, ask: 35.10 },
  'STXUSD': { bid: 1.80, ask: 1.82 },
  'CFXUSD': { bid: 0.18, ask: 0.182 },
  'IMXUSD': { bid: 1.50, ask: 1.52 },
  'LDOUSD': { bid: 1.80, ask: 1.82 },
  'INJUSD': { bid: 22.00, ask: 22.10 },
  'FETUSD': { bid: 0.55, ask: 0.552 },
  'RNDRUSD': { bid: 8.50, ask: 8.52 },
  'WLDUSD': { bid: 2.20, ask: 2.22 },
  'SEIUSD': { bid: 0.45, ask: 0.452 },
  'TIAUSD': { bid: 8.50, ask: 8.52 },
  'BLURUSD': { bid: 0.28, ask: 0.282 },
  'SUIUSD': { bid: 1.20, ask: 1.22 },
  'APTUSD': { bid: 8.50, ask: 8.52 },
  'QNTUSD': { bid: 95.00, ask: 95.20 },
  'EGLDUSD': { bid: 38.00, ask: 38.10 },
  'DYDXUSD': { bid: 1.50, ask: 1.52 },
  'GMXUSD': { bid: 28.00, ask: 28.10 }
}

const STALE_MS = 60_000
const WATCHDOG_INTERVAL_MS = 15_000
const HEARTBEAT_INTERVAL_MS = 30_000
const CONNECT_TIMEOUT_MS = 15_000
const RECONNECT_BASE_DELAY_MS = 2_000
const RECONNECT_MAX_DELAY_MS = 30_000

class InfowayService {
  constructor() {
    this.forexWs = null
    this.cryptoWs = null
    this.prices = new Map()
    this.subscribers = new Set()
    this.heartbeatInterval = null
    this.watchdogInterval = null
    this.forexLastMessageAt = 0
    this.cryptoLastMessageAt = 0
    this.forexReconnectAttempts = 0
    this.cryptoReconnectAttempts = 0
    this.forexReconnectTimer = null
    this.cryptoReconnectTimer = null
    this.shutdown = false
  }

  async connect() {
    if (!INFOWAY_API_KEY) {
      console.error('[Infoway] No INFOWAY_API_KEY configured')
      return false
    }
    this.shutdown = false
    console.log('[Infoway] Starting service...')
    // Kick off both sockets. If either fails, the close handler and watchdog will retry forever.
    await Promise.allSettled([this.connectForex(), this.connectCrypto()])
    this.startHeartbeat()
    this.startWatchdog()
    console.log('[Infoway] Service started (self-healing enabled)')
    return true
  }

  connectForex() {
    return new Promise((resolve) => {
      if (this.shutdown) return resolve()
      let settled = false
      const done = () => { if (!settled) { settled = true; resolve() } }

      let ws
      try {
        ws = new WebSocket(WS_FOREX_URL)
      } catch (e) {
        console.error('[Infoway] Forex WS construct error:', e.message)
        this.scheduleForexReconnect()
        return done()
      }
      this.forexWs = ws

      ws.on('open', () => {
        this.forexReconnectAttempts = 0
        this.forexLastMessageAt = Date.now()
        console.log('[Infoway] Forex WebSocket connected')
        try {
          const allForexSymbols = [...FOREX_SYMBOLS, ...METALS_SYMBOLS, ...COMMODITIES_SYMBOLS]
          this.subscribeToDepth(ws, allForexSymbols)
        } catch (e) {
          console.error('[Infoway] Forex subscribe error:', e.message)
        }
        done()
      })

      ws.on('message', (data) => {
        this.forexLastMessageAt = Date.now()
        this.handleMessage(data)
      })

      ws.on('error', (err) => {
        console.error('[Infoway] Forex WS error:', err.message)
      })

      ws.on('close', (code, reason) => {
        console.warn(`[Infoway] Forex WS closed (code=${code}, reason=${reason?.toString() || 'n/a'})`)
        if (this.forexWs === ws) this.forexWs = null
        done()
        this.scheduleForexReconnect()
      })

      setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN && ws.readyState !== WebSocket.CLOSED) {
          console.error('[Infoway] Forex connect timeout, terminating socket')
          try { ws.terminate() } catch (e) {}
        }
        done()
      }, CONNECT_TIMEOUT_MS)
    })
  }

  connectCrypto() {
    return new Promise((resolve) => {
      if (this.shutdown) return resolve()
      let settled = false
      const done = () => { if (!settled) { settled = true; resolve() } }

      let ws
      try {
        ws = new WebSocket(WS_CRYPTO_URL)
      } catch (e) {
        console.error('[Infoway] Crypto WS construct error:', e.message)
        this.scheduleCryptoReconnect()
        return done()
      }
      this.cryptoWs = ws

      ws.on('open', () => {
        this.cryptoReconnectAttempts = 0
        this.cryptoLastMessageAt = Date.now()
        console.log('[Infoway] Crypto WebSocket connected')
        try {
          this.subscribeToDepth(ws, CRYPTO_SYMBOLS.map(toInfowaySymbol))
        } catch (e) {
          console.error('[Infoway] Crypto subscribe error:', e.message)
        }
        done()
      })

      ws.on('message', (data) => {
        this.cryptoLastMessageAt = Date.now()
        this.handleMessage(data)
      })

      ws.on('error', (err) => {
        console.error('[Infoway] Crypto WS error:', err.message)
      })

      ws.on('close', (code, reason) => {
        console.warn(`[Infoway] Crypto WS closed (code=${code}, reason=${reason?.toString() || 'n/a'})`)
        if (this.cryptoWs === ws) this.cryptoWs = null
        done()
        this.scheduleCryptoReconnect()
      })

      setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN && ws.readyState !== WebSocket.CLOSED) {
          console.error('[Infoway] Crypto connect timeout, terminating socket')
          try { ws.terminate() } catch (e) {}
        }
        done()
      }, CONNECT_TIMEOUT_MS)
    })
  }

  scheduleForexReconnect() {
    if (this.shutdown || this.forexReconnectTimer) return
    this.forexReconnectAttempts++
    const expStep = Math.min(this.forexReconnectAttempts - 1, 4)
    const delay = Math.min(RECONNECT_MAX_DELAY_MS, RECONNECT_BASE_DELAY_MS * Math.pow(2, expStep))
    console.log(`[Infoway] Forex reconnect attempt #${this.forexReconnectAttempts} in ${delay}ms`)
    this.forexReconnectTimer = setTimeout(() => {
      this.forexReconnectTimer = null
      if (this.shutdown) return
      this.connectForex().catch((e) => console.error('[Infoway] Forex reconnect error:', e?.message))
    }, delay)
  }

  scheduleCryptoReconnect() {
    if (this.shutdown || this.cryptoReconnectTimer) return
    this.cryptoReconnectAttempts++
    const expStep = Math.min(this.cryptoReconnectAttempts - 1, 4)
    const delay = Math.min(RECONNECT_MAX_DELAY_MS, RECONNECT_BASE_DELAY_MS * Math.pow(2, expStep))
    console.log(`[Infoway] Crypto reconnect attempt #${this.cryptoReconnectAttempts} in ${delay}ms`)
    this.cryptoReconnectTimer = setTimeout(() => {
      this.cryptoReconnectTimer = null
      if (this.shutdown) return
      this.connectCrypto().catch((e) => console.error('[Infoway] Crypto reconnect error:', e?.message))
    }, delay)
  }

  subscribeToDepth(ws, symbols) {
    const msg = {
      code: 10003,
      trace: Date.now().toString(),
      data: { codes: symbols.join(',') }
    }
    ws.send(JSON.stringify(msg))
    console.log(`[Infoway] Subscribed to ${symbols.length} symbols`)
  }

  handleMessage(data) {
    try {
      const msg = JSON.parse(data.toString())
      if (msg.code === 10005 && msg.data) {
        const infowaySymbol = msg.data.s
        const symbol = fromInfowaySymbol(infowaySymbol)
        const askPrice = msg.data.a?.[0]?.[0]
        const bidPrice = msg.data.b?.[0]?.[0]

        if (bidPrice && askPrice) {
          const priceData = {
            bid: parseFloat(bidPrice),
            ask: parseFloat(askPrice),
            time: msg.data.t || Date.now(),
            receivedAt: Date.now()
          }
          this.prices.set(symbol, priceData)
          this.subscribers.forEach(callback => {
            try { callback(symbol, priceData) } catch (e) {}
          })
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
    this.heartbeatInterval = setInterval(() => {
      const ping = { code: 10010, trace: Date.now().toString() }
      try {
        if (this.forexWs?.readyState === WebSocket.OPEN) {
          this.forexWs.send(JSON.stringify(ping))
        }
      } catch (e) {
        console.error('[Infoway] Forex heartbeat send error:', e.message)
      }
      try {
        if (this.cryptoWs?.readyState === WebSocket.OPEN) {
          this.cryptoWs.send(JSON.stringify(ping))
        }
      } catch (e) {
        console.error('[Infoway] Crypto heartbeat send error:', e.message)
      }
    }, HEARTBEAT_INTERVAL_MS)
  }

  // Force-terminate sockets that have stopped delivering data, and re-attempt connection if missing.
  // Without this, a TCP-alive-but-silent socket would never trigger 'close', so reconnect would never run.
  startWatchdog() {
    if (this.watchdogInterval) clearInterval(this.watchdogInterval)
    this.watchdogInterval = setInterval(() => {
      if (this.shutdown) return
      const now = Date.now()

      // Forex
      if (this.forexWs?.readyState === WebSocket.OPEN) {
        if (this.forexLastMessageAt && (now - this.forexLastMessageAt) > STALE_MS) {
          const ageSec = Math.round((now - this.forexLastMessageAt) / 1000)
          console.warn(`[Infoway] Forex WS stale (${ageSec}s no data), terminating to force reconnect`)
          try { this.forexWs.terminate() } catch (e) {}
        }
      } else if (!this.forexWs && !this.forexReconnectTimer) {
        console.log('[Infoway] Watchdog: forex WS missing, scheduling reconnect')
        this.scheduleForexReconnect()
      }

      // Crypto
      if (this.cryptoWs?.readyState === WebSocket.OPEN) {
        if (this.cryptoLastMessageAt && (now - this.cryptoLastMessageAt) > STALE_MS) {
          const ageSec = Math.round((now - this.cryptoLastMessageAt) / 1000)
          console.warn(`[Infoway] Crypto WS stale (${ageSec}s no data), terminating to force reconnect`)
          try { this.cryptoWs.terminate() } catch (e) {}
        }
      } else if (!this.cryptoWs && !this.cryptoReconnectTimer) {
        console.log('[Infoway] Watchdog: crypto WS missing, scheduling reconnect')
        this.scheduleCryptoReconnect()
      }
    }, WATCHDOG_INTERVAL_MS)
  }

  isHealthy() {
    const now = Date.now()
    const forexOk = this.forexWs?.readyState === WebSocket.OPEN &&
      this.forexLastMessageAt && (now - this.forexLastMessageAt) < STALE_MS
    const cryptoOk = this.cryptoWs?.readyState === WebSocket.OPEN &&
      this.cryptoLastMessageAt && (now - this.cryptoLastMessageAt) < STALE_MS
    return { forex: !!forexOk, crypto: !!cryptoOk }
  }

  // True if at least one feed has delivered data recently.
  // Used to gate background stop-out / SL-TP jobs so they don't act on stale prices.
  isFeedHealthy() {
    const h = this.isHealthy()
    return h.forex || h.crypto
  }

  // Per-symbol freshness check. A symbol is "fresh" only if we've received an
  // update for it within maxAgeMs. Falls back prices are NEVER fresh.
  isPriceFresh(symbol, maxAgeMs = 15_000) {
    const p = this.prices.get(symbol)
    if (!p || !p.receivedAt) return false
    return (Date.now() - p.receivedAt) < maxAgeMs
  }

  // Returns the cached price. The cache is intentionally never cleared, so if
  // the Infoway feed stops (e.g. the API key expires) the LAST TRADED price for
  // each instrument stays frozen at its final value instead of disappearing.
  // FALLBACK_PRICES is only used for symbols that never received a live tick.
  getPrice(symbol) {
    return this.prices.get(symbol) || FALLBACK_PRICES[symbol] || null
  }

  // Returns a live, recently-received price, or null when stale/missing.
  // Use this for any logic that could move money (stop-out, SL/TP, etc.).
  getFreshPrice(symbol, maxAgeMs = 15_000) {
    const p = this.prices.get(symbol)
    if (!p || !p.receivedAt) return null
    if ((Date.now() - p.receivedAt) >= maxAgeMs) return null
    return p
  }

  getAllPrices() {
    const prices = {}
    this.prices.forEach((price, symbol) => { prices[symbol] = price })
    return prices
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  async fetchBatchPrices(symbols) {
    const prices = {}
    symbols.forEach(symbol => {
      const price = this.getPrice(symbol)
      if (price) prices[symbol] = price
    })
    return prices
  }

  getSymbols() { return SUPPORTED_SYMBOLS }
  isCrypto(symbol) { return CRYPTO_SYMBOLS.includes(symbol) }

  async disconnect() {
    this.shutdown = true
    if (this.heartbeatInterval) { clearInterval(this.heartbeatInterval); this.heartbeatInterval = null }
    if (this.watchdogInterval) { clearInterval(this.watchdogInterval); this.watchdogInterval = null }
    if (this.forexReconnectTimer) { clearTimeout(this.forexReconnectTimer); this.forexReconnectTimer = null }
    if (this.cryptoReconnectTimer) { clearTimeout(this.cryptoReconnectTimer); this.cryptoReconnectTimer = null }
    try { this.forexWs?.close() } catch (e) {}
    try { this.cryptoWs?.close() } catch (e) {}
  }
}

const infowayService = new InfowayService()
export default infowayService
export { SUPPORTED_SYMBOLS, CRYPTO_SYMBOLS, FALLBACK_PRICES }
