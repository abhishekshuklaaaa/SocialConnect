'use client'

import { useAuth } from './AuthProvider'
import { useNotifications } from './NotificationContext'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout } = useAuth()
  const { unreadCount, setUnreadCount } = useNotifications()

  const menuItems = [
    { id: 'feed', label: 'Home', icon: '🏠' },
    { id: 'create', label: 'Create', icon: '➕' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SocialConnect</h1>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id)
              if (item.id === 'notifications' && unreadCount > 0) {
                setUnreadCount(0)
              }
            }}
            className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900 ${
              activeTab === item.id ? 'bg-blue-50 dark:bg-gray-900 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
            </div>
            {item.id === 'notifications' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar.startsWith('http') ? user.avatar : `http://127.0.0.1:8000${user.avatar}`} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-lg text-gray-600 dark:text-gray-300">👤</span>
            )}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900 dark:text-white">{user?.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}