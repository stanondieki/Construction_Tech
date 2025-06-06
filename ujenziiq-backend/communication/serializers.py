from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification, Message, Comment, SMSLog
from projects.serializers import UserMiniSerializer

User = get_user_model()

class NotificationSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)
    recipient = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = UserMiniSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = '__all__'
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []

class SMSLogSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = SMSLog
        fields = '__all__'
