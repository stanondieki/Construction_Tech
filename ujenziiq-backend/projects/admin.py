from django.contrib import admin
from .models import (
    Project, Task, Material, ResourceAllocation, 
    Safety, ProjectImage, ProgressReport
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'project_type', 'location', 'status', 'start_date', 'expected_end_date', 'budget')
    list_filter = ('status', 'project_type')
    search_fields = ('name', 'description', 'location')
    prepopulated_fields = {'slug': ('name',)}
    date_hierarchy = 'start_date'
    filter_horizontal = ('team_members',)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'status', 'priority', 'start_date', 'due_date')
    list_filter = ('status', 'priority')
    search_fields = ('name', 'description')
    date_hierarchy = 'due_date'
    filter_horizontal = ('assignees', 'dependencies')


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit', 'unit_price', 'supplier')
    list_filter = ('unit',)
    search_fields = ('name', 'description')


@admin.register(ResourceAllocation)
class ResourceAllocationAdmin(admin.ModelAdmin):
    list_display = ('project', 'material', 'quantity', 'allocated_date', 'received_date', 'is_fully_received')
    list_filter = ('allocated_date', 'received_date')
    search_fields = ('project__name', 'material__name')
    date_hierarchy = 'allocated_date'


@admin.register(Safety)
class SafetyAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'date_occurred', 'severity', 'status')
    list_filter = ('severity', 'status')
    search_fields = ('title', 'description')
    date_hierarchy = 'date_occurred'
    filter_horizontal = ('images',)


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'uploaded_by', 'upload_date')
    list_filter = ('upload_date',)
    search_fields = ('title', 'description')
    date_hierarchy = 'upload_date'


@admin.register(ProgressReport)
class ProgressReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'report_type', 'period_start', 'period_end', 'submitted_by')
    list_filter = ('report_type', 'submission_date')
    search_fields = ('title', 'summary')
    date_hierarchy = 'period_start'
    filter_horizontal = ('tasks_completed', 'images')
