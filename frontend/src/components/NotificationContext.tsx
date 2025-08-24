'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

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