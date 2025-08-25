#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialconnect.settings')
django.setup()

from users.models import User

# Create new user
user, created = User.objects.get_or_create(
    email='sarah@example.com',
    defaults={
        'username': 'sarah_wilson',
        'first_name': 'Sarah',
        'last_name': 'Wilson'
    }
)

user.set_password('sarah123')
user.save()

print("Login with: sarah@example.com / sarah123")
print("Username: sarah_wilson")
print("Name: Sarah Wilson")