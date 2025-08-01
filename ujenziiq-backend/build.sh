#!/usr/bin/env bash
# Build script for Render

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Create admin user
python manage.py init_db
