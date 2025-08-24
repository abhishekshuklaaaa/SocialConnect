'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from './NotificationContext'
import { showToast } from './Toast'
import { supabase } from '@/lib/supabase'
import { getRelativeTime } from '@/utils/timeUtils'

interface Notification {
  id: number
  recipient_id: number
  sender_id: number
  notification_type: string
  message: string
  is_read: boolean
  created_at: string
}

const typeIcons = {
  like: '❤️',
  follow: '➕',
  comment: '💬'
}

export default function NotificationButton() {
  const { unreadCount, notifications, setAllNotifications, addNotification, setUnreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notifications_notification')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      
      const formattedNotifications = data.map(notif => ({
        id: notif.id,
        recipient_id: notif.recipient_id,
        sender_id: notif.sender_id,
        notification_type: notif.notification_type,
        message: notif.message,
        is_read: notif.is_read,
        created_at: notif.created_at
      }))
      
      // Set notifications and maintain unread count
      setAllNotifications(formattedNotifications)
      
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBellClick = async () => {
    if (!isOpen) {
      await fetchNotifications()
    }
    setIsOpen(!isOpen)
    // Don't reset count when opening/closing
  }

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('notifications_realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications_notification'
      }, (payload) => {
        const newNotif = {
          id: payload.new.id,
          recipient_id: payload.new.recipient_id,
          sender_id: payload.new.sender_id,
          notification_type: payload.new.notification_type,
          message: payload.new.message,
          is_read: payload.new.is_read,
          created_at: payload.new.created_at
        }
        addNotification(newNotif)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [addNotification])

  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString()

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {displayCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-3">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">✨</div>
                <p>You're all caught up</p>
              </div>
            ) : (
              <>
                {notifications.some(n => !n.is_read) && (
                  <div className="p-2 border-b">
                    <button 
                      onClick={() => setUnreadCount(0)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700 ${!notification.is_read ? 'bg-blue-50 dark:bg-slate-700/50' : ''}`}
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            👤
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {getRelativeTime(notification.created_at)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-lg">
                              {typeIcons[notification.notification_type as keyof typeof typeIcons] || '🔔'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}