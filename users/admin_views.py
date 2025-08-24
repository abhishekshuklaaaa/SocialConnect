from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .serializers import UserSerializer
from posts.models import Post
from posts.serializers import PostSerializer

User = get_user_model()

class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            return User.objects.none()
        return User.objects.all().order_by('-created_at')

class AdminUserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        if self.request.user.role != 'admin':
            self.permission_denied(self.request)
        return super().get_object()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deactivate_user(request, user_id):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, id=user_id)
    user.is_active = False
    user.save()
    
    return Response({"message": f"User {user.username} deactivated"}, status=status.HTTP_200_OK)

class AdminPostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            return Post.objects.none()
        return Post.objects.all().order_by('-created_at')

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_post(request, post_id):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
    
    post = get_object_or_404(Post, id=post_id)
    post.is_active = False
    post.save()
    
    return Response({"message": "Post deleted"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
    
    today = timezone.now().date()
    
    stats = {
        'total_users': User.objects.count(),
        'total_posts': Post.objects.filter(is_active=True).count(),
        'active_users_today': User.objects.filter(last_login__date=today).count(),
        'posts_today': Post.objects.filter(created_at__date=today).count(),
    }
    
    return Response(stats)