from django.db.models.signals import post_save
from django.dispatch import receiver
from posts.models import Like, Comment
from users.models import Follow
from .models import Notification
from .supabase_sync import sync_to_supabase

@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    if created:
        notification = Notification.objects.create(
            recipient=instance.following,
            sender=instance.follower,
            notification_type='follow',
            message=f'{instance.follower.username} started following you'
        )
        sync_to_supabase(notification)

@receiver(post_save, sender=Like)
def create_like_notification(sender, instance, created, **kwargs):
    if created and instance.post.author != instance.user:
        notification = Notification.objects.create(
            recipient=instance.post.author,
            sender=instance.user,
            notification_type='like',
            post=instance.post,
            message=f'{instance.user.username} liked your post'
        )
        sync_to_supabase(notification)

@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    if created and instance.post.author != instance.author:
        notification = Notification.objects.create(
            recipient=instance.post.author,
            sender=instance.author,
            notification_type='comment',
            post=instance.post,
            message=f'{instance.author.username} commented on your post'
        )
        sync_to_supabase(notification)