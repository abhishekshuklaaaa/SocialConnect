from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Follow

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.ReadOnlyField()
    following_count = serializers.ReadOnlyField()
    posts_count = serializers.ReadOnlyField()
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 
                 'avatar', 'avatar_url', 'website', 'location', 'privacy', 'is_verified',
                 'followers_count', 'following_count', 'posts_count', 'is_following', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user != obj:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['bio', 'avatar', 'avatar_url', 'website', 'location', 'privacy']

class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)
    
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']