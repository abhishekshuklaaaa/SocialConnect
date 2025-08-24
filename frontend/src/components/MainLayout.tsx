'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Feed from './Feed'
import Profile from './Profile'
import CreatePost from './CreatePost'
import Notifications from './Notifications'
import Search from './Search'
import NotificationButton from './NotificationButton'
import ThemeToggle from './ThemeToggle'
import { useNotifications } from './NotificationContext'

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('feed')
  const [searchQuery, setSearchQuery] = useState('')
  const { unreadCount } = useNotifications()

  const renderContent = () => {
    if (searchQuery) {
      return <Search query={searchQuery} onClearSearch={() => setSearchQuery('')} />
    }
    
    switch (activeTab) {
      case 'feed':
        return <Feed />
      case 'profile':
        return <Profile />
      case 'user-profile':
        const userId = new URLSearchParams(window.location.search).get('userId')
        return <Profile userId={userId || undefined} />
      case 'create':
        return <CreatePost onClose={() => setActiveTab('feed')} />
      case 'notifications':
        return <Notifications />
      default:
        return <Feed />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-40 px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400">✕</button>
            )}
          </div>
        </div>
        
        {/* Mobile Content */}
        <div className="pb-16">
          {renderContent()}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50">
          <div className="flex justify-around py-2">
            <button onClick={() => setActiveTab('feed')} className={`p-3 ${activeTab === 'feed' ? 'text-blue-500' : 'text-gray-600'}`}>
              🏠
            </button>
            <button onClick={() => setActiveTab('create')} className={`p-3 ${activeTab === 'create' ? 'text-blue-500' : 'text-gray-600'}`}>
              ➕
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`p-3 relative ${activeTab === 'notifications' ? 'text-blue-500' : 'text-gray-600'}`}>
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            <button onClick={() => setActiveTab('profile')} className={`p-3 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-600'}`}>
              👤
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 max-w-2xl mx-auto">
          <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-40 px-4 py-3">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400">✕</button>
                )}
              </div>
              <ThemeToggle />
              <NotificationButton />
            </div>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}