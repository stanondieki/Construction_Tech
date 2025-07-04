# Generated by Django 5.2.1 on 2025-05-17 19:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("projects", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="material",
            name="supplier",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="supplied_materials",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="progressreport",
            name="submitted_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="client",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="client_projects",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="project_manager",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="managed_projects",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="team_members",
            field=models.ManyToManyField(
                blank=True,
                related_name="assigned_projects",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="progressreport",
            name="project",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="progress_reports",
                to="projects.project",
            ),
        ),
        migrations.AddField(
            model_name="projectimage",
            name="project",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="images",
                to="projects.project",
            ),
        ),
        migrations.AddField(
            model_name="projectimage",
            name="uploaded_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="progressreport",
            name="images",
            field=models.ManyToManyField(
                blank=True, related_name="progress_reports", to="projects.projectimage"
            ),
        ),
        migrations.AddField(
            model_name="resourceallocation",
            name="material",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="projects.material"
            ),
        ),
        migrations.AddField(
            model_name="resourceallocation",
            name="project",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="resource_allocations",
                to="projects.project",
            ),
        ),
        migrations.AddField(
            model_name="safety",
            name="assigned_to",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="assigned_incidents",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="safety",
            name="images",
            field=models.ManyToManyField(
                blank=True, related_name="safety_incidents", to="projects.projectimage"
            ),
        ),
        migrations.AddField(
            model_name="safety",
            name="project",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="safety_incidents",
                to="projects.project",
            ),
        ),
        migrations.AddField(
            model_name="safety",
            name="reported_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="reported_incidents",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="task",
            name="assignees",
            field=models.ManyToManyField(
                related_name="assigned_tasks", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="task",
            name="dependencies",
            field=models.ManyToManyField(
                blank=True, related_name="dependent_tasks", to="projects.task"
            ),
        ),
        migrations.AddField(
            model_name="task",
            name="project",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tasks",
                to="projects.project",
            ),
        ),
        migrations.AddField(
            model_name="progressreport",
            name="tasks_completed",
            field=models.ManyToManyField(
                blank=True, related_name="completion_reports", to="projects.task"
            ),
        ),
    ]
