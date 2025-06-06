from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Notification, Message, Comment, SMSLog
from .serializers import (
    NotificationSerializer, MessageSerializer, 
    CommentSerializer, SMSLogSerializer
)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['notification_type', 'is_read', 'is_sms_sent', 'project']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['project', 'is_group_message', 'is_read']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | 
            Q(recipient=user) | 
            Q(is_group_message=True, project__team_members=user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        message = self.get_object()
        if message.recipient == request.user or (message.is_group_message and message.project.team_members.filter(id=request.user.id).exists()):
            message.is_read = True
            message.save()
            return Response({'status': 'message marked as read'})
        return Response({'error': 'Not authorized to mark this message as read'}, status=status.HTTP_403_FORBIDDEN)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['comment_on', 'project', 'task', 'safety_incident']
    ordering_fields = ['created_at']
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class SMSLogViewSet(viewsets.ModelViewSet):
    queryset = SMSLog.objects.all()
    serializer_class = SMSLogSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'status']
    ordering_fields = ['sent_at']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
