#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialconnect.settings')
django.setup()

from users.models import User

# Create or update test123@test.com
user, created = User.objects.get_or_create(
    email='test123@test.com',
    defaults={
        'username': 'test123',
        'first_name': 'Test',
        'last_name': 'User'
    }
)

user.set_password('password123')
user.save()

if created:
    print("Created user: test123@test.com / password123")
else:
    print("Updated user: test123@test.com / password123")