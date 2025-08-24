'use client'

import { useState } from 'react'

interface PostReactionsProps {
  postId: number
  onReaction: (reaction: string) => void
}

export default function PostReactions({ postId, onReaction }: PostReactionsProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)

  const reactions = ['❤️', '😂', '😮', '😢', '😡', '👍']

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction)
    onReaction(reaction)
    setShowReactions(false)
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <button className="transition-transform hover:scale-110">
        <span className="text-2xl">{selectedReaction || '🤍'}</span>
      </button>
      
      {showReactions && (
        <div className="absolute top-full left-0 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex space-x-1 mt-2 z-10">
          {reactions.map((reaction) => (
            <button
              key={reaction}
              onClick={() => handleReaction(reaction)}
              className="text-2xl hover:scale-125 transition-transform p-1"
            >
              {reaction}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}