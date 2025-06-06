from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Project, Task, Material, ResourceAllocation,
    Safety, ProjectImage, ProgressReport
)
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer, TaskListSerializer,
    TaskDetailSerializer, MaterialSerializer, ResourceAllocationSerializer,
    SafetySerializer, ProjectImageSerializer, ProgressReportSerializer
)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'project_type']
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['start_date', 'expected_end_date', 'created_at', 'name']
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return ProjectDetailSerializer
        return ProjectListSerializer
    
    @action(detail=False, methods=['get'])
    def my_projects(self, request):
        user = request.user
        projects = Project.objects.filter(
            Q(project_manager=user) | 
            Q(client=user) | 
            Q(team_members=user)
        ).distinct()
        
        serializer = ProjectListSerializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        project = self.get_object()
        
        # Aggregate dashboard data
        pending_tasks = Task.objects.filter(project=project, status='pending').count()
        completed_tasks = Task.objects.filter(project=project, status='completed').count()
        recent_safety = Safety.objects.filter(project=project).order_by('-date_occurred')[:5]
        recent_materials = ResourceAllocation.objects.filter(project=project).order_by('-allocated_date')[:5]
        
        # Project completion percentage is already a property on the model
        completion = project.completion_percentage
        
        data = {
            'project': ProjectDetailSerializer(project).data,
            'task_summary': {
                'pending': pending_tasks,
                'completed': completed_tasks,
                'completion_percentage': completion
            },
            'recent_safety': SafetySerializer(recent_safety, many=True).data,
            'recent_materials': ResourceAllocationSerializer(recent_materials, many=True).data
        }
        
        return Response(data)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'project']
    search_fields = ['name', 'description']
    ordering_fields = ['due_date', 'start_date', 'priority']
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return TaskDetailSerializer
        return TaskListSerializer
    
    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        user = request.user
        tasks = Task.objects.filter(assignees=user)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class ResourceAllocationViewSet(viewsets.ModelViewSet):
    queryset = ResourceAllocation.objects.all()
    serializer_class = ResourceAllocationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['project']
    ordering_fields = ['allocated_date', 'received_date']

class SafetyViewSet(viewsets.ModelViewSet):
    queryset = Safety.objects.all()
    serializer_class = SafetySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'severity', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['date_occurred']

class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project']
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class ProgressReportViewSet(viewsets.ModelViewSet):
    queryset = ProgressReport.objects.all()
    serializer_class = ProgressReportSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['project', 'report_type']
    ordering_fields = ['period_start', 'period_end', 'submission_date']
    
    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)
