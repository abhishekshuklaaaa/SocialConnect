'use client'

import { useState, useEffect } from 'react'
import { authAPI } from '@/lib/api'
import { useAuth } from './AuthProvider'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    if (mode === 'signup') {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [])
  
  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode)
    if (loginMode) {
      window.history.pushState({}, '', window.location.pathname)
    } else {
      window.history.pushState({}, '', window.location.pathname + '?mode=signup')
    }
  }
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentBg, setCurrentBg] = useState(0)
  const { login } = useAuth()

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % gradients.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const response = await authAPI.login({
          login: formData.email,
          password: formData.password
        })
        login(response.data.access, response.data.user)
      } else {
        await authAPI.register(formData)
        setIsLogin(true)
        setFormData({
          email: '',
          username: '',
          password: '',
          password_confirm: '',
          first_name: '',
          last_name: ''
        })
        setError('Registration successful! Please login.')
      }
    } catch (err: any) {
      console.error('API Error:', err.response?.data)
      const errorMsg = err.response?.data?.detail || 
                      err.response?.data?.message ||
                      (err.response?.data && typeof err.response.data === 'object' ? 
                        Object.values(err.response.data).flat().join(', ') : 
                        'An error occurred')
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Left Side - Aesthetic Images */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="w-full h-full transition-all duration-1000 bg-cover bg-center"
          style={{
            background: gradients[currentBg]
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center relative">
                  {/* Network nodes */}
                  <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
                  <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2"></div>
                  <div className="w-2 h-2 bg-white rounded-full absolute bottom-2 left-2"></div>
                  <div className="w-2 h-2 bg-white rounded-full absolute bottom-2 right-2"></div>
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  {/* Connection lines */}
                  <svg className="absolute w-12 h-12" viewBox="0 0 48 48" fill="none">
                    <path d="M8 8L24 24M40 8L24 24M8 40L24 24M40 40L24 24" stroke="white" strokeWidth="1.5" opacity="0.7"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl font-bold drop-shadow-2xl mb-4">
                SocialConnect
              </h1>
              <p className="text-xl opacity-90 drop-shadow-lg">
                Connect with friends and the world around you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 rounded-2xl mb-4 relative">
              {/* Network nodes */}
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1.5 left-1.5"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1.5 right-1.5"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute bottom-1.5 left-1.5"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute bottom-1.5 right-1.5"></div>
              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              {/* Connection lines */}
              <svg className="absolute w-10 h-10" viewBox="0 0 40 40" fill="none">
                <path d="M6 6L20 20M34 6L20 20M6 34L20 20M34 34L20 20" stroke="white" strokeWidth="1" opacity="0.7"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              SocialConnect
            </h1>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              
              {!isLogin && (
                <>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                </>
              )}
              
              <input
                type="password"
                required
                className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              
              {!isLogin && (
                <input
                  type="password"
                  required
                  className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
                  placeholder="Confirm Password"
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                />
              )}

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                {loading ? 'Loading...' : (isLogin ? 'Log in' : 'Sign up')}
              </button>
            </form>

            {isLogin && (
              <div className="text-center mt-4">
                <a href="#" className="text-xs text-blue-500 hover:underline">
                  Forgotten your password?
                </a>
              </div>
            )}
          </div>

          {/* Switch Form */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : "Have an account?"}
              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="text-blue-500 hover:text-blue-600 font-semibold ml-1"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">API</a>
            </div>
            <p className="text-xs text-gray-400">
              © 2025 SocialConnect from Meta
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}