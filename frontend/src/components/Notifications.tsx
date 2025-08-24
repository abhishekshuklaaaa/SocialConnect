'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNotifications } from './NotificationContext'
import { supabase } from '@/lib/supabase'
import { getRelativeTime } from '@/utils/timeUtils'

interface Notification {
  id: number
  sender: {
    username: string
    avatar_url?: string
  }
  notification_type: string
  message: string
  is_read: boolean
  created_at: string
  post?: {
    id: number
    content: string
  }
}

export default function Notifications() {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { setUnreadCount } = useNotifications()

  useEffect(() => {
    fetchNotifications()
    setupRealtimeSubscription()
  }, [])

  const fetchNotifications = async () => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('notifications_notification')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (error) throw error
      
      const formattedNotifications = data.map(notif => ({
        id: notif.id,
        sender: { username: `user_${notif.sender_id}`, avatar_url: '' },
        notification_type: notif.notification_type,
        message: notif.message,
        is_read: notif.is_read,
        created_at: notif.created_at,
        post: notif.post_id ? { id: notif.post_id, content: 'Post content' } : null
      }))
      
      setLocalNotifications(formattedNotifications)
      const unreadCount = formattedNotifications.filter(n => !n.is_read).length
      setUnreadCount(unreadCount)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications_notification'
      }, (payload) => {
        const newNotif = {
          id: payload.new.id,
          sender: { username: `user_${payload.new.sender_id}`, avatar_url: '' },
          notification_type: payload.new.notification_type,
          message: payload.new.message,
          is_read: payload.new.is_read,
          created_at: payload.new.created_at,
          post: payload.new.post_id ? { id: payload.new.post_id, content: 'Post content' } : null
        }
        setLocalNotifications(prev => [newNotif, ...prev])
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }



  const markAllAsRead = async () => {
    try {
      // Update UI immediately
      setLocalNotifications(localNotifications.map(notif => ({ ...notif, is_read: true })))
      setUnreadCount(0)
      
      // Then make API call (commented out since using mock data)
      // await axios.post('http://127.0.0.1:8000/api/notifications/mark-all-read/')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return '👥'
      case 'like':
        return '❤️'
      case 'comment':
        return '💬'
      default:
        return '🔔'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
              {localNotifications.some(n => !n.is_read) && (
                <button
                  onClick={markAllAsRead}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {localNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              localNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50 dark:bg-slate-700/50' : ''
                  }`}

                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      {notification.sender.avatar_url ? (
                        <img 
                          src={notification.sender.avatar_url} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full" 
                        />
                      ) : (
                        <span className="text-lg">👤</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getNotificationIcon(notification.notification_type)}</span>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          <span className="font-semibold">{notification.sender.username}</span>
                          <span className="ml-1">{notification.message}</span>
                        </p>
                      </div>
                      
                      {notification.post && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-slate-700 rounded text-sm text-gray-600 dark:text-gray-300">
                          "{notification.post.content.substring(0, 50)}..."
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getRelativeTime(notification.created_at)}
                        </span>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}