import json
import os
import sys

# Add Django project to path
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_dir)

def application(environ, start_response):
    """
    WSGI application with Django integration
    """
    try:
        method = environ.get('REQUEST_METHOD', 'GET')
        path = environ.get('PATH_INFO', '/')
        
        # Handle CORS preflight requests
        if method == 'OPTIONS':
            status = '200 OK'
            headers = [
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
                ('Content-Length', '0'),
            ]
            start_response(status, headers)
            return [b'']
        
        # Health check - no Django needed
        if path == '/' or path == '/health':
            response_data = {
                "status": "ok", 
                "message": "UjenziIQ Backend is running",
                "version": "1.0.0",
                "django_status": "loading..."
            }
            
        # Simple API info - no Django needed  
        elif path == '/api' or path == '/api/':
            response_data = {
                "message": "UjenziIQ API",
                "version": "1.0",
                "status": "ready",
                "endpoints": {
                    "health": "/",
                    "api": "/api/",
                    "auth": "/api/auth/",
                    "users": "/api/users/",
                    "projects": "/api/projects/"
                }
            }
            
        # For Django endpoints, try to load Django
        elif path.startswith('/api/'):
            try:
                # Try to load Django for API endpoints
                os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ujenziiq.settings')
                import django
                django.setup()
                
                from django.core.wsgi import get_wsgi_application
                django_app = get_wsgi_application()
                
                # Delegate to Django
                return django_app(environ, start_response)
                
            except Exception as django_error:
                # Fallback response if Django fails
                response_data = {
                    "error": "Django API not ready",
                    "message": str(django_error),
                    "path": path,
                    "fallback": True
                }
                
        else:
            response_data = {
                "error": "Not Found",
                "path": path,
                "method": method
            }
        
        # Return JSON response
        response_body = json.dumps(response_data, indent=2).encode('utf-8')
        status = '200 OK'
        headers = [
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ('Content-Length', str(len(response_body))),
        ]
        
        start_response(status, headers)
        return [response_body]
        
    except Exception as e:
        # Global error handling
        error_response = {
            "error": "Internal Server Error",
            "message": str(e),
            "path": environ.get('PATH_INFO', '/'),
            "method": environ.get('REQUEST_METHOD', 'GET')
        }
        response_body = json.dumps(error_response, indent=2).encode('utf-8')
        
        status = '500 Internal Server Error'
        headers = [
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
            ('Content-Length', str(len(response_body))),
        ]
        
        start_response(status, headers)
        return [response_body]

# Vercel expects the application to be named 'app'
app = application