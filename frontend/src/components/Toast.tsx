'use client'

import { useState, useEffect } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
let toastListeners: ((toast: Toast) => void)[] = []

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const toast: Toast = {
    id: ++toastId,
    message,
    type
  }
  toastListeners.forEach(listener => listener(toast))
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 3000)
    }
    
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>
              {toast.type === 'success' ? '✅' : 
               toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}