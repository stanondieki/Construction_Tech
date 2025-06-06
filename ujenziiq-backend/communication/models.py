from django.db import models
from django.conf import settings
from projects.models import Project, Task, Safety

class Notification(models.Model):
    """
    System notifications for users
    """
    NOTIFICATION_TYPE_CHOICES = (
        ('task_assigned', 'Task Assigned'),
        ('task_completed', 'Task Completed'),
        ('task_updated', 'Task Updated'),
        ('safety_incident', 'Safety Incident'),
        ('material_delivered', 'Material Delivered'),
        ('progress_report', 'Progress Report'),
        ('comment', 'New Comment'),
        ('deadline', 'Deadline Approaching'),
        ('milestone', 'Milestone Reached'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    is_read = models.BooleanField(default=False)
    is_sms_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-created_at']


class Message(models.Model):
    """
    Chat/messaging system for project communication
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    parent_message = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    # For group messaging
    is_group_message = models.BooleanField(default=False)
    
    def __str__(self):
        if self.is_group_message:
            return f"Group message in {self.project.name} by {self.sender.username}"
        elif self.recipient:
            return f"Message to {self.recipient.username} from {self.sender.username}"
        else:
            return f"Project message in {self.project.name} by {self.sender.username}"
    
    class Meta:
        ordering = ['created_at']


class Comment(models.Model):
    """
    Comments on various project elements (tasks, safety incidents, etc.)
    """
    COMMENT_ON_CHOICES = (
        ('task', 'Task'),
        ('project', 'Project'),
        ('safety', 'Safety Incident'),
        ('progress_report', 'Progress Report'),
    )
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    comment_on = models.CharField(max_length=20, choices=COMMENT_ON_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    safety_incident = models.ForeignKey(Safety, on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.comment_on}"
    
    class Meta:
        ordering = ['created_at']


class SMSLog(models.Model):
    """
    Log of SMS messages sent to users without smartphones
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sms_logs')
    phone_number = models.CharField(max_length=15)
    message = models.TextField()
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, null=True, blank=True, related_name='sms_logs')
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='pending')
    
    def __str__(self):
        return f"SMS to {self.phone_number} at {self.sent_at}"
