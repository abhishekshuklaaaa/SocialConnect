#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialconnect.settings')
django.setup()

from users.models import User
from posts.models import Post

# Get test user
test_user = User.objects.get(email='test123@test.com')

# Create posts for test user
Post.objects.create(
    author=test_user,
    content="Hello everyone! This is my first post on SocialConnect 🎉"
)

Post.objects.create(
    author=test_user,
    content="Having a great day! What's everyone up to? 😊"
)

Post.objects.create(
    author=test_user,
    content="Just finished working on an amazing project. Feeling accomplished! 💪"
)

print("Created 3 posts for test123@test.com")