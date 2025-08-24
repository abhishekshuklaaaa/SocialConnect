'use client'

import { useState } from 'react'

interface AIContentSuggestionProps {
  onSuggestion: (content: string) => void
}

export default function AIContentSuggestion({ onSuggestion }: AIContentSuggestionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const suggestions = [
    "What's inspiring you today? ✨",
    "Share a moment that made you smile 😊",
    "What's one thing you're grateful for? 🙏",
    "Drop a photo of your current mood 📸",
    "What's your favorite quote right now? 💭",
    "Share something you learned today 🧠",
    "What's your go-to comfort food? 🍕",
    "Describe your perfect weekend 🌟"
  ]

  const handleSuggestion = (suggestion: string) => {
    onSuggestion(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="p-2 text-purple-500 hover:text-purple-600 transition-colors"
        title="AI Content Suggestions"
      >
        🤖
      </button>
      
      {showSuggestions && (
        <div className="absolute top-full right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 mt-2 w-80 z-20">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">AI Content Ideas</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestion(suggestion)}
                className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}