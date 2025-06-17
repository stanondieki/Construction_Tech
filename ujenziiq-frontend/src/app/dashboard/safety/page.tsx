'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { safetyAPI } from '@/lib/api/api';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlusIcon, SearchIcon } from '@/components/icons/Icons';
import { SafetyIncidentCard } from '@/components/safety/SafetyIncidentCard';

// Use the same interface as SafetyIncidentCard for consistency
interface SafetyIncident {
  id: string;
  title: string;
  description: string;
  project: {
    id: string;
    name: string;
  };
  status: string;
  severity: string;
  date: string;
  reportedBy: {
    id: string;
    name: string;
  };
}

export default function SafetyPage() {  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  useEffect(() => {
    const fetchSafetyIncidents = async () => {
      setIsLoading(true);
      try {
        // Try to fetch real data from the API
        const response = await safetyAPI.getAll();
          // Transform API response to the format expected by SafetyIncidentCard
        const transformedIncidents: SafetyIncident[] = response.data.map((incident: {
          id: string;
          title: string;
          description: string;
          project: string | { id: string; name: string };
          status: string;
          severity: string;
          date_occurred?: string;
          reported_by?: string | { id: string; first_name?: string; last_name?: string };
        }) => ({
          id: incident.id,
          title: incident.title,
          project: {
            id: typeof incident.project === 'string' ? incident.project : incident.project.id,
            name: typeof incident.project === 'string' ? 'Unknown Project' : incident.project.name,
          },
          reportedBy: {
            id: typeof incident.reported_by === 'string' ? incident.reported_by : (incident.reported_by?.id || ''),
            name: typeof incident.reported_by === 'string' 
              ? 'Unknown User' 
              : `${incident.reported_by?.first_name || ''} ${incident.reported_by?.last_name || ''}`.trim() || 'Unknown User',
          },
          status: incident.status,
          severity: incident.severity,
          date: incident.date_occurred?.split('T')[0] || new Date().toISOString().split('T')[0],
          description: incident.description,
        }));
        
        setIncidents(transformedIncidents);
        console.log('Successfully loaded incidents from API');
      } catch (error: unknown) {
        console.error('Error fetching safety incidents from API:', error);
        
        // Fallback to mock data when API is unavailable
        console.log('Using mock data as fallback');
        const mockIncidents: SafetyIncident[] = [
          {
            id: '1',
            title: 'Falling debris incident',
            project: { id: '1', name: 'Residential Complex' },
            reportedBy: { id: '2', name: 'Jane Smith' },
            status: 'under_investigation',
            severity: 'medium',
            date: '2023-05-10',
            description: 'Worker narrowly missed by falling debris from scaffold. No injuries reported, but incident highlights potential safety issue with securing materials at height.',
          },
          {
            id: '2',
            title: 'Equipment malfunction',
            project: { id: '3', name: 'Highway Expansion' },
            reportedBy: { id: '4', name: 'Grace Mwangi' },
            status: 'resolved',
            severity: 'low',
            date: '2023-02-22',
            description: 'Crane hydraulic system failure during non-operational hours. No injuries or damage, but equipment needs inspection and maintenance.',
          },
          {
            id: '3',
            title: 'Trench collapse',
            project: { id: '1', name: 'Residential Complex' },
            reportedBy: { id: '1', name: 'John Doe' },
            status: 'reported',
            severity: 'high',
            date: '2023-06-01',
            description: 'Minor trench collapse in excavation area. No workers were in the trench at the time. Need to reassess soil conditions and reinforce shoring.',
          },
          {
            id: '4',
            title: 'Worker slip and fall',
            project: { id: '2', name: 'Commercial Tower' },
            reportedBy: { id: '3', name: 'David Kimani' },
            status: 'resolved',
            severity: 'medium',
            date: '2023-03-15',
            description: 'Worker slipped on wet surface and sustained minor injuries. Area has been cordoned off and warning signs placed.',
          },
          {
            id: '5',
            title: 'Electrical hazard',
            project: { id: '4', name: 'School Renovation' },
            reportedBy: { id: '2', name: 'Jane Smith' },
            status: 'under_investigation',
            severity: 'high',
            date: '2023-04-05',
            description: 'Exposed electrical wiring discovered in classroom renovation area. No injuries reported, but immediate action required.',
          },
        ];
        
        setIncidents(mockIncidents);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSafetyIncidents();
  }, []);

  // Filter incidents based on search query and filters
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const ReportIncidentButton = (
    <Link
      href="/dashboard/safety/new"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      Report Incident
    </Link>
  );

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Safety" 
        description="Monitor and report safety incidents" 
        actions={ReportIncidentButton}
      />
      
      {/* Safety Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="text-lg font-bold">{incidents.length}</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Total Incidents</h3>
              <p className="text-xs text-gray-500">All reported incidents</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <span className="text-lg font-bold">
                {incidents.filter(i => i.status === 'under_investigation').length}
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Investigating</h3>
              <p className="text-xs text-gray-500">Incidents under review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <span className="text-lg font-bold">
                {incidents.filter(i => i.severity === 'high').length}
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">High Severity</h3>
              <p className="text-xs text-gray-500">Critical safety issues</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <span className="text-lg font-bold">
                {incidents.filter(i => i.status === 'resolved').length}
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Resolved</h3>
              <p className="text-xs text-gray-500">Addressed incidents</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search incidents..."
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
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 sr-only">
            Severity
          </label>
          <select
            id="severity"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      
      {/* Incidents List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No safety incidents found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || statusFilter !== 'all' || severityFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Report any safety incidents to maintain a safe workspace'}
          </p>
          <Link
            href="/dashboard/safety/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Report Incident
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIncidents.map((incident) => (
            <SafetyIncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
      
      {/* Safety Tips */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Safety Reminder</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Always report safety incidents immediately. Early reporting helps prevent future accidents and keeps everyone safe on site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
