'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tasksAPI } from '@/lib/api/api';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlusIcon, SearchIcon, FilterIcon } from '@/components/icons/Icons';
import { TaskListItem } from '@/components/tasks/TaskListItem';

export default function TasksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be:
        // const response = await tasksAPI.getMyTasks();
        // setTasks(response.data);
        
        // Mock data for demonstration
        const mockTasks = [
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
          {
            id: '7',
            name: 'Final structural review',
            project: { id: '4', name: 'School Renovation' },
            assignee: { id: '1', name: 'John Doe' },
            status: 'completed',
            priority: 'medium',
            dueDate: '2022-11-20',
          },
          {
            id: '8',
            name: 'Security system installation',
            project: { id: '2', name: 'Commercial Tower' },
            assignee: { id: '3', name: 'David Kimani' },
            status: 'pending',
            priority: 'low',
            dueDate: '2023-04-30',
          },
        ];
        
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Extract unique projects for the filter
  const projects = [...new Set(tasks.map(task => JSON.stringify(task.project)))].map(project => JSON.parse(project));

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || task.project.id === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const CreateTaskButton = (
    <Link
      href="/dashboard/tasks/new"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      New Task
    </Link>
  );

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Tasks" 
        description="Manage your construction tasks" 
        actions={CreateTaskButton}
      />
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 sr-only">
            Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 sr-only">
            Priority
          </label>
          <select
            id="priority"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 sr-only">
            Project
          </label>
          <select
            id="project"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first task'}
            </p>
            <Link
              href="/dashboard/tasks/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Task
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <TaskListItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
