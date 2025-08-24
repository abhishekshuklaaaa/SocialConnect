from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Post, Like, Comment
from .serializers import PostSerializer, PostCreateSerializer, CommentSerializer, LikeSerializer
from notifications.models import Notification
from users.models import Follow

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Post.objects.filter(is_active=True).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.filter(is_active=True)
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PostCreateSerializer
        return PostSerializer
    
    def get_object(self):
        obj = super().get_object()
        # Only author can update/delete their posts
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.author != self.request.user and self.request.user.role != 'admin':
                self.permission_denied(self.request)
        return obj

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, is_active=True)
    
    if request.method == 'POST':
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        
        if created:
            post.like_count += 1
            post.save(update_fields=['like_count'])
            
            # Create notification if not liking own post
            if post.author != request.user:
                Notification.objects.create(
                    recipient=post.author,
                    sender=request.user,
                    notification_type='like',
                    post=post,
                    message=f'{request.user.username} liked your post'
                )
            
            return Response({"message": "Post liked"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Already liked"}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        try:
            like = Like.objects.get(user=request.user, post=post)
            like.delete()
            post.like_count = max(0, post.like_count - 1)
            post.save(update_fields=['like_count'])
            return Response({"message": "Post unliked"}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            return Response({"error": "Not liked"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def like_status(request, post_id):
    post = get_object_or_404(Post, id=post_id, is_active=True)
    is_liked = Like.objects.filter(user=request.user, post=post).exists()
    return Response({"is_liked": is_liked})

class PostCommentsView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id, is_active=True)
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id, is_active=True)
        comment = serializer.save(author=self.request.user, post=post)
        
        # Update comment count
        post.comment_count += 1
        post.save(update_fields=['comment_count'])
        
        # Create notification if not commenting on own post
        if post.author != self.request.user:
            Notification.objects.create(
                recipient=post.author,
                sender=self.request.user,
                notification_type='comment',
                post=post,
                message=f'{self.request.user.username} commented on your post'
            )

class CommentDetailView(generics.DestroyAPIView):
    queryset = Comment.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        # Only author can delete their comments
        if obj.author != self.request.user and self.request.user.role != 'admin':
            self.permission_denied(self.request)
        return obj
    
    def perform_destroy(self, instance):
        post = instance.post
        post.comment_count = max(0, post.comment_count - 1)
        post.save(update_fields=['comment_count'])
        instance.delete()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed_view(request):
    # Get users that current user follows
    following_users = Follow.objects.filter(follower=request.user).values_list('following', flat=True)
    
    # Get posts from followed users + own posts
    posts = Post.objects.filter(
        Q(author__in=following_users) | Q(author=request.user),
        is_active=True
    ).order_by('-created_at')
    
    # Pagination
    page = int(request.GET.get('page', 1))
    page_size = 20
    start = (page - 1) * page_size
    end = start + page_size
    
    posts_page = posts[start:end]
    serializer = PostSerializer(posts_page, many=True, context={'request': request})
    
    return Response({
        'results': serializer.data,
        'has_next': len(posts) > end,
        'page': page
    })
