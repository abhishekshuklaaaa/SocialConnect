'use client'

import { useState } from 'react'
import { postsAPI } from '@/lib/api'
import { useAuth } from './AuthProvider'
import PostAnalytics from './PostAnalytics'

interface Post {
  id: number
  content: string
  image_url?: string
  author: {
    id: number
    username: string
    avatar?: string
    avatar_url?: string
  }
  created_at: string
  time_ago: string
  like_count: number
  comment_count: number
  is_liked?: boolean
}

interface PostCardProps {
  post: Post
  onLike: (postId: number, isLiked: boolean) => void
  onDelete?: (postId: number) => void
  onUserClick?: (userId: number) => void
}

export default function PostCard({ post, onLike, onDelete, onUserClick }: PostCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)



  const loadComments = async () => {
    if (showComments) {
      setShowComments(false)
      return
    }
    
    setLoadingComments(true)
    try {
      // Handle mock posts (id > 1000) with stored comments
      if (post.id > 1000) {
        const key = `comments_${post.id}`
        const storedComments = localStorage.getItem(key)
        const mockComments = storedComments ? JSON.parse(storedComments) : [
          {
            id: 1,
            content: 'Great post!',
            author: { username: 'john_doe' },
            created_at: new Date().toISOString()
          }
        ]
        setComments(mockComments)
      } else {
        const response = await postsAPI.getComments(post.id.toString())
        setComments(response.data.results || response.data)
      }
      setShowComments(true)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      // Handle mock posts (id > 1000) locally
      if (post.id > 1000) {
        const mockComment = {
          id: Date.now(),
          content: newComment,
          author: { 
            username: user?.username || 'You',
            avatar: user?.avatar,
            avatar_url: user?.avatar_url
          },
          created_at: new Date().toISOString()
        }
        const updatedComments = [...comments, mockComment]
        setComments(updatedComments)
        
        // Save to localStorage
        const key = `comments_${post.id}`
        localStorage.setItem(key, JSON.stringify(updatedComments))
        setNewComment('')
      } else {
        await postsAPI.addComment(post.id.toString(), { content: newComment })
        setNewComment('')
        loadComments() // Reload comments
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      if (post.id > 1000) {
        // Handle mock posts locally
        const updatedComments = comments.filter(c => c.id !== commentId)
        setComments(updatedComments)
        const key = `comments_${post.id}`
        localStorage.setItem(key, JSON.stringify(updatedComments))
      } else {
        await postsAPI.deleteComment(commentId.toString())
        loadComments() // Reload comments
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-0 md:border border-gray-200 dark:border-gray-700 rounded-none md:rounded-lg shadow-sm mb-1 md:mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full p-0.5">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              {post.author.avatar && !post.author.avatar.startsWith('http') ? (
                <span className="text-lg">{post.author.avatar}</span>
              ) : post.author.avatar ? (
                <img src={post.author.avatar.startsWith('http') ? post.author.avatar : `http://127.0.0.1:8000${post.author.avatar}`} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
              ) : post.author.avatar_url ? (
                <img src={post.author.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <span className="text-sm">👤</span>
              )}
            </div>
          </div>
          <div className="ml-3">
            <button 
              onClick={() => onUserClick?.(post.author.id)}
              className="font-semibold text-sm text-gray-900 dark:text-white hover:text-blue-600"
            >
              {post.author.username}
            </button>
            <p className="text-xs text-gray-500">{post.time_ago}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <PostAnalytics postId={post.id} isOwner={user?.id === post.author.id} />
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-lg">⋯</span>
          </button>
        </div>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="w-full">
          <img src={post.image_url} alt="Post" className="w-full h-auto" />
        </div>
      )}

      {/* Actions */}
      <div className="px-3 md:px-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id, post.is_liked || false)}
              className={`transition-transform hover:scale-110 ${post.is_liked ? 'text-red-500' : 'text-gray-700'}`}
            >
              <span className="text-2xl">{post.is_liked ? '❤️' : '🤍'}</span>
            </button>
            
            <button
              onClick={loadComments}
              className="text-gray-700 hover:text-gray-500 transition-transform hover:scale-110"
            >
              <span className="text-2xl">💬</span>
            </button>
            
            <button
              onClick={() => {
                const postUrl = `${window.location.origin}?post=${post.id}`
                if (navigator.share) {
                  navigator.share({
                    title: `${post.author.username}'s post`,
                    text: post.content,
                    url: postUrl
                  })
                } else {
                  navigator.clipboard.writeText(postUrl)
                  alert('Post link copied to clipboard!')
                }
              }}
              className="text-gray-700 hover:text-gray-500 transition-transform hover:scale-110"
            >
              <span className="text-2xl">📤</span>
            </button>
          </div>
          
          {user?.id === post.author.id && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="text-xl">🗑️</span>
            </button>
          )}
        </div>
        
        {/* Like count */}
        {post.like_count > 0 && (
          <p className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">{post.like_count} likes</p>
        )}

        {/* Content */}
        <div className="mb-2">
          <span className="font-semibold text-sm dark:text-white">{post.author.username}</span>
          <span className="ml-2 text-sm dark:text-gray-300">{post.content}</span>
        </div>
        
        {/* View comments */}
        {post.comment_count > 0 && (
          <button
            onClick={loadComments}
            className="text-sm text-gray-500 mb-2 hover:text-gray-700"
          >
            View all {post.comment_count} comments
          </button>
        )}

        {/* Comments */}
        {showComments && (
          <div className="mt-4 space-y-2">
            {loadingComments ? (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : (
              <>
                {comments.map((comment: any) => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {comment.author.avatar ? (
                        comment.author.avatar.startsWith('http') ? (
                          <img src={comment.author.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <span className="text-xs">{comment.author.avatar}</span>
                        )
                      ) : comment.author.avatar_url ? (
                        <img src={comment.author.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <span className="text-xs">👤</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author.username}</span>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">{comment.content}</span>
                        </div>
                        {(user?.username === comment.author.username || user?.id === comment.author.id) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-500 text-xs"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <form onSubmit={handleAddComment} className="flex items-center space-x-2 mt-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar.startsWith('http') ? user.avatar : `http://127.0.0.1:8000${user.avatar}`} alt="Your Avatar" className="w-6 h-6 rounded-full object-cover" />
                    ) : user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Your Avatar" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <span className="text-xs">👤</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="text-blue-500 font-semibold text-sm"
                  >
                    Post
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}