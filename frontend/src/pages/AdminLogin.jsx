import { useState } from 'react'

import toast from 'react-hot-toast'

import { useNavigate } from 'react-router-dom'

import { X, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

import logo from '../assets/logo.png'

import { API_URL } from '../config/api'



const AdminLogin = () => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [showNewPassword, setShowNewPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({

    email: '',

    password: ''

  })

  const [mode, setMode] = useState('login')

  const [changeStep, setChangeStep] = useState(1)

  const [changeForm, setChangeForm] = useState({

    email: '',

    oldPassword: '',

    newPassword: '',

    confirmPassword: ''

  })



  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value })

    setError('')

  }



  const handleChangeFormField = (e) => {

    setChangeForm({ ...changeForm, [e.target.name]: e.target.value })

    setError('')

  }



  const resetChangePasswordFlow = () => {

    setMode('login')

    setChangeStep(1)

    setChangeForm({ email: '', oldPassword: '', newPassword: '', confirmPassword: '' })

    setError('')

    setShowNewPassword(false)

    setShowConfirmPassword(false)

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
          password: formData.password
        })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.admin))
        toast.success('Admin login successful!')
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid admin credentials')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to connect to server')
    }

    setLoading(false)
  }



  const handleVerifyOldPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/admin-mgmt/verify-current-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: changeForm.email.trim(),
          oldPassword: changeForm.oldPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setChangeStep(2)
        toast.success(data.message || 'Now enter your new password')
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Verify error:', err)
      setError('Failed to connect to server')
    }

    setLoading(false)
  }



  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/admin-mgmt/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: changeForm.email.trim(),
          oldPassword: changeForm.oldPassword,
          newPassword: changeForm.newPassword,
          confirmPassword: changeForm.confirmPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || 'Password updated')
        resetChangePasswordFlow()
      } else {
        setError(data.message || 'Could not update password')
      }
    } catch (err) {
      console.error('Change password error:', err)
      setError('Failed to connect to server')
    }

    setLoading(false)
  }



  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">

      {/* Background gradient effects */}

      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-red-500/20 to-transparent rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/20 via-red-500/20 to-transparent rounded-full blur-3xl" />

      

      {/* Modal */}

      <div className="relative bg-dark-700 rounded-2xl p-6 sm:p-8 w-full max-w-md border border-gray-800 mx-4 sm:mx-0">

        {/* Close button */}

        <button 

          onClick={() => (mode === 'changePassword' ? resetChangePasswordFlow() : navigate('/'))}

          className="absolute top-4 right-4 w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center hover:bg-dark-500 transition-colors"

        >

          <X size={16} className="text-gray-400" />

        </button>



        {/* Logo */}

        <div className="flex justify-center mb-4">

          <img src={logo} alt="BluecrestaFx" className="h-32 object-contain" />

        </div>



        {mode === 'login' ? (
          <>
            {/* Title */}

            <h1 className="text-2xl font-semibold text-white mb-2">Admin Login</h1>

            <p className="text-gray-500 text-sm mb-4">Enter your admin credentials to continue</p>



            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email field */}

              <div className="relative">

                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input

                  type="email"

                  name="email"

                  placeholder="Admin email"

                  value={formData.email}

                  onChange={handleChange}

                  className="w-full bg-dark-600 border border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"

                />

              </div>



              {/* Password field */}

              <div className="relative">

                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input

                  type={showPassword ? 'text' : 'password'}

                  name="password"

                  placeholder="Admin password"

                  value={formData.password}

                  onChange={handleChange}

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



              {/* Error message */}

              {error && (

                <p className="text-red-500 text-sm">{error}</p>

              )}



              {/* Submit button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors mt-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in as Admin'}
              </button>

            </form>

            <p className="text-center text-gray-500 text-sm mt-3">
              <button
                type="button"
                onClick={() => {
                  setMode('changePassword')
                  setChangeStep(1)
                  setError('')
                  setChangeForm((f) => ({
                    ...f,
                    email: formData.email || f.email
                  }))
                }}
                className="text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Change admin password
              </button>
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={resetChangePasswordFlow}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>

            <h1 className="text-2xl font-semibold text-white mb-2">Change admin password</h1>
            <p className="text-gray-500 text-sm mb-4">
              {changeStep === 1
                ? 'Enter your admin email and current password'
                : 'Choose a new password'}
            </p>

            {changeStep === 1 ? (
              <form onSubmit={handleVerifyOldPassword} className="space-y-4">
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Admin email"
                    value={changeForm.email}
                    onChange={handleChangeFormField}
                    autoComplete="email"
                    className="w-full bg-dark-600 border border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="oldPassword"
                    placeholder="Current password"
                    value={changeForm.oldPassword}
                    onChange={handleChangeFormField}
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
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="New password"
                    value={changeForm.newPassword}
                    onChange={handleChangeFormField}
                    autoComplete="new-password"
                    className="w-full bg-dark-600 border border-gray-700 rounded-lg pl-11 pr-12 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={changeForm.confirmPassword}
                    onChange={handleChangeFormField}
                    autoComplete="new-password"
                    className="w-full bg-dark-600 border border-gray-700 rounded-lg pl-11 pr-12 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </form>
            )}
          </>
        )}



        {/* Info */}

        <p className="text-center text-gray-500 text-sm mt-4">

          Not an admin?{' '}

          <button onClick={() => navigate('/user/login')} className="text-white hover:underline">

            User Login

          </button>

        </p>



        {/* Investor Login Link */}

        <div className="mt-3 pt-3 border-t border-gray-700">

          <p className="text-center text-gray-500 text-sm">

            Trading Account Access?{' '}

            <button onClick={() => navigate('/investor/login')} className="text-green-500 hover:text-green-400 hover:underline font-medium">

              Investor Login

            </button>

          </p>

        </div>

      </div>

    </div>

  )

}



export default AdminLogin
