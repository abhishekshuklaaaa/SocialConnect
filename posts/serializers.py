from rest_framework import serializers
from .models import Post, Like, Comment
from users.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'created_at', 'updated_at', 
                 'image_url', 'category', 'like_count', 'comment_count', 'is_liked', 'time_ago']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'like_count', 'comment_count']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False
    
    def get_image_url(self, obj):
        if obj.image_url:
            # Fix URLs to use Railway domain
            if '127.0.0.1:8000' in obj.image_url:
                return obj.image_url.replace('http://127.0.0.1:8000', 'https://web-production-19483.up.railway.app')
            elif 'localhost' in obj.image_url:
                return obj.image_url.replace('http://localhost:3000', 'https://web-production-19483.up.railway.app')
            return obj.image_url
        return None
    
    def get_time_ago(self, obj):
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days >= 7:
            weeks = diff.days // 7
            return f"{weeks}w"
        elif diff.days > 0:
            return f"{diff.days}d"
        elif diff.seconds >= 3600:
            hours = diff.seconds // 3600
            return f"{hours}h"
        elif diff.seconds >= 60:
            minutes = diff.seconds // 60
            return f"{minutes}m"
        else:
            return "now"

class PostCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Post
        fields = ['content', 'category', 'image']
        
    def create(self, validated_data):
        image = validated_data.pop('image', None)
        post = super().create(validated_data)
        
        if image:
            import os
            from django.conf import settings
            
            # Ensure media/posts directory exists
            posts_dir = os.path.join(settings.MEDIA_ROOT, 'posts')
            os.makedirs(posts_dir, exist_ok=True)
            
            # Save file
            filename = f'posts/{image.name}'
            filepath = os.path.join(settings.MEDIA_ROOT, filename)
            
            with open(filepath, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
                    
            post.image_url = f'https://web-production-19483.up.railway.app{settings.MEDIA_URL}{filename}'
            post.save()
            
        return post

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'time_ago']
        read_only_fields = ['id', 'author', 'created_at']
    
    def get_time_ago(self, obj):
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days >= 7:
            weeks = diff.days // 7
            return f"{weeks}w"
        elif diff.days > 0:
            return f"{diff.days}d"
        elif diff.seconds >= 3600:
            hours = diff.seconds // 3600
            return f"{hours}h"
        elif diff.seconds >= 60:
            minutes = diff.seconds // 60
            return f"{minutes}m"
        else:
            return "now"

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'created_at']
        read_only_fields = ['id', 'created_at']