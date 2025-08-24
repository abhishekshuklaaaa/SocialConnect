#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialconnect.settings')
django.setup()

from users.models import User, Follow
from posts.models import Post, Like, Comment

def test_notifications():
    print("Testing notification creation...")
    
    # Get users
    alice = User.objects.filter(email='alice@test.com').first()
    bob = User.objects.filter(email='bob@test.com').first()
    
    if not alice or not bob:
        print("Creating test users...")
        alice = User.objects.create_user(email='alice@test.com', username='alice')
        bob = User.objects.create_user(email='bob@test.com', username='bob')
    
    # Create post
    post = Post.objects.create(author=bob, content='Test post for notifications')
    
    print("1. Testing FOLLOW notification...")
    Follow.objects.filter(follower=alice, following=bob).delete()
    Follow.objects.create(follower=alice, following=bob)
    print("   Follow notification created!")
    
    print("2. Testing LIKE notification...")
    Like.objects.filter(user=alice, post=post).delete()
    Like.objects.create(user=alice, post=post)
    print("   Like notification created!")
    
    print("3. Testing COMMENT notification...")
    Comment.objects.create(author=alice, post=post, content='Great post!')
    print("   Comment notification created!")
    
    print("\nCheck your frontend for real-time notifications!")

if __name__ == '__main__':
    test_notifications()