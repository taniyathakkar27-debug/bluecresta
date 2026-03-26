import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users,
  LogOut,
  TrendingUp,
  Wallet,
  Building2,
  UserCog,
  DollarSign,
  IndianRupee,
  Copy,
  Trophy,
  CreditCard,
  Shield,
  FileCheck,
  HeadphonesIcon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Palette,
  Mail,
  Gift,
  Sun,
  Moon,
  LineChart,
  Eye,
  AlertTriangle
} from 'lucide-react'
import logoImage from '../assets/logo.png'
import { useTheme } from '../context/ThemeContext'
import { canAccessAdminPath } from '../utils/adminAccess'

function readAdminUser() {
  try {
    return JSON.parse(localStorage.getItem('adminUser') || 'null')
  } catch {
    return null
  }
}

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})

  const allMenuItems = [
    { name: 'Overview Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Trade Management', icon: TrendingUp, path: '/admin/trades' },
    { name: 'Fund Management', icon: Wallet, path: '/admin/funds' },
    { name: 'Credit Requests', icon: Gift, path: '/admin/credit-requests' },
    { name: 'Bank Settings', icon: Building2, path: '/admin/bank-settings' },
    { name: 'IB Management', icon: UserCog, path: '/admin/ib-management' },
    { name: 'Forex Charges', icon: DollarSign, path: '/admin/forex-charges' },
    { name: 'Indian Charges', icon: IndianRupee, path: '/admin/indian-charges' },
    { name: 'Earnings Report', icon: TrendingUp, path: '/admin/earnings' },
    { name: 'Copy Trade Management', icon: Copy, path: '/admin/copy-trade' },
    { name: 'Prop Firm Challenges', icon: Trophy, path: '/admin/prop-firm' },
    { name: 'Account Types', icon: CreditCard, path: '/admin/account-types' },
    { name: 'Investor Access', icon: Eye, path: '/admin/investor-access' },
    { name: 'Margin Alerts', icon: AlertTriangle, path: '/admin/margin-alerts' },
    { name: 'Theme Settings', icon: Palette, path: '/admin/theme' },
    { name: 'Email Templates', icon: Mail, path: '/admin/email-templates' },
    { name: 'Bonus Management', icon: Gift, path: '/admin/bonus-management' },
    { name: 'Admin Management', icon: Shield, path: '/admin/admin-management' },
    { name: 'KYC Verification', icon: FileCheck, path: '/admin/kyc' },
    { name: 'Support Tickets', icon: HeadphonesIcon, path: '/admin/support' },
    { name: 'Technical Analysis', icon: LineChart, path: '/admin/technical-analysis' },
  ]

  const adminUser = readAdminUser()
  const menuItems = allMenuItems.filter((item) => canAccessAdminPath(item.path, adminUser))

  // Check if user is in investor mode (uses sessionStorage - tab specific)
  // Admin uses localStorage, Investor uses sessionStorage
  const adminToken = localStorage.getItem('adminToken')
  const investorModeFlag = sessionStorage.getItem('investorMode') === 'true'
  const isInvestorMode = investorModeFlag

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const investorMode = sessionStorage.getItem('investorMode')

    if (!token && !investorMode) {
      navigate('/admin')
    }
  }, [navigate])

  useEffect(() => {
    if (isInvestorMode) return
    const token = localStorage.getItem('adminToken')
    if (!token) return
    const user = readAdminUser()
    if (!canAccessAdminPath(location.pathname, user)) {
      toast.error('You do not have permission to access this section')
      navigate('/admin/dashboard', { replace: true })
    }
  }, [location.pathname, navigate, isInvestorMode])

  const handleLogout = () => {
    const wasInvestor = isInvestorMode
    let subAdminLogout = false
    if (!wasInvestor) {
      try {
        const u = JSON.parse(localStorage.getItem('adminUser') || 'null')
        if (u?.role === 'ADMIN') subAdminLogout = true
      } catch {
        /* ignore */
      }
    }

    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')

    sessionStorage.removeItem('investorMode')
    sessionStorage.removeItem('investorAccessType')
    sessionStorage.removeItem('investorAccount')
    sessionStorage.removeItem('investorAccountId')

    toast.success('Logged out successfully!')

    if (wasInvestor) {
      navigate('/investor/login')
    } else {
      navigate(subAdminLogout ? '/sub-admin' : '/admin')
    }
  }

  const isActive = (path) => location.pathname === path

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className={`h-screen min-h-0 flex overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-dark-900' : 'bg-gray-100'}`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky lg:top-0 lg:self-start shrink-0 inset-y-0 left-0 z-50
          h-screen max-h-screen
          ${sidebarExpanded ? 'w-64' : 'w-16'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isDarkMode ? 'bg-dark-900 border-gray-800' : 'bg-white border-gray-200'} border-r flex flex-col 
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Logo */}
        <div className={`px-4 h-[73px] flex items-center justify-between border-b shrink-0 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          {sidebarExpanded && (
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="BluecrestaFx" className="h-20 w-auto object-contain flex-shrink-0" />
            </div>
          )}
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className={`${!sidebarExpanded ? 'mx-auto' : ''} hidden lg:block p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className={`lg:hidden p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}`}
          >
            <X size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 min-h-0 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path)
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' 
                  : isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-dark-700'
                    : 'text-gray-600 hover:from-blue-700 hover:to-cyan-600 hover:bg-gray-100'
              }`}
              title={!sidebarExpanded ? item.name : ''}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarExpanded && (
                <span className="text-sm font-medium whitespace-nowrap truncate">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className={`p-2 border-t shrink-0 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          {/* Logout */}
          <style>{`
            @keyframes adminLogoutGradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .admin-logout-btn-animated {
              background: linear-gradient(90deg, #ff6b6b, #ff8c42, #ffd93d, #6bcf7f, #4d96ff, #b366ff, #ff6b6b);
              background-size: 200% 200%;
              animation: adminLogoutGradient 3s ease infinite;
              padding: 2px;
              border-radius: 0.5rem;
            }
          `}</style>
          <div className="admin-logout-btn-animated">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors rounded-lg ${
                isDarkMode ? 'bg-dark-900 text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900'
              }`}
              title={!sidebarExpanded ? 'Log Out' : ''}
            >
              <LogOut size={18} className="flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-medium whitespace-nowrap">Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className={`sticky top-0 z-30 backdrop-blur-sm flex items-center px-4 sm:px-6 h-[73px] border-b ${isDarkMode ? 'bg-dark-900/95 border-gray-800' : 'bg-white/95 border-gray-200'}`}>
          <style>{`
            @keyframes adminTitleGradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .admin-title-gradient {
              background: linear-gradient(90deg, #ff6b6b, #ff8c42, #ffd93d, #6bcf7f, #4d96ff, #b366ff, #ff6b6b);
              background-size: 200% 200%;
              animation: adminTitleGradient 3s ease infinite;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}</style>
          <div className="text-center flex-1">
            <h1 className="admin-title-gradient text-xl sm:text-2xl font-bold">{title || 'Admin Dashboard'}</h1>
            {subtitle && <p className={`text-sm hidden sm:block ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{subtitle}</p>}
          </div>
          {/* Theme Toggle Icon */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              isDarkMode
                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-dark-700'
                : 'text-blue-600 hover:text-blue-700 hover:bg-gray-100'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Page Content */}
        <div className={`p-4 sm:p-6 ${isInvestorMode ? 'investor-read-only' : ''}`}>
          {children}
        </div>
      </main>
      
      {/* Investor Mode Overlay - blocks all clicks */}
      {isInvestorMode && (
        <style>{`
          .investor-read-only button:not([data-allow-investor]),
          .investor-read-only input:not([data-allow-investor]),
          .investor-read-only select:not([data-allow-investor]),
          .investor-read-only textarea:not([data-allow-investor]),
          .investor-read-only [role="button"]:not([data-allow-investor]) {
            pointer-events: none !important;
            opacity: 0.6 !important;
            cursor: not-allowed !important;
          }
          .investor-read-only a:not([data-allow-investor]) {
            pointer-events: none !important;
          }
        `}</style>
      )}
    </div>
  )
}

export default AdminLayout
