#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialconnect.settings')
django.setup()

from users.models import User

# Create user: user@example.com / 123456
user, created = User.objects.get_or_create(
    email='user@example.com',
    defaults={
        'username': 'user123',
        'first_name': 'John',
        'last_name': 'Doe'
    }
)

user.set_password('123456')
user.save()

print("Login with: user@example.com / 123456")