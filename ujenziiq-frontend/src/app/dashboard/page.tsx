'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { calculatePercentage } from '@/lib/utils/helpers';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  AlertCircleIcon, 
  TrendingUpIcon,
  PlusIcon
} from '@/components/icons/Icons';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { TaskListItem } from '@/components/tasks/TaskListItem';
import { SafetyIncidentCard } from '@/components/safety/SafetyIncidentCard';
import { ProjectProgressChart } from '@/components/charts/ProjectProgressChart';
import { ResourceAllocationChart } from '@/components/charts/ResourceAllocationChart';

// Import API services
import { 
  DashboardAPI, 
  Project, 
  Task, 
  SafetyIncident, 
  DashboardStats 
} from '@/lib/api/services';

type DashboardData = {
  projects: Project[];
  tasks: Task[];
  safety: SafetyIncident[];
  stats: DashboardStats;
};

// Legacy component props types for compatibility
type LegacyProject = {
  id: string;
  name: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  description: string;
  clientName: string;
};

type LegacyTask = {
  id: string;
  name: string;
  project: { id: string; name: string };
  assignee: { id: string; name: string };
  status: string;
  priority: string;
  dueDate: string;
};

type LegacySafetyIncident = {
  id: string;
  title: string;
  project: { id: string; name: string };
  reportedBy: { id: string; name: string };
  status: string;
  severity: string;
  date: string;
  description: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    projects: [],
    tasks: [],
    safety: [],
    stats: {
      total_projects: 0,
      completed_projects: 0,
      total_tasks: 0,
      completed_tasks: 0,
      on_hold_projects: 0,
      delayed_tasks: 0,
      safety_incidents: 0,
      material_utilization: 0
    }
  });

  // Convert API data to legacy format for component compatibility
  const convertToLegacyProject = (project: Project): LegacyProject => ({
    id: String(project.id),
    name: project.name,
    location: project.location,
    status: project.status,
    progress: project.completion_percentage,
    budget: parseFloat(project.budget),
    startDate: project.start_date,
    endDate: project.expected_end_date,
    description: project.description,
    clientName: project.client.first_name + ' ' + project.client.last_name
  });

  const convertToLegacyTask = (task: Task): LegacyTask => ({
    id: String(task.id),
    name: task.name,
    project: { id: String(task.project.id), name: task.project.name },
    assignee: { 
      id: String(task.assignees[0]?.id || 0), 
      name: task.assignees[0] ? `${task.assignees[0].first_name} ${task.assignees[0].last_name}` : 'Unassigned'
    },
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date
  });

  const convertToLegacySafetyIncident = (incident: SafetyIncident): LegacySafetyIncident => ({
    id: String(incident.id),
    title: incident.title,
    project: { id: String(incident.project.id), name: incident.project.name },
    reportedBy: { 
      id: String(incident.reported_by.id), 
      name: `${incident.reported_by.first_name} ${incident.reported_by.last_name}`
    },
    status: incident.status,
    severity: incident.severity,
    date: incident.reported_date,
    description: incident.description
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the real API to fetch dashboard data
        const data = await DashboardAPI.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
        
        // Fallback to empty data on error
        setDashboardData({
          projects: [],
          tasks: [],
          safety: [],
          stats: {
            total_projects: 0,
            completed_projects: 0,
            total_tasks: 0,
            completed_tasks: 0,
            on_hold_projects: 0,
            delayed_tasks: 0,
            safety_incidents: 0,
            material_utilization: 0
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { 
    total_projects, 
    completed_projects, 
    total_tasks, 
    completed_tasks,
    on_hold_projects,
    material_utilization
  } = dashboardData.stats;

  const projectCompletionRate = calculatePercentage(completed_projects, total_projects);
  const taskCompletionRate = calculatePercentage(completed_tasks, total_tasks);

  // Convert data for legacy components
  const legacyProjects = dashboardData.projects.map(convertToLegacyProject);
  const legacyTasks = dashboardData.tasks.map(convertToLegacyTask);
  const legacySafetyIncidents = dashboardData.safety.map(convertToLegacySafetyIncident);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description={`Welcome back, ${user?.firstName || 'User'}`} />
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Project Completion" 
          value={`${projectCompletionRate}%`}
          description={`${completed_projects} of ${total_projects} Projects`}
          icon={CheckCircleIcon}
          trend={projectCompletionRate > 50 ? 'up' : 'neutral'}
          trendText={projectCompletionRate > 50 ? 'On track' : 'Needs attention'}
        />
        
        <DashboardCard 
          title="Task Completion" 
          value={`${taskCompletionRate}%`}
          description={`${completed_tasks} of ${total_tasks} Tasks`}
          icon={ClockIcon}
          trend={taskCompletionRate > 70 ? 'up' : 'neutral'}
          trendText={taskCompletionRate > 70 ? 'Good progress' : 'Needs focus'}
        />
        
        <DashboardCard 
          title="Projects On Hold" 
          value={on_hold_projects}
          description={`${calculatePercentage(on_hold_projects, total_projects)}% of all projects`}
          icon={AlertCircleIcon}
          trend={on_hold_projects > 0 ? 'down' : 'up'}
          trendText={on_hold_projects > 0 ? 'Requires attention' : 'All projects active'}
          isDanger={on_hold_projects > 0}
        />
        
        <DashboardCard 
          title="Material Utilization" 
          value={`${material_utilization}%`}
          description="Resource efficiency"
          icon={TrendingUpIcon}
          trend={material_utilization > 75 ? 'up' : 'down'}
          trendText={material_utilization > 75 ? 'Efficient usage' : 'Overuse detected'}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Progress</h3>
          <div className="h-64">
            <ProjectProgressChart projects={legacyProjects} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Allocation</h3>
          <div className="h-64">
            <ResourceAllocationChart />
          </div>
        </div>
      </div>
      
      {/* My Projects */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">My Projects</h3>
          <Link 
            href="/dashboard/projects" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all projects
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {legacyProjects.length === 0 ? (
            <p className="py-4 text-center text-gray-500">No projects found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {legacyProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              
              <Link 
                href="/dashboard/projects/new" 
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <div className="text-center">
                  <PlusIcon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">New Project</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Tasks and Safety */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
            <Link 
              href="/dashboard/tasks" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all tasks
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {legacyTasks.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No tasks found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {legacyTasks.slice(0, 4).map((task) => (
                  <TaskListItem key={task.id} task={task} />
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Safety Incidents */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Safety Incidents</h3>
            <Link 
              href="/dashboard/safety" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all incidents
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {legacySafetyIncidents.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No safety incidents reported</p>
            ) : (
              <div className="p-4 space-y-4">
                {legacySafetyIncidents.slice(0, 3).map((incident) => (
                  <SafetyIncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
