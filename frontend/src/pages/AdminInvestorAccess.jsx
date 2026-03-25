import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../components/AdminLayout'
import { 
  Eye, 
  Search, 
  RefreshCw, 
  Key, 
  Copy, 
  ExternalLink,
  Users,
  Shield,
  Save,
  Edit3
} from 'lucide-react'
import { API_URL } from '../config/api'
import { useTheme } from '../context/ThemeContext'

const AdminInvestorAccess = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [passwords, setPasswords] = useState({ masterPassword: '', investorPassword: '' })
  const [loadingPasswords, setLoadingPasswords] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/trading-accounts/all`)
      const data = await res.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch accounts')
    }
    setLoading(false)
  }

  const fetchPasswords = async (account) => {
    setSelectedAccount(account)
    setLoadingPasswords(true)
    setEditMode(false)
    try {
      const res = await fetch(`${API_URL}/trading-accounts/${account._id}/passwords`)
      const data = await res.json()
      if (data.success) {
        setPasswords({
          masterPassword: data.masterPassword || '',
          investorPassword: data.investorPassword || ''
        })
      }
    } catch (error) {
      toast.error('Error fetching passwords')
    }
    setLoadingPasswords(false)
  }

  const savePasswords = async () => {
    if (!selectedAccount) return
    if (!passwords.investorPassword) {
      toast.error('Please enter Investor Password')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/trading-accounts/${selectedAccount._id}/set-passwords`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorPassword: passwords.investorPassword
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Passwords saved successfully!')
        setEditMode(false)
      } else {
        toast.error(data.message || 'Failed to save passwords')
      }
    } catch (error) {
      toast.error('Error saving passwords')
    }
    setSaving(false)
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  const copyAllCredentials = () => {
    if (!selectedAccount) return
    const text = `Account ID: ${selectedAccount.accountId}\nInvestor Password: ${passwords.investorPassword}\n\nInvestor Login URL: ${window.location.origin}/investor/login`
    navigator.clipboard.writeText(text)
    toast.success('Credentials copied!')
  }

  const filteredAccounts = accounts.filter(acc => 
    acc.accountId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout title="Investor Access" subtitle="Manage investor login credentials">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Eye className="text-green-500" />
              Investor Access Management
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Generate and manage investor login credentials for read-only access</p>
          </div>
          <a 
            href="/investor/login" 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <ExternalLink size={18} />
            Open Investor Login
          </a>
        </div>

        {/* Info Card */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="text-green-500 mt-1" size={24} />
            <div>
              <h3 className="text-green-400 font-semibold mb-1">How Investor Access Works</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>Investor Password:</strong> Read-only access for clients (view only, no trading)</li>
                <li>• Share Account ID + Investor Password with clients for demo/presentation</li>
                <li>• Investor Login URL: <code className={`px-2 py-0.5 rounded text-green-500 ${isDarkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>{window.location.origin}/investor/login</code></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts List */}
          <div className={`rounded-xl border ${isDarkMode ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Account</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by Account ID, Name or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-green-500 ${isDarkMode ? 'bg-dark-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw size={24} className="text-gray-400 animate-spin" />
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No accounts found</div>
              ) : (
                filteredAccounts.map((account) => (
                  <div
                    key={account._id}
                    onClick={() => fetchPasswords(account)}
                    className={`p-4 border-b cursor-pointer transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-dark-700' : 'border-gray-100 hover:bg-gray-50'} ${
                      selectedAccount?._id === account._id ? isDarkMode ? 'bg-dark-700 border-l-4 border-l-green-500' : 'bg-green-50 border-l-4 border-l-green-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-mono font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{account.accountId}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{account.userId?.firstName || account.userId?.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.isDemo && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Demo</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          account.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Credentials Panel */}
          <div className={`rounded-xl border ${isDarkMode ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Investor Credentials</h2>
              {selectedAccount && !loadingPasswords && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    editMode ? 'bg-yellow-500/20 text-yellow-400' : isDarkMode ? 'bg-dark-600 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Edit3 size={16} />
                  {editMode ? 'Cancel Edit' : 'Edit Passwords'}
                </button>
              )}
            </div>
            <div className="p-4">
              {!selectedAccount ? (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Key size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select an account to set credentials</p>
                </div>
              ) : loadingPasswords ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw size={24} className="text-gray-400 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Account Info */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account ID</p>
                    <div className="flex items-center justify-between">
                      <p className={`font-mono text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.accountId}</p>
                      <button 
                        onClick={() => copyToClipboard(selectedAccount.accountId, 'Account ID')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-dark-600 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{selectedAccount.userId?.firstName} - {selectedAccount.userId?.email}</p>
                  </div>

                  {/* Investor Password */}
                  <div className={`p-4 rounded-lg border border-green-500/30 ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investor Password</p>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Read Only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={passwords.investorPassword}
                        onChange={(e) => setPasswords({ ...passwords, investorPassword: e.target.value })}
                        readOnly={!editMode}
                        placeholder={editMode ? "Enter investor password" : "Not set"}
                        className={`flex-1 border rounded-lg px-3 py-2 text-white font-mono text-lg tracking-wider ${
                          editMode 
                            ? isDarkMode ? 'bg-dark-600 border-green-500/50 focus:outline-none focus:border-green-500 text-white' : 'bg-white border-green-500/50 focus:outline-none focus:border-green-500 text-gray-900'
                            : isDarkMode ? 'bg-dark-600 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      {!editMode && passwords.investorPassword && (
                        <button 
                          onClick={() => copyToClipboard(passwords.investorPassword, 'Investor Password')}
                          className={`p-2 rounded-lg ${isDarkMode ? 'bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
                          title="Copy"
                        >
                          <Copy size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Save Button (Edit Mode) */}
                  {editMode && (
                    <button
                      onClick={savePasswords}
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Passwords'}
                    </button>
                  )}

                  {/* Copy All Button (View Mode) */}
                  {!editMode && (
                    <button
                      onClick={copyAllCredentials}
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      <Copy size={18} />
                      Copy All Credentials
                    </button>
                  )}

                  {/* Share Info */}
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-500 text-sm">
                      <strong>Share with client:</strong> Account ID + Investor Password for read-only demo access
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminInvestorAccess
