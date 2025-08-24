# SocialConnect - Social Media Backend API

A comprehensive social media backend application built with Django REST Framework, featuring user authentication, posts, social interactions, and real-time notifications.

## Features

- **JWT Authentication**: Register, login, logout with token management
- **User Profiles**: Customizable profiles with bio, avatar, privacy settings
- **Posts**: Create, edit, delete posts with image upload support
- **Social Features**: Follow/unfollow users, like posts, comment system
- **Personalized Feed**: Chronological feed from followed users
- **Real-time Notifications**: Live notifications using Supabase Real-Time
- **Admin Panel**: User and content management for administrators

## Technology Stack

- **Backend**: Django 5.1.1, Django REST Framework
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT (django-rest-framework-simplejwt)
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Real-Time Subscriptions
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd SocialConnect
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
```
SECRET_KEY=your-django-secret-key
DEBUG=True
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### 3. Database Setup

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py create_admin --email admin@example.com --username admin --password admin123
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Update .env.local with your Supabase credentials
npm run dev
```

### 5. Run the Backend Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`
The frontend will be available at `http://localhost:3000/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/refresh/` - Refresh access token
- `POST /api/auth/change-password/` - Change password

### Users
- `GET /api/users/` - List users (with search)
- `GET /api/users/{id}/` - Get user profile
- `PUT /api/users/me/` - Update own profile
- `POST /api/users/{id}/follow/` - Follow user
- `DELETE /api/users/{id}/follow/` - Unfollow user
- `GET /api/users/{id}/followers/` - Get user followers
- `GET /api/users/{id}/following/` - Get user following

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get specific post
- `PUT /api/posts/{id}/` - Update own post
- `DELETE /api/posts/{id}/` - Delete own post
- `POST /api/posts/{id}/like/` - Like post
- `DELETE /api/posts/{id}/like/` - Unlike post
- `GET /api/posts/{id}/like-status/` - Check like status
- `GET /api/posts/{id}/comments/` - Get post comments
- `POST /api/posts/{id}/comments/` - Add comment
- `DELETE /api/posts/comments/{id}/` - Delete comment
- `GET /api/posts/feed/` - Get personalized feed
- `POST /api/posts/upload-image/` - Upload image

### Notifications
- `GET /api/notifications/` - Get user notifications
- `POST /api/notifications/{id}/read/` - Mark notification as read
- `POST /api/notifications/mark-all-read/` - Mark all notifications as read

### Admin (Admin role required)
- `GET /api/admin/users/` - List all users
- `GET /api/admin/users/{id}/` - Get user details
- `POST /api/admin/users/{id}/deactivate/` - Deactivate user
- `GET /api/admin/posts/` - List all posts
- `DELETE /api/admin/posts/{id}/delete/` - Delete any post
- `GET /api/admin/stats/` - Get platform statistics

## User Roles

- **User** (default): Can create posts, follow users, like/comment
- **Admin**: All user permissions + user management and content moderation

## Real-time Notifications

The application uses Supabase Real-Time subscriptions for live notifications. When users:
- Follow someone → Follower gets notified
- Like a post → Post author gets notified  
- Comment on a post → Post author gets notified

## File Upload

Images are uploaded with the following constraints:
- Formats: JPEG, PNG only
- Max size: 2MB
- Stored via Supabase Storage

## Development Notes

- Custom User model with email as username field
- JWT tokens with 60-minute access and 7-day refresh
- Automatic notification creation via Django signals
- CORS enabled for frontend integration
- Admin interface available at `/admin/`

## Production Deployment

1. Set `DEBUG=False` in production
2. Configure proper database (PostgreSQL)
3. Set up Supabase Storage for file uploads
4. Configure CORS for your frontend domain
5. Use environment variables for sensitive data

## License

This project is licensed under the MIT License.