'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RealtimeTest() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('notifications_notification').select('count').limit(1)
        if (error) {
          setMessages(prev => [...prev, `❌ Connection error: ${error.message}`])
        } else {
          setConnected(true)
          setMessages(prev => [...prev, '✅ Connected to Supabase'])
        }
      } catch (err) {
        setMessages(prev => [...prev, `❌ Connection failed: ${err}`])
      }
    }

    testConnection()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('test-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications_notification'
        },
        (payload) => {
          setMessages(prev => [...prev, `🔔 New notification: ${JSON.stringify(payload.new)}`])
        }
      )
      .subscribe((status) => {
        setMessages(prev => [...prev, `📡 Subscription status: ${status}`])
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Real-time Test</h3>
      <div className="mb-2">
        Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="font-mono text-xs">{msg}</div>
        ))}
      </div>
    </div>
  )
}