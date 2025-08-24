'use client'

import { useEffect, useRef } from 'react'
import { useNotifications } from './NotificationContext'
import { showToast } from './Toast'

const MOCK_USERS = [
  { id: 101, username: 'john_doe', avatar: '👨‍💻' },
  { id: 102, username: 'jane_smith', avatar: '👩‍🎨' },
  { id: 103, username: 'mike_wilson', avatar: '👨‍🚀' },
  { id: 104, username: 'sarah_jones', avatar: '👩‍🔬' },
  { id: 105, username: 'alex_brown', avatar: '👨‍🎵' },
]

const MOCK_POSTS = [
  { content: "Just finished an amazing workout! 💪", image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop' },
  { content: "Beautiful sunset today 🌅", image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop' },
  { content: "Coffee and coding ☕️💻", image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop' },
  { content: "Weekend vibes! 🎉", image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop' },
  { content: "New project coming soon... 🚀", image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop' },
  { content: "Learning something new every day 📚", image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop' },
  { content: "Great meeting with the team today!", image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop' },
  { content: "Exploring new places 🗺️", image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop' },
  { content: "Delicious dinner tonight 🍽️", image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=500&fit=crop' },
  { content: "Grateful for good friends ❤️", image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=500&fit=crop' }
]

interface AutoPostGeneratorProps {
  onNewPost: (post: any) => void
  silentMode: boolean
}

export default function AutoPostGenerator({ onNewPost, silentMode }: AutoPostGeneratorProps) {
  const { setUnreadCount } = useNotifications()
  const intervalRef = useRef<NodeJS.Timeout>()

  const generateRandomPost = () => {
    const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]
    const randomPost = MOCK_POSTS[Math.floor(Math.random() * MOCK_POSTS.length)]
    
    const newPost = {
      id: Date.now(),
      content: randomPost.content,
      image_url: randomPost.image,
      author: {
        id: randomUser.id,
        username: randomUser.username,
        avatar: randomUser.avatar
      },
      created_at: new Date().toISOString(),
      time_ago: 'Just now',
      like_count: Math.floor(Math.random() * 10),
      comment_count: Math.floor(Math.random() * 5),
      is_liked: false
    }

    onNewPost(newPost)

    // Show notification if not in silent mode
    if (!silentMode) {
      showToast(`${randomUser.username} posted: ${randomPost.content.substring(0, 30)}...`, 'info')
      
      // Update notification count
      setUnreadCount(prev => prev + 1)
    }
  }

  useEffect(() => {
    // Generate posts every 1-3 minutes
    const startInterval = () => {
      const randomDelay = Math.random() * 120000 + 60000 // 1-3 minutes
      intervalRef.current = setTimeout(() => {
        generateRandomPost()
        startInterval() // Schedule next post
      }, randomDelay)
    }

    startInterval()

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [silentMode])

  return null // This component doesn't render anything
}