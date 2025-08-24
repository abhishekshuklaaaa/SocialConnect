'use client'

import { useState, useEffect } from 'react'
import { postsAPI } from '@/lib/api'
import PostCard from './PostCard'
import AutoPostGenerator from './AutoPostGenerator'
import Profile from './Profile'
import { showToast } from './Toast'

interface Post {
  id: number
  content: string
  image_url?: string
  author: {
    id: number
    username: string
    avatar_url?: string
    avatar?: string
  }
  created_at: string
  time_ago?: string
  like_count: number
  comment_count: number
  is_liked?: boolean
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getFeed()
      const apiPosts = (response.data.results || response.data).map((post: any) => ({
        ...post,
        time_ago: 'Just now'
      }))
      
      // Add some initial mock posts if no posts exist
      const mockPosts = [
        {
          id: 1001,
          content: "Beautiful morning! Starting the day with coffee ☕️",
          image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
          author: { id: 101, username: 'john_doe', avatar: '👨💻' },
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          time_ago: '30m ago',
          like_count: JSON.parse(localStorage.getItem('count_1001') || '12'),
          comment_count: 3,
          is_liked: JSON.parse(localStorage.getItem('like_1001') || 'false')
        },
        {
          id: 1002,
          content: "Just finished an amazing workout! 💪 Feeling energized",
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
          author: { id: 102, username: 'jane_smith', avatar: '👩🎨' },
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          time_ago: '1h ago',
          like_count: JSON.parse(localStorage.getItem('count_1002') || '8'),
          comment_count: 1,
          is_liked: JSON.parse(localStorage.getItem('like_1002') || 'false')
        }
      ]
      
      setPosts([...apiPosts, ...mockPosts])
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: number, isLiked: boolean) => {
    try {
      // Handle mock posts (id > 1000) locally, real posts via API
      if (postId > 1000) {
        const updatedPosts = posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                is_liked: !isLiked,
                like_count: isLiked ? post.like_count - 1 : post.like_count + 1
              }
            : post
        )
        setPosts(updatedPosts)
        
        // Save like status and count to localStorage
        const likeKey = `like_${postId}`
        const countKey = `count_${postId}`
        const updatedPost = updatedPosts.find(p => p.id === postId)
        localStorage.setItem(likeKey, JSON.stringify(!isLiked))
        localStorage.setItem(countKey, JSON.stringify(updatedPost?.like_count || 0))
      } else {
        if (isLiked) {
          await postsAPI.unlike(postId)
        } else {
          await postsAPI.like(postId)
        }
        
        setPosts(posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                is_liked: !isLiked,
                like_count: isLiked ? post.like_count - 1 : post.like_count + 1
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleDelete = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      // Mock delete for demo posts
      if (postId > 1000) {
        // Just remove from local state for mock posts
      } else {
        // Real API call would go here
        // await postsAPI.delete(postId)
      }
      setPosts(posts.filter(post => post.id !== postId))
      showToast('Post deleted successfully! 🗑️', 'success')
    } catch (error) {
      console.error('Error deleting post:', error)
      showToast('Failed to delete post. Please try again.', 'error')
    }
  }

  const handleNewPost = (newPost: any) => {
    // Check if this post was liked before and restore count
    const likeKey = `like_${newPost.id}`
    const countKey = `count_${newPost.id}`
    const wasLiked = JSON.parse(localStorage.getItem(likeKey) || 'false')
    const savedCount = JSON.parse(localStorage.getItem(countKey) || newPost.like_count.toString())
    
    newPost.is_liked = wasLiked
    newPost.like_count = savedCount
    
    setPosts(prev => [newPost, ...prev])
  }

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId.toString())
  }

  if (selectedUserId) {
    return <Profile userId={selectedUserId} />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="py-0 md:py-8">
      <AutoPostGenerator onNewPost={handleNewPost} silentMode={true} />
      <div className="max-w-lg mx-auto space-y-0 md:space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-8 md:py-12 px-4">
            <p className="text-gray-500">No posts yet. Start following people or create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              onUserClick={handleUserClick}
            />
          ))
        )}
      </div>
    </div>
  )
}