import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.png'
import { API_URL } from '../config/api'
import { setAdminSession } from '../utils/adminSession'

const SubAdminLogin = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/admin-mgmt/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          portal: 'sub',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAdminSession(data.token, data.admin)
        toast.success('Sub-admin login successful!')
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      console.error('Sub-admin login error:', err)
      setError('Failed to connect to server')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-red-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/20 via-red-500/20 to-transparent rounded-full blur-3xl" />

      <div className="relative bg-dark-700 rounded-2xl p-6 sm:p-8 w-full max-w-md border border-gray-800 mx-4 sm:mx-0">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center hover:bg-dark-500 transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>

        <div className="flex justify-center mb-4">
          <img src={logo} alt="BluecrestaFx" className="h-32 object-contain" />
        </div>

        <h1 className="text-2xl font-semibold text-white mb-2">Sub-Admin Login</h1>
        <p className="text-gray-500 text-sm mb-4">Enter your sub-admin credentials to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Sub-admin email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full bg-dark-600 border border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Sub-admin password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full bg-dark-600 border border-gray-700 rounded-lg pl-11 pr-12 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in as Sub-Admin'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-3">
          Super admin?{' '}
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Admin Login
          </button>
        </p>

        <p className="text-center text-gray-500 text-sm mt-4">
          Not an admin?{' '}
          <button type="button" onClick={() => navigate('/user/login')} className="text-white hover:underline">
            User Login
          </button>
        </p>

        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-center text-gray-500 text-sm">
            Trading Account Access?{' '}
            <button
              type="button"
              onClick={() => navigate('/investor/login')}
              className="text-green-500 hover:text-green-400 hover:underline font-medium"
            >
              Investor Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SubAdminLogin
