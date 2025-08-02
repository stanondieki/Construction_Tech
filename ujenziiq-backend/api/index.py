import json
import os
import sys

# Add Django project to path
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_dir)

def application(environ, start_response):
    """
    WSGI application with Django integration and proper CORS
    """
    try:
        method = environ.get('REQUEST_METHOD', 'GET')
        path = environ.get('PATH_INFO', '/')
        origin = environ.get('HTTP_ORIGIN', '')
        
        # Always include CORS headers
        cors_headers = [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'),
            ('Access-Control-Allow-Credentials', 'true'),
        ]
        
        # Handle CORS preflight requests first
        if method == 'OPTIONS':
            status = '200 OK'
            headers = [('Content-Type', 'application/json')] + cors_headers + [('Content-Length', '0')]
            start_response(status, headers)
            return [b'']
        
        # Health check - no Django needed
        if path == '/' or path == '/health':
            response_data = {
                "status": "ok", 
                "message": "UjenziIQ Backend is running",
                "version": "1.0.0",
                "cors": "enabled"
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
                
                # Run migrations to set up database
                from django.core.management import execute_from_command_line
                try:
                    execute_from_command_line(['manage.py', 'migrate', '--run-syncdb'])
                except:
                    pass  # Ignore migration errors for now
                
                from django.core.wsgi import get_wsgi_application
                django_app = get_wsgi_application()
                
                # Create a custom environ that includes our CORS handling
                def cors_start_response(status, headers):
                    # Add CORS headers to Django's response
                    headers.extend(cors_headers)
                    return start_response(status, headers)
                
                # Delegate to Django with CORS headers
                return django_app(environ, cors_start_response)
                
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
        
        # Return JSON response with CORS headers
        response_body = json.dumps(response_data, indent=2).encode('utf-8')
        status = '200 OK'
        headers = [
            ('Content-Type', 'application/json'),
            ('Content-Length', str(len(response_body))),
        ] + cors_headers
        
        start_response(status, headers)
        return [response_body]
        
    except Exception as e:
        # Global error handling with CORS
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
            ('Content-Length', str(len(response_body))),
        ] + cors_headers
        
        start_response(status, headers)
        return [response_body]

# Vercel expects the application to be named 'app'
app = application