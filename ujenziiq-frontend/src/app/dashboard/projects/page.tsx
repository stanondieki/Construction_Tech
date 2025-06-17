'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectsAPI } from '@/lib/api/api';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { PlusIcon, SearchIcon } from '@/components/icons/Icons';

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be:
        // const response = await projectsAPI.getAll();
        // setProjects(response.data);
        
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
          { 
            id: '4', 
            name: 'School Renovation', 
            location: 'Kampala, Uganda',
            status: 'completed',
            progress: 100,
            budget: 5000000,
            startDate: '2022-06-01',
            endDate: '2022-12-15',
            description: 'Renovation of 5 public schools in Kampala',
            clientName: 'Uganda Ministry of Education'
          },
          { 
            id: '5', 
            name: 'Solar Power Plant', 
            location: 'Arusha, Tanzania',
            status: 'planning',
            progress: 10,
            budget: 75000000,
            startDate: '2023-07-01',
            endDate: '2024-12-31',
            description: '50MW solar power plant installation',
            clientName: 'East African Energy Consortium'
          },
          { 
            id: '6', 
            name: 'Water Treatment Facility', 
            location: 'Nakuru, Kenya',
            status: 'in_progress',
            progress: 45,
            budget: 35000000,
            startDate: '2022-11-01',
            endDate: '2023-10-31',
            description: 'Modern water treatment facility serving 250,000 residents',
            clientName: 'Nakuru County Government'
          },
        ];
        
        setProjects(mockProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search query and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const CreateProjectButton = (
    <Link
      href="/dashboard/projects/new"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      New Project
    </Link>
  );

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Projects" 
        description="Manage your construction projects" 
        actions={CreateProjectButton}
      />
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search projects..."
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
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Projects List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first project'}
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
  );
}
