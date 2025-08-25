#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialconnect.settings')
django.setup()

from users.models import User

# Create demo users
users_data = [
    {'email': 'alice@demo.com', 'username': 'alice_demo', 'first_name': 'Alice', 'last_name': 'Johnson', 'password': 'demo123'},
    {'email': 'bob@demo.com', 'username': 'bob_demo', 'first_name': 'Bob', 'last_name': 'Smith', 'password': 'demo123'},
    {'email': 'test123@test.com', 'username': 'test123', 'first_name': 'Test', 'last_name': 'User', 'password': 'password123'},
    {'email': 'user@example.com', 'username': 'user123', 'first_name': 'John', 'last_name': 'Doe', 'password': '123456'},
    {'email': 'sarah@example.com', 'username': 'sarah_wilson', 'first_name': 'Sarah', 'last_name': 'Wilson', 'password': 'sarah123'},
]

for user_data in users_data:
    user, created = User.objects.get_or_create(
        email=user_data['email'],
        defaults={
            'username': user_data['username'],
            'first_name': user_data['first_name'],
            'last_name': user_data['last_name']
        }
    )
    user.set_password(user_data['password'])
    user.save()
    print(f"{'Created' if created else 'Updated'}: {user_data['email']}")

print("Demo users ready!")