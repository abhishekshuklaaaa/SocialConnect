from rest_framework import serializers
from .models import Notification
from users.serializers import UserSerializer
from django.utils import timezone
from datetime import datetime

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    time_ago = serializers.SerializerMethodField()
    post_thumbnail = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'notification_type', 'post', 'message', 'is_read', 'seen_at', 'created_at', 'time_ago', 'post_thumbnail']
        read_only_fields = ['id', 'sender', 'notification_type', 'post', 'message', 'created_at']
    
    def get_time_ago(self, obj):
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
    
    def get_post_thumbnail(self, obj):
        if obj.post and obj.post.image_url:
            return obj.post.image_url
        return None