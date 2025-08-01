from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth import get_user_model
import sys

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize database and create admin user'

    def handle(self, *args, **options):
        try:
            self.stdout.write('Running database migrations...')
            call_command('migrate', verbosity=0)
            self.stdout.write('Database migrations completed!')
            
            # Create admin user if it doesn't exist
            if not User.objects.filter(email='admin@ujenziiq.com').exists():
                admin_user = User.objects.create_superuser(
                    username='admin',
                    email='admin@ujenziiq.com',
                    password='admin123',
                    first_name='Admin',
                    last_name='User'
                )
                admin_user.user_type = 'admin'
                admin_user.save()
                self.stdout.write('Admin user created successfully!')
            else:
                self.stdout.write('Admin user already exists!')
                
            self.stdout.write(self.style.SUCCESS('Database initialization completed!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Database initialization failed: {str(e)}'))
            sys.exit(1)
