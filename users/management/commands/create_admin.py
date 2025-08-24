from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create an admin user'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Admin email')
        parser.add_argument('--username', type=str, help='Admin username')
        parser.add_argument('--password', type=str, help='Admin password')

    def handle(self, *args, **options):
        email = options.get('email') or 'admin@socialconnect.com'
        username = options.get('username') or 'admin'
        password = options.get('password') or 'admin123'

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'User with email {email} already exists')
            )
            return

        user = User.objects.create_user(
            email=email,
            username=username,
            password=password,
            role='admin',
            is_staff=True,
            is_superuser=True,
            first_name='Admin',
            last_name='User'
        )

        self.stdout.write(
            self.style.SUCCESS(f'Admin user created successfully: {email}')
        )