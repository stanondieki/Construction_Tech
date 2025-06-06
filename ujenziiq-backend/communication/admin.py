from django.contrib import admin
from .models import Notification, Message, Comment, SMSLog

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'notification_type', 'project', 'is_read', 'is_sms_sent', 'created_at')
    list_filter = ('notification_type', 'is_read', 'is_sms_sent', 'created_at')
    search_fields = ('title', 'message', 'user__username')
    date_hierarchy = 'created_at'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'project', 'is_group_message', 'is_read', 'created_at')
    list_filter = ('is_group_message', 'is_read', 'created_at')
    search_fields = ('content', 'sender__username', 'recipient__username')
    date_hierarchy = 'created_at'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'comment_on', 'project', 'created_at')
    list_filter = ('comment_on', 'created_at')
    search_fields = ('content', 'author__username')
    date_hierarchy = 'created_at'


@admin.register(SMSLog)
class SMSLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'sent_at', 'status')
    list_filter = ('status', 'sent_at')
    search_fields = ('message', 'phone_number', 'user__username')
    date_hierarchy = 'sent_at'
