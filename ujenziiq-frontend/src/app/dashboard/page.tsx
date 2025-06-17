'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Import APIs but don't use them directly in this demo
// import { projectsAPI, tasksAPI, safetyAPI } from '@/lib/api/api';
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

// Define types for our dashboard data
type Project = {
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

type Task = {
  id: string;
  name: string;
  project: { id: string; name: string };
  assignee: { id: string; name: string };
  status: string;
  priority: string;
  dueDate: string;
};

type SafetyIncident = {
  id: string;
  title: string;
  project: { id: string; name: string };
  reportedBy: { id: string; name: string };
  status: string;
  severity: string;
  date: string;
  description: string;
};

type DashboardStats = {
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  onHoldProjects: number;
  delayedTasks: number;
  safetyIncidents: number;
  materialUtilization: number;
};

type DashboardData = {
  projects: Project[];
  tasks: Task[];
  safety: SafetyIncident[];
  stats: DashboardStats;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    projects: [],
    tasks: [],
    safety: [],
    stats: {
      totalProjects: 0,
      completedProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      onHoldProjects: 0,
      delayedTasks: 0,
      safetyIncidents: 0,
      materialUtilization: 0
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // For simplicity, we're using mock data instead of real API calls
        // In a real implementation, you would:
        // const projectsResponse = await projectsAPI.getMyProjects();
        // const tasksResponse = await tasksAPI.getMyTasks();
        // const safetyResponse = await safetyAPI.getAll();
        
        // Mock data for demonstration
        const mockData = {
          projects: [
            { 
              id: '1', 
              name: 'Residential Complex', 
              location: 'Nairobi, Kenya',
              status: 'in_progress',
              progress: 65,
              budget: 25000000,
              startDate: '2023-01-15',
              endDate: '2023-12-31',
              description: 'Modern residential complex with 200 units',
              clientName: 'EastAfrica Housing Ltd'
            },
            { 
              id: '2', 
              name: 'Commercial Tower', 
              location: 'Dar es Salaam, Tanzania',
              status: 'planning',
              progress: 20,
              budget: 45000000,
              startDate: '2023-03-01',
              endDate: '2024-06-30',
              description: 'Mixed-use commercial tower with office spaces and retail outlets',
              clientName: 'Tanzania Development Corp'
            },
            { 
              id: '3', 
              name: 'Highway Expansion', 
              location: 'Mombasa, Kenya',
              status: 'on_hold',
              progress: 30,
              budget: 100000000,
              startDate: '2022-10-15',
              endDate: '2023-10-15',
              description: 'Expansion of the Mombasa-Nairobi highway with additional lanes',
              clientName: 'Kenya National Highways Authority'
            },
          ],
          tasks: [
            {
              id: '1',
              name: 'Foundation inspection',
              project: { id: '1', name: 'Residential Complex' },
              assignee: { id: '1', name: 'John Doe' },
              status: 'completed',
              priority: 'high',
              dueDate: '2023-04-15',
            },
            {
              id: '2',
              name: 'Electrical wiring installation',
              project: { id: '1', name: 'Residential Complex' },
              assignee: { id: '2', name: 'Jane Smith' },
              status: 'in_progress',
              priority: 'medium',
              dueDate: '2023-06-30',
            },
            {
              id: '3',
              name: 'Site survey and mapping',
              project: { id: '2', name: 'Commercial Tower' },
              assignee: { id: '3', name: 'David Kimani' },
              status: 'pending',
              priority: 'high',
              dueDate: '2023-03-15',
            },
            {
              id: '4',
              name: 'Environmental impact assessment',
              project: { id: '3', name: 'Highway Expansion' },
              assignee: { id: '4', name: 'Grace Mwangi' },
              status: 'blocked',
              priority: 'high',
              dueDate: '2023-01-30',
            },
          ],
          safety: [
            {
              id: '1',
              title: 'Falling debris incident',
              project: { id: '1', name: 'Residential Complex' },
              reportedBy: { id: '2', name: 'Jane Smith' },
              status: 'under_investigation',
              severity: 'medium',
              date: '2023-05-10',
              description: 'Worker narrowly missed by falling debris from scaffold',
            },
            {
              id: '2',
              title: 'Equipment malfunction',
              project: { id: '3', name: 'Highway Expansion' },
              reportedBy: { id: '4', name: 'Grace Mwangi' },
              status: 'resolved',
              severity: 'low',
              date: '2023-02-22',
              description: 'Crane hydraulic system failure during non-operational hours',
            },
          ],
          stats: {
            totalProjects: 5,
            completedProjects: 1,
            totalTasks: 28,
            completedTasks: 15,
            onHoldProjects: 1,
            delayedTasks: 4,
            safetyIncidents: 3,
            materialUtilization: 78
          }
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { 
    totalProjects, 
    completedProjects, 
    totalTasks, 
    completedTasks,
    onHoldProjects,
    delayedTasks,
    safetyIncidents,
    materialUtilization
  } = dashboardData.stats;

  const projectCompletionRate = calculatePercentage(completedProjects, totalProjects);
  const taskCompletionRate = calculatePercentage(completedTasks, totalTasks);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description={`Welcome back, ${user?.firstName || 'User'}`} />
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Project Completion" 
          value={`${projectCompletionRate}%`}
          description={`${completedProjects} of ${totalProjects} Projects`}
          icon={CheckCircleIcon}
          trend={projectCompletionRate > 50 ? 'up' : 'neutral'}
          trendText={projectCompletionRate > 50 ? 'On track' : 'Needs attention'}
        />
        
        <DashboardCard 
          title="Task Completion" 
          value={`${taskCompletionRate}%`}
          description={`${completedTasks} of ${totalTasks} Tasks`}
          icon={ClockIcon}
          trend={taskCompletionRate > 70 ? 'up' : 'neutral'}
          trendText={taskCompletionRate > 70 ? 'Good progress' : 'Needs focus'}
        />
        
        <DashboardCard 
          title="Projects On Hold" 
          value={onHoldProjects}
          description={`${calculatePercentage(onHoldProjects, totalProjects)}% of all projects`}
          icon={AlertCircleIcon}
          trend={onHoldProjects > 0 ? 'down' : 'up'}
          trendText={onHoldProjects > 0 ? 'Requires attention' : 'All projects active'}
          isDanger={onHoldProjects > 0}
        />
        
        <DashboardCard 
          title="Material Utilization" 
          value={`${materialUtilization}%`}
          description="Resource efficiency"
          icon={TrendingUpIcon}
          trend={materialUtilization > 75 ? 'up' : 'down'}
          trendText={materialUtilization > 75 ? 'Efficient usage' : 'Overuse detected'}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Progress</h3>
          <div className="h-64">
            <ProjectProgressChart projects={dashboardData.projects} />
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
          {dashboardData.projects.length === 0 ? (
            <p className="py-4 text-center text-gray-500">No projects found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {dashboardData.projects.slice(0, 3).map((project) => (
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
            {dashboardData.tasks.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No tasks found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {dashboardData.tasks.slice(0, 4).map((task) => (
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
          
          <div className="divide-y divide-gray-200 p-4">
            {dashboardData.safety.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No safety incidents reported</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.safety.map((incident) => (
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
