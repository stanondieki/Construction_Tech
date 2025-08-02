from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from projects.models import Project, Task
from communication.models import Notification
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates sample data for development'

    def handle(self, *args, **options):
        # Get or create users
        try:
            admin_user = User.objects.get(username='admin')
        except User.DoesNotExist:
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@contech.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            admin_user.user_type = 'admin'
            admin_user.save()

        try:
            manager_user = User.objects.get(username='manager')
        except User.DoesNotExist:
            manager_user = User.objects.create_user(
                username='manager',
                email='manager@contech.com',
                password='manager123',
                first_name='John',
                last_name='Manager'
            )
            manager_user.user_type = 'project_manager'
            manager_user.save()

        try:
            client_user = User.objects.get(username='client')
        except User.DoesNotExist:
            client_user = User.objects.create_user(
                username='client',
                email='client@contech.com',
                password='client123',
                first_name='Jane',
                last_name='Client'
            )
            client_user.user_type = 'client'
            client_user.save()

        # Create sample projects
        projects_data = [
            {
                'name': 'Residential Complex Nairobi',
                'description': 'Modern residential complex with 200 units in Nairobi',
                'project_type': 'residential',
                'location': 'Nairobi, Kenya',
                'status': 'in_progress',
                'budget': 25000000,
                'start_date': date.today() - timedelta(days=90),
                'expected_end_date': date.today() + timedelta(days=180),
            },
            {
                'name': 'Commercial Tower Dar es Salaam',
                'description': 'Mixed-use commercial tower with office spaces',
                'project_type': 'commercial',
                'location': 'Dar es Salaam, Tanzania',
                'status': 'planning',
                'budget': 45000000,
                'start_date': date.today() + timedelta(days=30),
                'expected_end_date': date.today() + timedelta(days=365),
            },
            {
                'name': 'Highway Expansion Mombasa',
                'description': 'Expansion of the Mombasa-Nairobi highway',
                'project_type': 'infrastructure',
                'location': 'Mombasa, Kenya',
                'status': 'on_hold',
                'budget': 100000000,
                'start_date': date.today() - timedelta(days=30),
                'expected_end_date': date.today() + timedelta(days=300),
            },
            {
                'name': 'Shopping Mall Kampala',
                'description': 'Modern shopping complex in Kampala city center',
                'project_type': 'commercial',
                'location': 'Kampala, Uganda',
                'status': 'completed',
                'budget': 15000000,
                'start_date': date.today() - timedelta(days=365),
                'expected_end_date': date.today() - timedelta(days=30),
                'actual_end_date': date.today() - timedelta(days=30),
            },
        ]

        created_projects = []
        for project_data in projects_data:
            project, created = Project.objects.get_or_create(
                name=project_data['name'],
                defaults={
                    **project_data,
                    'client': client_user,
                    'project_manager': manager_user,
                }
            )
            created_projects.append(project)
            if created:
                self.stdout.write(f'Created project: {project.name}')

        # Create sample tasks
        task_templates = [
            ('Foundation inspection', 'high', 'completed'),
            ('Electrical wiring installation', 'medium', 'in_progress'),
            ('Site survey and mapping', 'high', 'pending'),
            ('Environmental impact assessment', 'high', 'blocked'),
            ('Material procurement', 'medium', 'completed'),
            ('Safety compliance check', 'high', 'in_progress'),
            ('Quality assurance review', 'medium', 'pending'),
            ('Final inspection', 'critical', 'pending'),
        ]

        for project in created_projects[:3]:  # Only for active projects
            for i, (task_name, priority, status) in enumerate(task_templates):
                task, created = Task.objects.get_or_create(
                    name=task_name,
                    project=project,
                    defaults={
                        'description': f'{task_name} for {project.name}',
                        'priority': priority,
                        'status': status,
                        'start_date': project.start_date + timedelta(days=i*10),
                        'due_date': project.start_date + timedelta(days=i*10 + 30),
                    }
                )
                if created:
                    task.assignees.add(manager_user)
                    self.stdout.write(f'Created task: {task.name} for {project.name}')

        # Create sample notifications
        notifications_data = [
            {
                'title': 'Project Milestone Reached',
                'message': 'Residential Complex Nairobi has reached 50% completion',
                'notification_type': 'milestone',
            },
            {
                'title': 'Safety Alert', 
                'message': 'Safety inspection scheduled for tomorrow',
                'notification_type': 'safety_incident',
            },
            {
                'title': 'Task Overdue',
                'message': 'Environmental impact assessment is overdue',
                'notification_type': 'deadline',
            },
        ]

        for notification_data in notifications_data:
            notification, created = Notification.objects.get_or_create(
                title=notification_data['title'],
                user=manager_user,
                defaults=notification_data
            )
            if created:
                self.stdout.write(f'Created notification: {notification.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
