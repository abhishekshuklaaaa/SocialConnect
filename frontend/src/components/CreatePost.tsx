'use client'

import { useState } from 'react'
import { postsAPI } from '@/lib/api'
import { showToast } from './Toast'
import AIContentSuggestion from './AIContentSuggestion'

interface CreatePostProps {
  onClose: () => void
}

export default function CreatePost({ onClose }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('general')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('category', category)
      if (image) {
        formData.append('image', image)
      }
      
      const response = await postsAPI.createPost(formData)
      showToast('Post shared successfully! 🎉', 'success')
      // Reset form
      setContent('')
      setImage(null)
      setImagePreview(null)
      onClose()
      // Refresh page to show new post
      window.location.reload()
    } catch (error: any) {
      console.error('Error creating post:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      let errorMessage = 'Failed to share post. Please try again.'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create New Post</h2>
            <div className="flex items-center space-x-2">
              <AIContentSuggestion onSuggestion={(content) => setContent(content)} />
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={280}
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              rows={4}
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {content.length}/280
            </div>
          </div>

          <div className="mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            >
              <option value="general">General</option>
              <option value="announcement">Announcement</option>
              <option value="question">Question</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Image (optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="mt-2 text-red-500 dark:text-red-400 text-sm"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Share Post'}
          </button>
        </form>
      </div>
    </div>
  )
}