import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../components/AdminLayout'
import { 
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  RefreshCw,
  CreditCard
} from 'lucide-react'
import { API_URL } from '../config/api'
import { useTheme } from '../context/ThemeContext'

const AdminAccountTypes = () => {
  const [accountTypes, setAccountTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { isDarkMode } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minDeposit: '',
    leverage: '1:100',
    exposureLimit: '',
    minSpread: '0',
    commission: '0',
    isActive: true,
    isDemo: false,
    demoBalance: '10000'
  })

  useEffect(() => {
    fetchAccountTypes()
  }, [])

  const fetchAccountTypes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/account-types/all`)
      const data = await res.json()
      setAccountTypes(data.accountTypes || [])
    } catch (error) {
      console.error('Error fetching account types:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.minDeposit || !formData.leverage) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const url = editingType 
        ? `${API_URL}/account-types/${editingType._id}`
        : `${API_URL}/account-types`
      
      const res = await fetch(url, {
        method: editingType ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          minDeposit: parseFloat(formData.minDeposit),
          exposureLimit: formData.exposureLimit ? parseFloat(formData.exposureLimit) : 0,
          minSpread: parseFloat(formData.minSpread) || 0,
          commission: parseFloat(formData.commission) || 0,
          isDemo: formData.isDemo,
          demoBalance: formData.isDemo ? parseFloat(formData.demoBalance) : 0
        })
      })
      const data = await res.json()
      
      if (res.ok) {
        toast.success(editingType ? 'Account type updated!' : 'Account type created!')
        setSuccess(editingType ? 'Account type updated!' : 'Account type created!')
        setShowModal(false)
        resetForm()
        fetchAccountTypes()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error saving account type')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this account type?')) return

    try {
      const res = await fetch(`${API_URL}/account-types/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        toast.success('Account type deleted!')
        setSuccess('Account type deleted!')
        fetchAccountTypes()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError('Error deleting account type')
    }
  }

  const handleToggleActive = async (type) => {
    try {
      const res = await fetch(`${API_URL}/account-types/${type._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...type, isActive: !type.isActive })
      })
      
      if (res.ok) {
        fetchAccountTypes()
      }
    } catch (error) {
      setError('Error updating account type')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      minDeposit: '',
      leverage: '1:100',
      exposureLimit: '',
      minSpread: '0',
      commission: '0',
      isActive: true,
      isDemo: false,
      demoBalance: '10000'
    })
    setEditingType(null)
    setError('')
  }

  const openEditModal = (type) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      description: type.description || '',
      minDeposit: type.minDeposit.toString(),
      leverage: type.leverage,
      exposureLimit: type.exposureLimit?.toString() || '',
      minSpread: type.minSpread?.toString() || '0',
      commission: type.commission?.toString() || '0',
      isActive: type.isActive,
      isDemo: type.isDemo || false,
      demoBalance: type.demoBalance?.toString() || '10000'
    })
    setShowModal(true)
    setError('')
  }

  return (
    <AdminLayout title="Account Types" subtitle="Manage trading account types">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus size={18} /> Add Account Type
        </button>
      </div>

      <div>
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 flex items-center gap-2">
              <Check size={18} /> {success}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw size={24} className="text-gray-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {accountTypes.map((type) => (
                <div key={type._id} className={`rounded-lg p-4 border ${type.isActive ? isDarkMode ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-200' : isDarkMode ? 'bg-dark-800 border-red-500/30 opacity-60' : 'bg-white border-red-500/30 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{type.name}</h3>
                      {type.isDemo && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-500">DEMO</span>
                      )}
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${type.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {type.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className={`text-xs mb-3 line-clamp-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{type.description || 'No description'}</p>
                  <div className="space-y-1.5 mb-3 text-xs">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Min Deposit</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>${type.minDeposit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Leverage</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{type.leverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Exposure</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>${type.exposureLimit || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Min Spread</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{type.minSpread || 0} pips</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Commission</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{type.commission > 0 ? `$${type.commission}` : 'NO COMM'}</span>
                    </div>
                    {type.isDemo && (
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Demo Bal</span>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>${type.demoBalance || 10000}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEditModal(type)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-colors ${isDarkMode ? 'bg-dark-700 text-white hover:bg-dark-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(type)}
                      className={`flex-1 py-1.5 rounded transition-colors text-xs ${type.isActive ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
                    >
                      {type.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(type._id)}
                      className="px-2 py-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {accountTypes.length === 0 && (
                <div className={`col-span-3 rounded-xl p-8 border text-center ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <CreditCard size={48} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>No account types created yet</p>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 w-full max-w-md border max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingType ? 'Edit Account Type' : 'Create Account Type'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Account Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Standard, Premium, VIP"
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Account type description"
                  rows={2}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Min Deposit ($) *</label>
                  <input
                    type="number"
                    value={formData.minDeposit}
                    onChange={(e) => setFormData({ ...formData, minDeposit: e.target.value })}
                    placeholder="100"
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Leverage *</label>
                  <div className="flex items-center gap-2">
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>1:</span>
                    <input
                      type="number"
                      min="1"
                      value={formData.leverage.replace('1:', '')}
                      onChange={(e) => setFormData({ ...formData, leverage: `1:${e.target.value}` })}
                      placeholder="100"
                      className={`flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Enter any leverage value (e.g., 100, 500, 1000, 2000)</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Exposure Limit ($)</label>
                <input
                  type="number"
                  value={formData.exposureLimit}
                  onChange={(e) => setFormData({ ...formData, exposureLimit: e.target.value })}
                  placeholder="0 for unlimited"
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>

              {/* Min Spread and Commission */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Min Spread (pips)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minSpread}
                    onChange={(e) => setFormData({ ...formData, minSpread: e.target.value })}
                    placeholder="0"
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Commission ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.commission}
                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    placeholder="0"
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
              </div>

              {/* Demo Account Toggle */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-dark-700 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Demo Account</label>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Enable this for practice/demo accounts with virtual funds</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isDemo: !formData.isDemo })}
                    className={`w-12 h-6 rounded-full transition-colors ${formData.isDemo ? 'bg-yellow-500' : 'bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${formData.isDemo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                
                {formData.isDemo && (
                  <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Demo Balance ($)</label>
                    <input
                      type="number"
                      value={formData.demoBalance}
                      onChange={(e) => setFormData({ ...formData, demoBalance: e.target.value })}
                      placeholder="10000"
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 ${isDarkMode ? 'bg-dark-600 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                    />
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Virtual balance users will receive when opening this account type</p>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className={`flex-1 py-3 rounded-lg transition-colors ${isDarkMode ? 'bg-dark-700 text-white hover:bg-dark-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-red-500 text-white font-medium py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                {editingType ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminAccountTypes
