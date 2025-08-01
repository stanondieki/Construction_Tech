import os
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ujenziiq.settings')

import django
django.setup()

from django.core.wsgi import get_wsgi_application

# Create WSGI application
app = get_wsgi_application()
