'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { usersAPI, postsAPI } from '@/lib/api'
import PostCard from './PostCard'

interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  bio?: string
  avatar_url?: string
  website?: string
  location?: string
  followers_count: number
  following_count: number
  posts_count: number
  is_following?: boolean
}

interface ProfileProps {
  userId?: string
}

export default function Profile({ userId }: ProfileProps = {}) {
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: '',
    website: '',
    location: '',
    privacy: 'public'
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  
  const targetUserId = userId || user?.id?.toString()
  const isOwnProfile = !userId || userId === user?.id?.toString()

  useEffect(() => {
    if (targetUserId) {
      fetchProfile()
      fetchUserPosts()
    }
  }, [targetUserId])

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile(targetUserId!)
      setProfile(response.data)
      if (isOwnProfile) {
        setEditData({
          bio: response.data.bio || '',
          website: response.data.website || '',
          location: response.data.location || '',
          privacy: response.data.privacy || 'public'
        })
      }
      return response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const response = await postsAPI.getPosts()
      const userPosts = response.data.results?.filter((post: any) => post.author.id === parseInt(targetUserId!)) || []
      setUserPosts(userPosts)
    } catch (error) {
      console.error('Error fetching user posts:', error)
    }
  }
  
  const fetchFollowers = async () => {
    try {
      const response = await usersAPI.getFollowers(targetUserId!)
      setFollowers(response.data)
      setShowFollowers(true)
    } catch (error) {
      console.error('Error fetching followers:', error)
    }
  }
  
  const fetchFollowing = async () => {
    try {
      const response = await usersAPI.getFollowing(targetUserId!)
      setFollowing(response.data)
      setShowFollowing(true)
    } catch (error) {
      console.error('Error fetching following:', error)
    }
  }
  
  const handleFollow = async () => {
    if (!profile || followLoading) return
    
    setFollowLoading(true)
    try {
      if (profile.is_following) {
        await usersAPI.unfollowUser(profile.id.toString())
        setProfile(prev => prev ? {
          ...prev,
          is_following: false,
          followers_count: prev.followers_count - 1
        } : null)
      } else {
        await usersAPI.followUser(profile.id.toString())
        setProfile(prev => prev ? {
          ...prev,
          is_following: true,
          followers_count: prev.followers_count + 1
        } : null)
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedImage) {
        const formData = new FormData()
        formData.append('bio', editData.bio)
        formData.append('website', editData.website)
        formData.append('location', editData.location)
        formData.append('avatar', selectedImage)
        await usersAPI.updateProfile(formData)
      } else {
        await usersAPI.updateProfile(editData)
      }
      
      setIsEditing(false)
      setSelectedImage(null)
      setImagePreview(null)
      
      // Fetch fresh profile data
      const response = await usersAPI.getProfile(targetUserId!)
      setProfile(response.data)
      
      // Update user context immediately if it's own profile
      if (isOwnProfile && user) {
        console.log('Current user:', user)
        console.log('Updated profile data:', response.data)
        const updatedUser = {
          ...user,
          avatar: response.data.avatar,
          avatar_url: response.data.avatar_url,
          bio: response.data.bio,
          website: response.data.website,
          location: response.data.location
        }
        console.log('Updating user context with:', updatedUser)
        refreshUser(updatedUser)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                ) : profile?.avatar ? (
                  <img src={profile.avatar.startsWith('http') ? profile.avatar : `http://127.0.0.1:8000${profile.avatar}`} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                ) : profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-700">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profile?.username}</h1>
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      profile?.is_following
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50`}
                  >
                    {followLoading ? '...' : profile?.is_following ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              
              <div className="flex space-x-8 mb-4">
                <div className="text-center p-2">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{profile?.posts_count || 0}</div>
                  <div className="text-gray-500 text-sm">Posts</div>
                </div>
                <button onClick={fetchFollowers} className="text-center hover:bg-gray-50 p-2 rounded">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{profile?.followers_count || 0}</div>
                  <div className="text-gray-500 text-sm">Followers</div>
                </button>
                <button onClick={fetchFollowing} className="text-center hover:bg-gray-50 p-2 rounded">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{profile?.following_count || 0}</div>
                  <div className="text-gray-500 text-sm">Following</div>
                </button>
              </div>
              
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{profile?.first_name} {profile?.last_name}</h2>
                {profile?.bio && <p className="text-gray-700 dark:text-gray-200 mt-1">{profile.bio}</p>}
                {profile?.website && (
                  <a href={profile.website} className="text-blue-600 dark:text-blue-300 hover:underline block mt-1">
                    {profile.website}
                  </a>
                )}
                {profile?.location && (
                  <p className="text-gray-500 dark:text-gray-300 mt-1">📍 {profile.location}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Followers Modal */}
        {showFollowers && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Followers</h3>
                <button onClick={() => setShowFollowers(false)} className="text-gray-500">✕</button>
              </div>
              {followers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No followers yet</p>
              ) : (
                <div className="space-y-3">
                  {followers.map((follow: any) => (
                    <div key={follow.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm">👤</span>
                      </div>
                      <span className="font-medium">{follow.follower.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Following Modal */}
        {showFollowing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Following</h3>
                <button onClick={() => setShowFollowing(false)} className="text-gray-500">✕</button>
              </div>
              {following.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Not following anyone yet</p>
              ) : (
                <div className="space-y-3">
                  {following.map((follow: any) => (
                    <div key={follow.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm">👤</span>
                      </div>
                      <span className="font-medium">{follow.following.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        {isEditing && isOwnProfile && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  maxLength={160}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows={3}
                />
                <div className="text-right text-sm text-gray-500">{editData.bio.length}/160</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={editData.website}
                  onChange={(e) => setEditData({...editData, website: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                <select
                  value={editData.privacy}
                  onChange={(e) => setEditData({...editData, privacy: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="public">Public - Anyone can see</option>
                  <option value="followers_only">Followers Only</option>
                  <option value="private">Private - Approved followers only</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
        
        {/* Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Post</h3>
                <button onClick={() => setSelectedPost(null)} className="text-gray-500 text-xl">×</button>
              </div>
              <PostCard 
                post={selectedPost} 
                onLike={(postId, isLiked) => {
                  // Handle like logic here if needed
                }}
                onDelete={(postId) => {
                  setUserPosts(userPosts.filter(p => p.id !== postId))
                  setSelectedPost(null)
                }}
              />
            </div>
          </div>
        )}

        {/* User Posts Grid */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{isOwnProfile ? 'Your Posts' : `${profile?.username}'s Posts`}</h3>
          {userPosts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 text-center py-8">No posts yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {userPosts.map((post: any) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
                >
                  {post.image_url ? (
                    <img src={post.image_url} alt="Post" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <span className="text-sm text-center p-2">{post.content}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}