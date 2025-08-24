#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialconnect.settings')
django.setup()

from users.models import User

def create_demo_users():
    # User 1 (Alice)
    alice, created = User.objects.get_or_create(
        email='alice@demo.com',
        defaults={
            'username': 'alice_demo',
            'first_name': 'Alice',
            'last_name': 'Johnson'
        }
    )
    if created:
        alice.set_password('demo123')
        alice.save()
        print("✅ Created Alice: alice@demo.com / demo123")
    else:
        alice.set_password('demo123')
        alice.save()
        print("✅ Updated Alice: alice@demo.com / demo123")
    
    # User 2 (Bob)
    bob, created = User.objects.get_or_create(
        email='bob@demo.com',
        defaults={
            'username': 'bob_demo',
            'first_name': 'Bob',
            'last_name': 'Smith'
        }
    )
    if created:
        bob.set_password('demo123')
        bob.save()
        print("✅ Created Bob: bob@demo.com / demo123")
    else:
        bob.set_password('demo123')
        bob.save()
        print("✅ Updated Bob: bob@demo.com / demo123")
    
    print("\n🎯 DEMO USERS READY:")
    print("User 1 - Alice: alice@demo.com / demo123")
    print("User 2 - Bob: bob@demo.com / demo123")
    print("\nUse these for your interview demo!")

if __name__ == '__main__':
    create_demo_users()