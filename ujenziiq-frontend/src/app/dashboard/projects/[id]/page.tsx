'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectsAPI, tasksAPI } from '@/lib/api/api';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { formatDate, formatCurrency, calculatePercentage, getStatusColor, cn } from '@/lib/utils/helpers';
import { 
  EditIcon, 
  ClockIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  PlusIcon
} from '@/components/icons/Icons';
import { TaskListItem } from '@/components/tasks/TaskListItem';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be:
        // const projectResponse = await projectsAPI.getById(params.id);
        // setProject(projectResponse.data);
        // const tasksResponse = await projectsAPI.getTasks(params.id);
        // setTasks(tasksResponse.data);
        
        // Mock data for demonstration
        const mockProjects = [
          { 
            id: '1', 
            name: 'Residential Complex', 
            location: 'Nairobi, Kenya',
            status: 'in_progress',
            progress: 65,
            budget: 25000000,
            startDate: '2023-01-15',
            endDate: '2023-12-31',
            description: 'Modern residential complex with 200 units featuring contemporary architecture and sustainable design elements. The project includes residential towers, community spaces, and landscaped gardens.',
            clientName: 'EastAfrica Housing Ltd',
            manager: {
              id: '1',
              name: 'John Kamau',
              email: 'john.kamau@ujenziiq.com',
              phone: '+254712345678'
            },
            team: [
              { id: '2', name: 'Mary Wanjiku', role: 'Site Engineer' },
              { id: '3', name: 'Peter Ochieng', role: 'Architect' },
              { id: '4', name: 'Sarah Mutua', role: 'Procurement Officer' }
            ]
          },
          // Other projects...
        ];
        
        const mockTasks = [
          {
            id: '1',
            name: 'Foundation inspection',
            project: { id: '1', name: 'Residential Complex' },
            assignee: { id: '2', name: 'Mary Wanjiku' },
            status: 'completed',
            priority: 'high',
            dueDate: '2023-04-15',
          },
          {
            id: '2',
            name: 'Electrical wiring installation',
            project: { id: '1', name: 'Residential Complex' },
            assignee: { id: '3', name: 'Peter Ochieng' },
            status: 'in_progress',
            priority: 'medium',
            dueDate: '2023-06-30',
          },
          {
            id: '5',
            name: 'Plumbing installation for Block A',
            project: { id: '1', name: 'Residential Complex' },
            assignee: { id: '4', name: 'Sarah Mutua' },
            status: 'pending',
            priority: 'medium',
            dueDate: '2023-07-15',
          },
          {
            id: '6',
            name: 'Roofing work for community center',
            project: { id: '1', name: 'Residential Complex' },
            assignee: { id: '2', name: 'Mary Wanjiku' },
            status: 'blocked',
            priority: 'high',
            dueDate: '2023-05-30',
          },
        ];
        
        // Find the project with the matching ID
        const foundProject = mockProjects.find(p => p.id === params.id);
        if (!foundProject) {
          notFound();
        }
        
        setProject(foundProject);
        
        // Filter tasks for this project
        const projectTasks = mockTasks.filter(t => t.project.id === params.id);
        setTasks(projectTasks);
      } catch (error) {
        console.error('Error fetching project data:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  // Format status for display
  const displayStatus = project.status.replace('_', ' ').replace(/\b\w/g, (match) => match.toUpperCase());

  const tasksByStatus = {
    completed: tasks.filter(t => t.status === 'completed').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  const EditButton = (
    <Link
      href={`/dashboard/projects/${params.id}/edit`}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <EditIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      Edit Project
    </Link>
  );

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title={project.name}
        description={project.location}
        actions={EditButton}
      />
      
      {/* Project Summary */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn(
                  'px-3 py-1 text-sm font-medium rounded-full',
                  getStatusColor(project.status)
                )}>
                  {displayStatus}
                </span>
                
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                  Budget: {formatCurrency(project.budget)}
                </span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Project Description</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Client</h4>
                  <p className="text-gray-900">{project.clientName}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Project Manager</h4>
                  <p className="text-gray-900">{project.manager.name}</p>
                  <p className="text-sm text-gray-500">{project.manager.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                  <p className="text-gray-900">{formatDate(project.startDate)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                  <p className="text-gray-900">{formatDate(project.endDate)}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.team.map((member) => (
                  <div key={member.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Overall Completion</span>
                    <span className="text-gray-500">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={cn(
                        "h-4 rounded-full",
                        project.progress < 25 ? "bg-red-500" : 
                        project.progress < 75 ? "bg-yellow-500" : 
                        "bg-green-500"
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-gray-700 mb-2">Task Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <span className="text-sm font-medium">{tasksByStatus.completed}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">In Progress</span>
                    </div>
                    <span className="text-sm font-medium">{tasksByStatus.in_progress}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <span className="text-sm font-medium">{tasksByStatus.pending}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">Blocked</span>
                    </div>
                    <span className="text-sm font-medium">{tasksByStatus.blocked}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                </div>
                
                <div className="space-y-2">
                  <Link 
                    href={`/dashboard/projects/${params.id}/tasks/new`}
                    className="block w-full text-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="inline-block -ml-1 mr-2 h-5 w-5" />
                    Add Task
                  </Link>
                  
                  <Link 
                    href={`/dashboard/projects/${params.id}/reports/new`}
                    className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Create Report
                  </Link>
                  
                  <Link 
                    href={`/dashboard/projects/${params.id}/materials`}
                    className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Manage Materials
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Tasks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
          <Link 
            href={`/dashboard/projects/${params.id}/tasks`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all tasks
          </Link>
        </div>
        
        <div>
          {tasks.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No tasks found for this project</p>
              <Link 
                href={`/dashboard/projects/${params.id}/tasks/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Task
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
