"""
URL configuration for ujenziiq project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter

from users.views import UserViewSet
from projects.views import (
    ProjectViewSet, TaskViewSet, MaterialViewSet, ResourceAllocationViewSet,
    SafetyViewSet, ProjectImageViewSet, ProgressReportViewSet
)
from communication.views import (
    NotificationViewSet, MessageViewSet, CommentViewSet, SMSLogViewSet
)

# Simple health check view
def health_check(request):
    return JsonResponse({"status": "ok", "message": "UjenziIQ Backend is running"})

# Create a router and register our viewsets with it
router = DefaultRouter()

# Users
router.register(r'users', UserViewSet)

# Projects
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'materials', MaterialViewSet)
router.register(r'resource-allocations', ResourceAllocationViewSet)
router.register(r'safety', SafetyViewSet)
router.register(r'images', ProjectImageViewSet)
router.register(r'progress-reports', ProgressReportViewSet)

# Communication
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'comments', CommentViewSet)
router.register(r'sms-logs', SMSLogViewSet)

urlpatterns = [
    path('', health_check, name='health_check'),
    path("admin/", admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api-auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
