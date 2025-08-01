#!/bin/bash
# Railway deployment script

echo "Running database migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Creating superuser if it doesn't exist..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(email='admin@ujenziiq.com').exists():
    User.objects.create_superuser(
        email='admin@ujenziiq.com',
        username='admin',
        password='admin123',
        first_name='Admin',
        last_name='User'
    )
    print("Superuser created successfully!")
else:
    print("Superuser already exists!")
EOF

echo "Setup completed!"
