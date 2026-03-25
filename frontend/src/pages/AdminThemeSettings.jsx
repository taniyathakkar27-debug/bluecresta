import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../components/AdminLayout'
import { 
  Palette, 
  Check, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Eye,
  Save,
  X
} from 'lucide-react'
import { API_URL } from '../config/api'
import { useTheme } from '../context/ThemeContext'

const AdminThemeSettings = () => {
  const [themes, setThemes] = useState([])
  const [presets, setPresets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTheme, setActiveTheme] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [newThemeName, setNewThemeName] = useState('')
  const [editColors, setEditColors] = useState({})
  const { isDarkMode } = useTheme()

  useEffect(() => {
    fetchThemes()
    fetchPresets()
  }, [])

  const fetchThemes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/theme/all`)
      const data = await res.json()
      if (data.success) {
        setThemes(data.themes || [])
        const active = data.themes?.find(t => t.isActive)
        setActiveTheme(active)
      }
    } catch (error) {
      console.error('Error fetching themes:', error)
    }
    setLoading(false)
  }

  const fetchPresets = async () => {
    try {
      const res = await fetch(`${API_URL}/theme/presets`)
      const data = await res.json()
      if (data.success) {
        setPresets(data.presets || [])
      }
    } catch (error) {
      console.error('Error fetching presets:', error)
    }
  }

  const applyPreset = async (presetName) => {
    try {
      const res = await fetch(`${API_URL}/theme/apply-preset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetName })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setMessage({ type: 'success', text: data.message })
        fetchThemes()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error applying preset' })
    }
  }

  const activateTheme = async (themeId) => {
    try {
      const res = await fetch(`${API_URL}/theme/${themeId}/activate`, {
        method: 'PUT'
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setMessage({ type: 'success', text: data.message })
        fetchThemes()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error activating theme' })
    }
  }

  const deleteTheme = async (themeId) => {
    if (!confirm('Are you sure you want to delete this theme?')) return
    try {
      const res = await fetch(`${API_URL}/theme/${themeId}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setMessage({ type: 'success', text: data.message })
        fetchThemes()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting theme' })
    }
  }

  const createTheme = async () => {
    if (!newThemeName.trim()) {
      setMessage({ type: 'error', text: 'Theme name is required' })
      return
    }
    try {
      const res = await fetch(`${API_URL}/theme/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newThemeName, isActive: false })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setMessage({ type: 'success', text: data.message })
        setShowCreateModal(false)
        setNewThemeName('')
        fetchThemes()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating theme' })
    }
  }

  const openEditModal = (theme) => {
    setSelectedTheme(theme)
    setEditColors(theme.colors || {})
    setShowEditModal(true)
  }

  const updateTheme = async () => {
    try {
      const res = await fetch(`${API_URL}/theme/${selectedTheme._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors: editColors })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Theme updated successfully')
        setMessage({ type: 'success', text: 'Theme updated successfully' })
        setShowEditModal(false)
        fetchThemes()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating theme' })
    }
  }

  const colorGroups = [
    {
      title: 'Primary Colors',
      colors: ['primary', 'primaryHover', 'secondary', 'secondaryHover', 'accent', 'accentHover']
    },
    {
      title: 'Background Colors',
      colors: ['bgPrimary', 'bgSecondary', 'bgCard', 'bgHover']
    },
    {
      title: 'Text Colors',
      colors: ['textPrimary', 'textSecondary', 'textMuted']
    },
    {
      title: 'Border Colors',
      colors: ['border', 'borderLight']
    },
    {
      title: 'Status Colors',
      colors: ['success', 'error', 'warning', 'info']
    },
    {
      title: 'Trading Colors',
      colors: ['buyColor', 'sellColor', 'profitColor', 'lossColor']
    },
    {
      title: 'Sidebar Colors',
      colors: ['sidebarBg', 'sidebarText', 'sidebarActive']
    },
    {
      title: 'Button Colors',
      colors: ['buttonPrimary', 'buttonSecondary', 'buttonDanger']
    }
  ]

  const formatColorName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  return (
    <AdminLayout title="Theme Settings" subtitle="Customize user dashboard appearance">
      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })} className="float-right">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Preset Themes */}
      <div className={`rounded-xl border p-5 mb-6 ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Palette size={20} className="text-purple-500" />
            </div>
            <div>
              <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Theme Presets</h2>
              <p className="text-gray-500 text-sm">Click to apply a preset theme instantly</p>
            </div>
          </div>
          <button onClick={fetchThemes} className={`p-2 rounded-lg ${isDarkMode ? 'bg-dark-700 hover:bg-dark-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <RefreshCw size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.name)}
              className={`p-3 rounded-xl border transition-all hover:scale-105 ${
                activeTheme?.name === preset.name 
                  ? 'border-green-500 bg-green-500/10' 
                  : isDarkMode ? 'border-gray-700 bg-dark-700 hover:border-gray-600' : 'border-gray-200 bg-gray-50 hover:border-gray-400'
              }`}
            >
              <div 
                className="w-full h-8 rounded-lg mb-2 flex overflow-hidden"
                style={{ backgroundColor: preset.colors.bgPrimary }}
              >
                <div className="w-1/3 h-full" style={{ backgroundColor: preset.colors.primary }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: preset.colors.accent }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: preset.colors.secondary }} />
              </div>
              <p className={`text-xs font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{preset.name}</p>
              {activeTheme?.name === preset.name && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Check size={12} className="text-green-500" />
                  <span className="text-green-500 text-[10px]">Active</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Themes */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div>
            <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Custom Themes</h2>
            <p className="text-gray-500 text-sm">{themes.length} themes configured</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={16} />
            Create Theme
          </button>
        </div>

        {loading ? (
          <div className={`p-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loading themes...</div>
        ) : themes.length === 0 ? (
          <div className={`p-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p>No custom themes yet.</p>
            <p className="text-sm mt-2">Apply a preset or create a new theme.</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div 
                key={theme._id} 
                className={`p-4 rounded-xl border ${
                  theme.isActive 
                    ? 'border-green-500 bg-green-500/5' 
                    : isDarkMode ? 'border-gray-700 bg-dark-700' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{theme.name}</h3>
                    {theme.isActive && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">Active</span>
                    )}
                  </div>
                </div>

                {/* Color Preview */}
                <div 
                  className={`w-full h-12 rounded-lg mb-3 flex overflow-hidden border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  style={{ backgroundColor: theme.colors?.bgPrimary || '#000' }}
                >
                  <div className="w-1/4 h-full" style={{ backgroundColor: theme.colors?.primary || '#3B82F6' }} />
                  <div className="w-1/4 h-full" style={{ backgroundColor: theme.colors?.accent || '#F59E0B' }} />
                  <div className="w-1/4 h-full" style={{ backgroundColor: theme.colors?.secondary || '#10B981' }} />
                  <div className="w-1/4 h-full" style={{ backgroundColor: theme.colors?.error || '#EF4444' }} />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!theme.isActive && (
                    <button
                      onClick={() => activateTheme(theme._id)}
                      className="flex-1 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 text-sm flex items-center justify-center gap-1"
                    >
                      <Check size={14} />
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(theme)}
                    className="flex-1 py-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 text-sm flex items-center justify-center gap-1"
                  >
                    <Eye size={14} />
                    Edit
                  </button>
                  {!theme.isActive && (
                    <button
                      onClick={() => deleteTheme(theme._id)}
                      className="py-2 px-3 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Theme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl border w-full max-w-md p-6 ${isDarkMode ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create New Theme</h3>
              <button onClick={() => setShowCreateModal(false)} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Theme Name</label>
              <input
                type="text"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="e.g., My Custom Theme"
                className={`w-full border rounded-lg px-4 py-3 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 py-3 rounded-lg ${isDarkMode ? 'bg-dark-700 text-gray-400 hover:bg-dark-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={createTheme}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Theme Modal */}
      {showEditModal && selectedTheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`rounded-xl border w-full max-w-4xl p-6 my-8 ${isDarkMode ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Theme: {selectedTheme.name}</h3>
              <button onClick={() => setShowEditModal(false)} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
              {colorGroups.map((group) => (
                <div key={group.title} className={`rounded-lg p-4 ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50 border border-gray-200'}`}>
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.title}</h4>
                  <div className="space-y-3">
                    {group.colors.map((colorKey) => (
                      <div key={colorKey} className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formatColorName(colorKey)}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editColors[colorKey] || '#000000'}
                            onChange={(e) => setEditColors({ ...editColors, [colorKey]: e.target.value })}
                            className="w-10 h-8 rounded cursor-pointer border-0"
                          />
                          <input
                            type="text"
                            value={editColors[colorKey] || ''}
                            onChange={(e) => setEditColors({ ...editColors, [colorKey]: e.target.value })}
                            className={`w-24 border rounded px-2 py-1 text-xs ${isDarkMode ? 'bg-dark-600 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex gap-3 mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowEditModal(false)}
                className={`flex-1 py-3 rounded-lg ${isDarkMode ? 'bg-dark-700 text-gray-400 hover:bg-dark-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={updateTheme}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminThemeSettings
