from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Project, Task, Material, ResourceAllocation, 
    Safety, ProjectImage, ProgressReport
)

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'user_type')

class ProjectImageSerializer(serializers.ModelSerializer):
    uploaded_by = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = ProjectImage
        fields = '__all__'

class TaskListSerializer(serializers.ModelSerializer):
    assignees = UserMiniSerializer(many=True, read_only=True)
    
    class Meta:
        model = Task
        fields = ('id', 'name', 'status', 'priority', 'start_date', 'due_date', 'assignees')

class TaskDetailSerializer(serializers.ModelSerializer):
    assignees = UserMiniSerializer(many=True, read_only=True)
    dependencies = serializers.PrimaryKeyRelatedField(many=True, queryset=Task.objects.all())
    
    class Meta:
        model = Task
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    supplier = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = Material
        fields = '__all__'

class ResourceAllocationSerializer(serializers.ModelSerializer):
    material = MaterialSerializer(read_only=True)
    
    class Meta:
        model = ResourceAllocation
        fields = '__all__'

class SafetySerializer(serializers.ModelSerializer):
    reported_by = UserMiniSerializer(read_only=True)
    assigned_to = UserMiniSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Safety
        fields = '__all__'

class ProgressReportSerializer(serializers.ModelSerializer):
    submitted_by = UserMiniSerializer(read_only=True)
    tasks_completed = TaskListSerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProgressReport
        fields = '__all__'

class ProjectListSerializer(serializers.ModelSerializer):
    project_manager = UserMiniSerializer(read_only=True)
    client = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = ('id', 'name', 'slug', 'project_type', 'location', 'start_date', 
                 'expected_end_date', 'status', 'budget', 'client', 'project_manager',
                 'completion_percentage', 'is_delayed')

class ProjectDetailSerializer(serializers.ModelSerializer):
    project_manager = UserMiniSerializer(read_only=True)
    client = UserMiniSerializer(read_only=True)
    team_members = UserMiniSerializer(many=True, read_only=True)
    tasks = TaskListSerializer(many=True, read_only=True)
    resource_allocations = ResourceAllocationSerializer(many=True, read_only=True)
    safety_incidents = SafetySerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    progress_reports = ProgressReportSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
