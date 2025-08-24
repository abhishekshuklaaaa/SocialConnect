# SocialConnect API Endpoints

## Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/refresh/` - Refresh access token
- `POST /api/auth/change-password/` - Change password

## Users
- `GET /api/users/` - List users (with search)
- `GET /api/users/{id}/` - Get user profile
- `PUT /api/users/me/` - Update own profile

## Follow Operations
- `POST /api/users/{user_id}/follow/` - Follow User
- `DELETE /api/users/{user_id}/follow/` - Unfollow User
- `GET /api/users/{user_id}/followers/` - Get User Followers
- `GET /api/users/{user_id}/following/` - Get User Following

## Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get specific post
- `PUT /api/posts/{id}/` - Update own post
- `DELETE /api/posts/{id}/` - Delete own post
- `POST /api/posts/upload-image/` - Upload image

## Engagement System

### Like System
- `POST /api/posts/{post_id}/like/` - Like Post
- `DELETE /api/posts/{post_id}/like/` - Unlike Post
- `GET /api/posts/{post_id}/like-status/` - Check if user liked post

### Comment System
- `GET /api/posts/{post_id}/comments/` - Get Comments
- `POST /api/posts/{post_id}/comments/` - Add Comment
- `DELETE /api/posts/comments/{comment_id}/` - Delete Own Comment

## Feed System
- `GET /api/posts/feed/` - Get personalized feed (posts from followed users + own posts, chronological order, 20 per page)

## Notifications
- `GET /api/notifications/` - Get Notifications
- `GET /api/notifications/unread-count/` - Get unread count for badge
- `PATCH /api/notifications/mark-seen/` - Mark notifications as seen (removes badge)
- `POST /api/notifications/{notification_id}/read/` - Mark as Read
- `POST /api/notifications/mark-all-read/` - Mark All Read

## Admin Features (Admin role required)

### User Management
- `GET /api/admin/users/` - List All Users
- `GET /api/admin/users/{user_id}/` - Get User Details
- `POST /api/admin/users/{user_id}/deactivate/` - Deactivate User

### Content Management
- `GET /api/admin/posts/` - List All Posts
- `DELETE /api/admin/posts/{post_id}/delete/` - Delete Any Post
- `GET /api/admin/stats/` - Basic statistics (total users, posts, active today)

## Models

### Follow Model
```python
class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following_set', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers_set', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
```

### Comment Model
```python
class Comment(models.Model):
    content = models.TextField(max_length=200)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
```

### Notification Model
```python
class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=10, choices=[('follow', 'Follow'), ('like', 'Like'), ('comment', 'Comment')])
    post = models.ForeignKey(Post, null=True, blank=True, on_delete=models.CASCADE)
    message = models.CharField(max_length=200)
    is_read = models.BooleanField(default=False)
    seen_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## Features Implemented

✅ **Follow Operations** - Follow/unfollow users with immediate UI updates
✅ **Like System** - Like/unlike posts with real-time count updates  
✅ **Comment System** - Flat comment structure, add/delete comments
✅ **Personalized Feed** - Chronological feed from followed users + own posts
✅ **Real-time Notifications** - Instagram-style notification bell with badge
✅ **Admin Panel** - User management, content moderation, statistics
✅ **File Upload** - Image upload for posts with proper URL handling
✅ **Time Display** - Instagram-style time formatting (now, 1m, 1h, 1d, 1w)
✅ **Profile System** - View profiles, followers/following lists, post grids
✅ **Search** - User search with follow/unfollow functionality

## Real-time Features
- Notification badge updates every 30 seconds
- Immediate UI updates for follow/unfollow actions
- Real-time like/unlike feedback
- Live notification panel with Instagram-style design