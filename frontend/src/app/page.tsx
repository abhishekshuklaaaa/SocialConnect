'use client'

import { useAuth } from '@/components/AuthProvider'
import LoginForm from '@/components/LoginForm'
import MainLayout from '@/components/MainLayout'

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 rounded-2xl mb-4 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
            <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2"></div>
            <div className="w-2 h-2 bg-white rounded-full absolute bottom-2 left-2"></div>
            <div className="w-2 h-2 bg-white rounded-full absolute bottom-2 right-2"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">SocialConnect</h1>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <MainLayout />
  }
  
  return <LoginForm />
}