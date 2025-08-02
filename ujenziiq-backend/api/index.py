import os
import sys
import django
from django.http import JsonResponse

# Add the project directory to the Python path
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_dir)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ujenziiq.settings')

# Configure Django
try:
    django.setup()
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
except Exception as e:
    # Fallback for simple health check
    def application(environ, start_response):
        status = '200 OK'
        headers = [('Content-type', 'application/json')]
        start_response(status, headers)
        return [b'{"status": "ok", "message": "Backend is running", "error": "Django setup failed"}']

# Vercel expects the application to be named 'app'
app = application