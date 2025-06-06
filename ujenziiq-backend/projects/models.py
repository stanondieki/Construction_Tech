from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid

class Project(models.Model):
    """
    Main project model for construction projects
    """
    PROJECT_STATUS_CHOICES = (
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    PROJECT_TYPE_CHOICES = (
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('industrial', 'Industrial'),
        ('infrastructure', 'Infrastructure'),
        ('renovation', 'Renovation'),
        ('other', 'Other'),
    )
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    location = models.CharField(max_length=255)
    gps_coordinates = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField()
    expected_end_date = models.DateField()
    actual_end_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=PROJECT_STATUS_CHOICES, default='planning')
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_projects')
    project_manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='managed_projects')
    team_members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_projects', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure uniqueness
            if Project.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def completion_percentage(self):
        completed_tasks = self.tasks.filter(status='completed').count()
        total_tasks = self.tasks.count()
        if total_tasks > 0:
            return int((completed_tasks / total_tasks) * 100)
        return 0
    
    @property
    def is_delayed(self):
        import datetime
        return self.status == 'in_progress' and self.expected_end_date < datetime.date.today()


class Task(models.Model):
    """
    Tasks within a construction project
    """
    TASK_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('blocked', 'Blocked'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    start_date = models.DateField()
    due_date = models.DateField()
    assignees = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_tasks')
    dependencies = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='dependent_tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.project.name}"
    
    class Meta:
        ordering = ['due_date', 'priority']


class Material(models.Model):
    """
    Construction materials used in projects
    """
    UNIT_CHOICES = (
        ('kg', 'Kilograms'),
        ('ton', 'Tonnes'),
        ('pc', 'Pieces'),
        ('l', 'Liters'),
        ('m', 'Meters'),
        ('m2', 'Square Meters'),
        ('m3', 'Cubic Meters'),
        ('bag', 'Bags'),
    )
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=5, choices=UNIT_CHOICES)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='supplied_materials')
    
    def __str__(self):
        return f"{self.name} ({self.get_unit_display()})"


class ResourceAllocation(models.Model):
    """
    Allocation of materials to projects
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='resource_allocations')
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    allocated_date = models.DateField()
    received_date = models.DateField(blank=True, null=True)
    received_quantity = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.material.name} - {self.quantity} {self.material.get_unit_display()} for {self.project.name}"
    
    @property
    def is_fully_received(self):
        return self.received_date is not None and self.received_quantity is not None and self.received_quantity >= self.quantity


class Safety(models.Model):
    """
    Safety incidents model
    """
    SEVERITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    STATUS_CHOICES = (
        ('reported', 'Reported'),
        ('under_investigation', 'Under Investigation'),
        ('resolved', 'Resolved'),
    )
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='safety_incidents')
    title = models.CharField(max_length=255)
    description = models.TextField()
    date_occurred = models.DateTimeField()
    location_in_site = models.CharField(max_length=255)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='reported')
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reported_incidents')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_incidents')
    resolution_notes = models.TextField(blank=True, null=True)
    images = models.ManyToManyField('ProjectImage', blank=True, related_name='safety_incidents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.project.name}"


class ProjectImage(models.Model):
    """
    Images related to projects, tasks, or incidents
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='project_images/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


class ProgressReport(models.Model):
    """
    Daily/weekly progress reports for projects
    """
    REPORT_TYPE_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('special', 'Special'),
    )
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='progress_reports')
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    summary = models.TextField()
    period_start = models.DateField()
    period_end = models.DateField()
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    submission_date = models.DateTimeField(auto_now_add=True)
    tasks_completed = models.ManyToManyField(Task, blank=True, related_name='completion_reports')
    materials_used = models.TextField(blank=True, null=True)
    challenges = models.TextField(blank=True, null=True)
    next_steps = models.TextField(blank=True, null=True)
    images = models.ManyToManyField(ProjectImage, blank=True, related_name='progress_reports')
    
    def __str__(self):
        return f"{self.title} - {self.project.name} ({self.period_start} to {self.period_end})"
