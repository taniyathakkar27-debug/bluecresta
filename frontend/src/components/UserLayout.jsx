import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Wallet,
  Users,
  Copy,
  UserCircle,
  HelpCircle,
  FileText,
  LogOut,
  Sun,
  Moon,
  ArrowLeft,
  Bell,
  X,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useInvestorMode, investorReadOnlyCSS } from '../hooks/useInvestorMode'
import { API_URL, API_BASE_URL } from '../config/api'
import logoImage from '../assets/logo.png'
import toast from 'react-hot-toast'

const menuItems = [
  { name: 'Dashboard',    icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Account',      icon: User,            path: '/account' },
  { name: 'Wallet',       icon: Wallet,          path: '/wallet' },
  { name: 'Orders',       icon: FileText,        path: '/orders' },
  { name: 'IB',           icon: Users,           path: '/ib' },
  { name: 'Copytrade',    icon: Copy,            path: '/copytrade' },
  { name: 'Profile',      icon: UserCircle,      path: '/profile' },
  { name: 'Support',      icon: HelpCircle,      path: '/support' },
  { name: 'Instructions', icon: FileText,        path: '/instructions' },
]

const investorAllowedMenus = ['Dashboard', 'Orders']

const UserLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { isInvestorMode } = useInvestorMode()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Technical Analysis state
  const [technicalAnalyses, setTechnicalAnalyses] = useState([])
  const [unreadAnalysisCount, setUnreadAnalysisCount] = useState(0)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  const user = isInvestorMode
    ? JSON.parse(sessionStorage.getItem('investorAccount') || '{}')?.user || {}
    : JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch technical analyses on mount and poll every 10s
  useEffect(() => {
    if (!user._id) return
    fetchTechnicalAnalyses()
    const interval = setInterval(fetchTechnicalAnalyses, 10000)
    return () => clearInterval(interval)
  }, [user._id])

  const fetchTechnicalAnalyses = async () => {
    try {
      const res = await fetch(`${API_URL}/technical-analysis/active`)
      const data = await res.json()
      if (data.success) {
        setTechnicalAnalyses(data.analyses)
        const unread = data.analyses.filter(a =>
          !a.viewedBy?.some(v => v.userId === user._id)
        ).length
        setUnreadAnalysisCount(unread)
      }
    } catch (error) {
      console.error('Error fetching technical analyses:', error)
    }
  }

  const markAnalysisAsViewed = async (analysisId) => {
    try {
      await fetch(`${API_URL}/technical-analysis/mark-viewed/${analysisId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      })
      fetchTechnicalAnalyses()
    } catch (error) {
      console.error('Error marking analysis as viewed:', error)
    }
  }

  const openAnalysis = (analysis) => {
    setSelectedAnalysis(analysis)
    setShowAnalysisModal(true)
    if (!analysis.viewedBy?.some(v => v.userId === user._id)) {
      markAnalysisAsViewed(analysis._id)
    }
  }

  const handleLogout = () => {
    if (isInvestorMode) {
      sessionStorage.removeItem('investorMode')
      sessionStorage.removeItem('investorAccessType')
      sessionStorage.removeItem('investorAccount')
      sessionStorage.removeItem('investorAccountId')
      sessionStorage.removeItem('investorUserId')
      toast.success('Logged out successfully!')
      navigate('/investor/login')
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.success('Logged out successfully!')
      navigate('/user/login')
    }
  }

  const activeMenu = menuItems.find(m => location.pathname === m.path)?.name || ''

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-dark-900' : 'bg-gray-100'}`}>
      {isInvestorMode && <style>{investorReadOnlyCSS}</style>}

      {/* ── Sticky Top Navbar ── */}
      <header className={`h-14 shrink-0 sticky top-0 z-50 grid grid-cols-3 items-center px-4 border-b ${isDarkMode ? 'bg-dark-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={() => navigate('/mobile')}
              className={`p-2 -ml-2 rounded-lg ${isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
            </button>
          )}
          <img src={logoImage} alt="BluecrestaFx" className="h-10 object-contain" />
        </div>

        {/* Center: Page Title */}
        <div className="flex justify-center">
          <style>{`
            @keyframes textGradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .title-gradient-text {
              background: linear-gradient(90deg, #ff6b6b, #ff8c42, #ffd93d, #6bcf7f, #4d96ff, #b366ff, #ff6b6b);
              background-size: 200% 200%;
              animation: textGradientShift 3s ease infinite;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}</style>
          <span className="title-gradient-text text-2xl font-bold">
            {activeMenu}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* Bell - Technical Analysis */}
          <div className="relative">
            <button
              onClick={() => setShowAnalysisModal(true)}
              className={`relative p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}`}
              title="Technical Analysis"
            >
              <Bell size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              {unreadAnalysisCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadAnalysisCount > 9 ? '9+' : unreadAnalysisCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-dark-700' : 'text-blue-500 hover:bg-gray-100'}`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isMobile && (
            <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${isDarkMode ? 'text-gray-300 bg-dark-800' : 'text-gray-700 bg-gray-100'}`}>
              <UserCircle size={16} />
              <span>{user?.firstName || 'User'}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Body: Sidebar + Main ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <aside
            className={`${sidebarExpanded ? 'w-48' : 'w-16'} shrink-0 ${isDarkMode ? 'bg-dark-900 border-gray-800' : 'bg-white border-gray-200'} border-r flex flex-col h-full transition-all duration-300 ease-in-out`}
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          >
            {/* Nav items */}
            <nav className="px-2 pt-3 overflow-y-auto">
              {menuItems.map((item) => {
                const isDisabledForInvestor = isInvestorMode && !investorAllowedMenus.includes(item.name)
                return (
                  <button
                    key={item.name}
                    onClick={() => !isDisabledForInvestor && navigate(item.path)}
                    disabled={isDisabledForInvestor}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                      isDisabledForInvestor
                        ? 'opacity-80 cursor-not-allowed text-gray-500'
                        : activeMenu === item.name
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                          : isDarkMode
                            ? 'text-gray-400 hover:text-white hover:bg-dark-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={!sidebarExpanded ? item.name : ''}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    {sidebarExpanded && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
                  </button>
                )
              })}
            </nav>

            {/* Logout */}
            <div className={`p-2 border-t shrink-0 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <style>{`
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .logout-btn-animated {
                  background: linear-gradient(90deg, #ff6b6b, #ff8c42, #ffd93d, #6bcf7f, #4d96ff, #b366ff, #ff6b6b);
                  background-size: 200% 200%;
                  animation: gradientShift 3s ease infinite;
                  padding: 2px;
                  border-radius: 0.5rem;
                }
                .logout-btn-animated > div {
                  background: inherit;
                  border-radius: 0.5rem;
                }
              `}</style>
              <div className="logout-btn-animated">
                <button
                  onClick={handleLogout}
                  className={`allow-investor w-full flex items-center gap-3 px-3 py-2.5 transition-colors rounded-lg ${isDarkMode ? 'bg-dark-900 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                  title={!sidebarExpanded ? 'Log Out' : ''}
                >
                  <LogOut size={18} className="flex-shrink-0" />
                  {sidebarExpanded && <span className="text-sm font-medium whitespace-nowrap">Log Out</span>}
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className={`flex-1 min-h-0 overflow-y-auto ${isInvestorMode ? 'investor-action-disabled' : ''}`}>
          {children}
        </main>
      </div>

      {/* Technical Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className={`w-full sm:max-w-lg max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl ${isDarkMode ? 'bg-dark-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Technical Analysis</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {unreadAnalysisCount > 0 ? `${unreadAnalysisCount} new analysis` : `${technicalAnalyses.length} analyses available`}
                </p>
              </div>
              <button
                onClick={() => { setShowAnalysisModal(false); setSelectedAnalysis(null) }}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-dark-600' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedAnalysis ? (
                <div>
                  <button
                    onClick={() => setSelectedAnalysis(null)}
                    className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    ← Back to all
                  </button>
                  <img
                    src={`${API_BASE_URL}${selectedAnalysis.image}`}
                    alt={selectedAnalysis.title}
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedAnalysis.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedAnalysis.analysisType === 'bullish'
                        ? 'bg-green-500/20 text-green-500'
                        : selectedAnalysis.analysisType === 'bearish'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {selectedAnalysis.analysisType}
                    </span>
                  </div>
                  {selectedAnalysis.symbol && (
                    <span className={`inline-block px-2 py-1 rounded text-xs mb-3 ${isDarkMode ? 'bg-dark-600 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      {selectedAnalysis.symbol}
                    </span>
                  )}
                  <p className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedAnalysis.description}
                  </p>
                  <p className={`text-xs mt-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Posted: {new Date(selectedAnalysis.createdAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                technicalAnalyses.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No technical analysis available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {technicalAnalyses.map((analysis) => {
                      const isUnread = !analysis.viewedBy?.some(v => v.userId === user._id)
                      return (
                        <div
                          key={analysis._id}
                          onClick={() => openAnalysis(analysis)}
                          className={`flex gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                            isDarkMode
                              ? 'hover:bg-dark-600 ' + (isUnread ? 'bg-dark-600/50' : '')
                              : 'hover:bg-gray-50 ' + (isUnread ? 'bg-blue-50' : '')
                          }`}
                        >
                          <img
                            src={`${API_BASE_URL}${analysis.image}`}
                            alt={analysis.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {isUnread && (
                                <span className="w-2 h-2 bg-accent-green rounded-full flex-shrink-0"></span>
                              )}
                              <h4 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {analysis.title}
                              </h4>
                              <span className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${
                                analysis.analysisType === 'bullish'
                                  ? 'bg-green-500/20 text-green-500'
                                  : analysis.analysisType === 'bearish'
                                  ? 'bg-red-500/20 text-red-500'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {analysis.analysisType === 'bullish' && <TrendingUp size={12} className="inline mr-1" />}
                                {analysis.analysisType === 'bearish' && <TrendingDown size={12} className="inline mr-1" />}
                                {analysis.analysisType === 'neutral' && <Minus size={12} className="inline mr-1" />}
                                {analysis.analysisType}
                              </span>
                            </div>
                            {analysis.symbol && (
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {analysis.symbol}
                              </span>
                            )}
                            <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {analysis.description}
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserLayout
