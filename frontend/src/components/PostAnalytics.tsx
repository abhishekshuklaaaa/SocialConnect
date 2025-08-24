'use client'

import { useState, useEffect } from 'react'

interface PostAnalyticsProps {
  postId: number
  isOwner: boolean
}

export default function PostAnalytics({ postId, isOwner }: PostAnalyticsProps) {
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [analytics, setAnalytics] = useState({
    views: Math.floor(Math.random() * 1000) + 50,
    reach: Math.floor(Math.random() * 800) + 30,
    engagement: Math.floor(Math.random() * 200) + 10,
    saves: Math.floor(Math.random() * 50) + 5
  })

  if (!isOwner) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="text-gray-500 hover:text-gray-700 text-sm"
      >
        📊 Analytics
      </button>
      
      {showAnalytics && (
        <div className="absolute top-full right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 mt-2 w-64 z-20">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Post Analytics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.views}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Reach</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.reach}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.engagement}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Saves</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.saves}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}