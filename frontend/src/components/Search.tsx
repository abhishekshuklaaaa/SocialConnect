'use client'

import { useState, useEffect } from 'react'
import { usersAPI } from '@/lib/api'
import { showToast } from './Toast'
import Profile from './Profile'

interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  avatar_url?: string
  followers_count: number
  following_count: number
  is_following?: boolean
}

interface SearchProps {
  query: string
  onClearSearch: () => void
}

export default function Search({ query, onClearSearch }: SearchProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    if (query.trim()) {
      searchUsers(query)
    } else {
      setUsers([])
    }
  }, [query])
  
  if (selectedUserId) {
    return <Profile userId={selectedUserId} />
  }

  const searchUsers = async (searchQuery: string) => {
    setLoading(true)
    try {
      const response = await usersAPI.searchUsers(searchQuery)
      setUsers(response.data.results || response.data)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId: number, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await usersAPI.unfollowUser(userId.toString())
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, followers_count: user.followers_count - 1, is_following: false }
            : user
        ))
      } else {
        await usersAPI.followUser(userId.toString())
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, followers_count: user.followers_count + 1, is_following: true }
            : user
        ))
      }
      const user = users.find(u => u.id === userId)
      showToast(`${isFollowing ? 'Unfollowed' : 'Following'} ${user?.username}!`, 'success')
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
      showToast('Failed to update follow status. Please try again.', 'error')
    }
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Search Results for "{query}"</h2>
        <button
          onClick={onClearSearch}
          className="text-blue-500 hover:text-blue-600"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found for "{query}"
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <button 
                onClick={() => setSelectedUserId(user.id.toString())}
                className="flex items-center space-x-3 flex-1 text-left hover:bg-gray-50 p-2 rounded"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full" />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-500">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.followers_count} followers
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleFollow(user.id, user.is_following || false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  user.is_following
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {user.is_following ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}