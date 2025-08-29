'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

interface Notification {
  id: number
  recipient_id: number
  sender_id: number
  notification_type: string
  message: string
  is_read: boolean
  created_at: string
}

interface NotificationContextType {
  unreadCount: number
  notifications: Notification[]
  setUnreadCount: (count: number) => void
  addNotification: (notification: Notification) => void
  setAllNotifications: (notifications: Notification[]) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications_notification',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload.new)
          addNotification(payload.new as Notification)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      // Avoid duplicates
      const exists = prev.find(n => n.id === notification.id)
      if (exists) return prev
      return [notification, ...prev]
    })
    if (!notification.is_read) {
      setUnreadCount(prev => prev + 1)
    }
  }

  const updateUnreadCount = (count: number) => {
    setUnreadCount(Math.max(0, count))
  }

  const setAllNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications)
    // Only update count if it's not already set (initial load)
    if (unreadCount === 0) {
      const unread = newNotifications.filter(n => !n.is_read).length
      setUnreadCount(unread)
    }
  }

  return (
    <NotificationContext.Provider value={{ 
      unreadCount, 
      notifications, 
      setUnreadCount: updateUnreadCount, 
      addNotification,
      setAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}